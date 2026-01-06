# services/rss_ingest.py
import feedparser
from goose3 import Goose
from bs4 import BeautifulSoup
import httpx
from datetime import datetime
from models.news import News
from services.embedding import embed_text
from core.database import AsyncSessionLocal
from typing import Optional
from sqlalchemy import select

RSS_FEEDS = {
    "BBC": "http://feeds.bbci.co.uk/news/rss.xml",
    "Reuters": "https://www.reuters.com/rss",
    "Hindustan Times": "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
    "Google News World": "https://news.google.com/rss?topic=w",
}

g = Goose()

CATEGORY_KEYWORDS = {
    "Sports": ["cricket", "football", "tennis", "olympics", "match", "score"],
    "Tech": ["ai", "technology", "google", "apple", "startup", "gadget"],
    "Politics": ["government", "modi", "election", "parliament", "biden"],
    "Business": ["stock", "market", "economy", "rupee", "sensex"],
    "Cricket": ["ipl", "rohit", "kohli", "dhoni", "cricket world cup"],
}

async def infer_category(title: str, summary: str) -> str:
    text = (title + " " + summary).lower()
    for cat, words in CATEGORY_KEYWORDS.items():
        if any(word in text for word in words):
            return cat
    return "ALL"

async def extract_image(url: str) -> Optional[str]:
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:  # Follow redirects
            resp = await client.get(url, timeout=15.0)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Try multiple sources
            og_image = soup.find("meta", property="og:image")
            if og_image and og_image.get("content"):
                return og_image["content"]
            
            twitter_image = soup.find("meta", name="twitter:image")
            if twitter_image and twitter_image.get("content"):
                return twitter_image["content"]
            
            # Fallback: first img tag with reasonable size
            img = soup.find("img", {"src": True})
            if img and img["src"].startswith("http"):
                return img["src"]
                
    except Exception as e:
        print(f"Image failed for {url}: {e}")
    return None

async def ingest_rss():
    async with AsyncSessionLocal() as db:
        for source, feed_url in RSS_FEEDS.items():
            print(f"Fetching {source} from {feed_url}")
            feed = feedparser.parse(feed_url)
            if not feed.entries:
                print(f"No entries from {source}")
                continue

            for entry in feed.entries[:20]:
                if not entry.get("link"):
                    continue

                url = entry.link.strip()

                # FIXED: Use scalar() + select() to check if URL exists
                result = await db.execute(select(News).filter(News.url == url))
                existing = result.scalar_one_or_none()
                if existing:
                    print(f"Skipping duplicate: {entry.title}")
                    continue

                print(f"Processing: {entry.title}")

                article = g.extract(url=entry.link)
                image = await extract_image(entry.link)

                full_text = article.cleaned_text or entry.get("summary", "") or ""
                title = entry.title or "Untitled"
                summary = (entry.get("summary") or title)[:300]

                category = await infer_category(title, summary)
                embedding = embed_text(title + " " + full_text)

                published_at = datetime.utcnow()
                if hasattr(entry, "published_parsed") and entry.published_parsed:
                    try:
                        published_at = datetime(*entry.published_parsed[:6])
                    except Exception:
                        pass

                news_item = News(
                    title=title,
                    summary=summary,
                    content=full_text,
                    image_url=image,
                    url=url,
                    source=source,
                    category=category,
                    published_at=published_at,
                    embedding=embedding,
                )
                db.add(news_item)

        await db.commit()
        print("News ingestion completed successfully! 📰✨")