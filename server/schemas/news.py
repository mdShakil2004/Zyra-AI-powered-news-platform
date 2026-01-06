# schemas/news.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NewsResponse(BaseModel):
    id: int
    title: str
    summary: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    url: str
    source: str
    category: str
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # This is REQUIRED