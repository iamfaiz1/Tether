# app/utils/gridfs_utils.py
from bson import ObjectId
from app.database import fs

def save_image_to_gridfs(image_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> str:
    file_id = fs.put(image_bytes, filename=filename, content_type=content_type)
    return str(file_id)

def get_image_from_gridfs(file_id: str) -> bytes:
    grid_out = fs.get(ObjectId(file_id))
    return grid_out.read()

