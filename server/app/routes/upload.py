# app/routes/upload.py
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from app.utils.gridfs_utils import save_image_to_gridfs, get_image_from_gridfs
from app import database
from app.models import UploadResponse
from app.recognition import image_bytes_to_embedding, find_best_matches
import uuid
import datetime
import numpy as np
from bson import ObjectId

router = APIRouter()

def make_base_doc(image_code: str, image_id: str, role: str, embedding):
    return {
        "image_code": image_code,
        "image_id": image_id,
        "role": role,
        "embedding": embedding.tolist() if embedding is not None else None,
        "match_info": {
            "matched_parent_id": None,
            "matched_volunteer_id": None,
            "is_confirmed": False,
            "confirmed_at": None
        },
        "match_history": [],  # list of match events for analytics
        "created_at": datetime.datetime.utcnow()
    }

@router.post("/upload", response_model=UploadResponse)
async def upload(
    role: str = Form(...),  # "parent" or "volunteer"

    # Parent fields (optional for volunteer)
    parent_name: str = Form(None),
    parent_email: str = Form(None),
    parent_alt_email: str = Form(None),
    parent_phone: str = Form(None),
    parent_alt_phone: str = Form(None),

    # Volunteer fields (optional for parent)
    volunteer_name: str = Form(None),
    volunteer_email: str = Form(None),
    volunteer_alt_email: str = Form(None),
    volunteer_phone: str = Form(None),
    volunteer_alt_phone: str = Form(None),

    # Child / Found child fields (common shape but semantics differ)
    child_name: str = Form(...),
    child_age: int = Form(...),
    skin_complexion: str = Form(...),
    # allow multiple birthmarks by sending multiple 'birth_marks' fields in form
    birth_marks: list[str] = Form([]),
    city: str = Form(...),
    address: str = Form(None),

    photo: UploadFile = File(...)
):
    content = await photo.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty image")

    image_code = uuid.uuid4().hex[:12]
    image_id = save_image_to_gridfs(content, f"{image_code}.jpg")

    # compute embedding
    embedding = None
    try:
        embedding = image_bytes_to_embedding(content)
    except Exception as e:
        # don't fail entire request if model hiccups; mark embedding None
        print("Embedding error:", e)
        embedding = None

    # base doc
    doc = make_base_doc(image_code, image_id, role, embedding)

    # populate role-specific nested fields
    if role == "parent":
        doc["parent_info"] = {
            "name": parent_name,
            "email": parent_email,
            "alt_email": parent_alt_email,
            "phone": parent_phone,
            "alt_phone": parent_alt_phone
        }
        doc["child_info"] = {
            "name": child_name,
            "age": child_age,
            "skin_complexion": skin_complexion,
            "birth_marks": birth_marks or [],
            "city": city
        }

    elif role == "volunteer":
        doc["volunteer_info"] = {
            "name": volunteer_name,
            "email": volunteer_email,
            "alt_email": volunteer_alt_email,
            "phone": volunteer_phone,
            "alt_phone": volunteer_alt_phone
        }
        doc["found_child"] = {
            "name": child_name,
            "age": child_age,
            "skin_complexion": skin_complexion,
            "birth_marks": birth_marks or [],
            "city": city,
            "address": address
        }

    else:
        raise HTTPException(status_code=400, detail="role must be 'parent' or 'volunteer'")

    # insert submission
    res = database.submissions.insert_one(doc)
    new_id = res.inserted_id

    response = {
        "image_code": image_code,
        "message": "Uploaded successfully",
        "image_id": str(image_id),
        "role": role
    }

    # If volunteer, compute matches against parent embeddings
    if role == "volunteer" and embedding is not None:
        # fetch parents with embeddings
        parents_cursor = database.submissions.find({"role": "parent", "embedding": {"$ne": None}})
        candidates = []
        for p in parents_cursor:
            # p might have many fields; collect candidate tuple (name, emb ndarray, parent_doc_id)
            name = p.get("child_info", {}).get("name") or p.get("parent_info", {}).get("name") or "parent"
            emb_list = p.get("embedding")
            if emb_list:
                try:
                    emb_arr = np.array(emb_list, dtype=np.float32)
                except Exception:
                    emb_arr = None
            else:
                emb_arr = None
            candidates.append((name, emb_arr, str(p["_id"])))

        matches = find_best_matches(embedding, candidates, top_k=5)
        response["matches"] = matches

        # If there is a best match with decent efficiency, link docs (store match_info and match_history)
        if matches:
            best = matches[0]
            # tune threshold on efficiency (>= 0.4 as example)
            if best["efficiency"] >= 0.35:
                parent_doc_id = ObjectId(best["image_id"]) if ObjectId.is_valid(best["image_id"]) else None
                # However note: candidates stored parent doc id as third item (we stored str(p["_id"]))
                # we'll search parent by image_id match above: best["image_id"] currently holds parent image_id
                # We prefer to find parent doc by parent image_id stored in submissions.image_id
                parent_doc = database.submissions.find_one({"image_id": best["image_id"], "role": "parent"})
                if parent_doc:
                    parent_id = parent_doc["_id"]
                    # update parent doc: set matched_volunteer_id and append match_history
                    match_event = {
                        "volunteer_id": str(new_id),
                        "volunteer_image_id": str(image_id),
                        "distance": best["distance"],
                        "efficiency": best["efficiency"],
                        "timestamp": datetime.datetime.utcnow()
                    }
                    database.submissions.update_one(
                        {"_id": parent_id},
                        {
                            "$set": {"match_info.matched_volunteer_id": str(new_id)},
                            "$push": {"match_history": match_event}
                        }
                    )
                    # update volunteer doc: set matched_parent_id and append match_history
                    match_event_v = {
                        "parent_id": str(parent_id),
                        "parent_image_id": best["image_id"],
                        "distance": best["distance"],
                        "efficiency": best["efficiency"],
                        "timestamp": datetime.datetime.utcnow()
                    }
                    database.submissions.update_one(
                        {"_id": new_id},
                        {
                            "$set": {"match_info.matched_parent_id": str(parent_id)},
                            "$push": {"match_history": match_event_v}
                        }
                    )
                    # include linkage info in response
                    response["auto_matched"] = {
                        "parent_id": str(parent_id),
                        "parent_image_id": best["image_id"],
                        "distance": best["distance"],
                        "efficiency": best["efficiency"]
                    }

    return response
