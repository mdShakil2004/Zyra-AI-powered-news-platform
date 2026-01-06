

# routes/ai.py 
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from models.news import News
from services.embedding import embed_text
from services.summarizer import simple_summarize
from schemas.ai import AIRequest, AIResponse

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/", response_model=AIResponse)
async def ask_ai(req: AIRequest, db: AsyncSession = Depends(get_db)):
    query_emb = embed_text(req.input)

    # Semantic search top 5
    stmt = """
    SELECT id, title, summary, content
    FROM news
    ORDER BY embedding <-> :q_emb
    LIMIT 5
    """
    result = await db.execute(stmt, {"q_emb": query_emb})
    articles = result.fetchall()

    context = "\n\n".join([f"{a.title}\n{a.summary or a.content[:500]}" for a in articles])
    prompt = f"Question: {req.input}\n\nRelevant articles:\n{context}\n\nAnswer concisely:"

    # Replace with real LLM later
    answer = simple_summarize(context, req.input) if articles else "No relevant news found."

    return AIResponse(output=answer)