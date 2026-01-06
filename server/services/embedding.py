from typing import Optional
from sentence_transformers import SentenceTransformer

_model: Optional[SentenceTransformer] = None

def embed_text(text: str):
    global _model
    if _model is None:
        _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _model.encode(text)
