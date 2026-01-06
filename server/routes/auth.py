
# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from models.user import User
from core.security import hash_password, create_access_token, verify_password
from schemas.auth import LoginRequest, TokenResponse
from schemas.user import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(User.__table__.select().where(User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(400, "Email already registered")
    new_user = User(email=user.email, hashed_password=hash_password(user.password))
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    token = create_access_token({"id": new_user.id})
    return TokenResponse(token=token)

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(User.__table__.select().where(User.email == req.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"id": user.id})
    return TokenResponse(token=token)
