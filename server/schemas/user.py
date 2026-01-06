#models/user.py
from pydantic import BaseModel
from typing import List

class UserCreate(BaseModel):
    email: str
    password: str

class PreferenceUpdate(BaseModel):
    categories: List[str]