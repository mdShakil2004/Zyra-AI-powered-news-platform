
#routes/user.py
from fastapi import APIRouter, Depends
from utils.deps import get_current_user
from schemas.user import PreferenceUpdate

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/preferences")
async def update_preferences(
    prefs: PreferenceUpdate,
    user_id: int = Depends(get_current_user)
):
    # Save preferences logic here
    return {"status": "saved"}