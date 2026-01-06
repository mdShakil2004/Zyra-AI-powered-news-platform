
# schemas/ai.py

from pydantic import BaseModel
from typing import List ,Optional

class AIRequest(BaseModel):
    input: str
    newsList: Optional[List[dict]] = None  # for context

class AIResponse(BaseModel):
    output: str