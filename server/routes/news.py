# routes/news.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.database import get_db
from models.news import News
from schemas.news import NewsResponse
from typing import List

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/", response_model=dict)  # Temporary: return dict
async def get_news(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(News).order_by(News.id.desc()).limit(100)
    )
    news_list = result.scalars().all()
    
    # Wrap in {"data": [...]} to match frontend expectation
    return {"data": [NewsResponse.from_orm(item) for item in news_list]}