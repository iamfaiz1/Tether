# app/recognition.py
import numpy as np
from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import io
from typing import List, Tuple, Optional
import time

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

mtcnn = MTCNN(image_size=160, margin=20, keep_all=False, device=device)
resnet = InceptionResnetV1(pretrained="vggface2").eval().to(device)

def image_bytes_to_embedding(img_bytes: bytes) -> Optional[np.ndarray]:
    try:
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception:
        return None
    face = mtcnn(img)
    if face is None:
        return None
    face = face.unsqueeze(0).to(device)
    with torch.no_grad():
        emb = resnet(face)
    return emb.detach().cpu().numpy()[0]

def euclidean_distance(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.linalg.norm(a - b))

def distance_to_efficiency(dist: float, max_dist: float = 1.2) -> float:
    """
    Convert Euclidean distance to a 0..1 efficiency score.
    Lower distance -> higher efficiency.
    max_dist: distance mapped to efficiency 0 (tune for your dataset)
    """
    eff = max(0.0, 1.0 - (dist / max_dist))
    return float(eff)

def find_best_matches(target_emb: np.ndarray, candidates: List[Tuple[str, np.ndarray, str]], top_k: int = 5):
    """
    candidates: list of (name, embedding ndarray, image_id)
    returns sorted list of matches with distance and efficiency
    """
    results = []
    for name, emb, image_id in candidates:
        if emb is None:
            continue
        dist = euclidean_distance(target_emb, emb)
        eff = distance_to_efficiency(dist)
        results.append({
            "name": name,
            "image_id": str(image_id),
            "distance": dist,
            "efficiency": eff
        })
    results.sort(key=lambda x: x["distance"])
    return results[:top_k]
