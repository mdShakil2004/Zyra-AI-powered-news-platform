# server/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, news, ai, user
from sqlalchemy import text
from core.database import engine, AsyncSessionLocal  # ← ADD AsyncSessionLocal HERE

app = FastAPI(title="Zyra News API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    try:
        async with AsyncSessionLocal() as session:  # Now it's defined!
            await session.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected ✅"}
    except Exception as e:
        return {"status": "unhealthy", "database": "failed", "error": str(e)}


app.include_router(auth.router)
app.include_router(news.router)
app.include_router(ai.router)
app.include_router(user.router)