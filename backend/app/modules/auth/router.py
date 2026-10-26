from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.auth.schemas import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from app.modules.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.register(db, request)

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.login(db, request)

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await AuthService.get_user_by_id(db, current_user.id)
