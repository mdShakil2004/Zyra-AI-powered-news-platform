
# models/news.py


from sqlalchemy import Column, Integer, String, Text, DateTime
from pgvector.sqlalchemy import Vector
from core.database import Base

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    content = Column(Text)
    image_url = Column(String)
    url = Column(String, unique=True, index=True)
    source = Column(String)
    category = Column(String)
    published_at = Column(DateTime)
    embedding = Column(Vector(384))  # all-MiniLM-L6-v2