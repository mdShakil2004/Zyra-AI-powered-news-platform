
#scripts/ingest_news.py
# scripts/ingest_news.py
import asyncio
import sys

# ✅ FIX for Windows async DNS issue
if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from services.rss_ingest import ingest_rss

asyncio.run(ingest_rss())
