from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.db.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.modules.auth.schemas import RegisterRequest, LoginRequest, AuthResponse, UserResponse

class AuthService:
    @staticmethod
    async def register(db: AsyncSession, request: RegisterRequest) -> AuthResponse:
        result = await db.execute(select(User).where(User.email == request.email))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )
        
        user = User(
            email=request.email,
            hashed_password=get_password_hash(request.password),
            full_name=request.full_name or "Creator",
            subscription_tier="free"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.full_name})
        return AuthResponse(user=UserResponse.model_validate(user), token=token, access_token=token)

    @staticmethod
    async def login(db: AsyncSession, request: LoginRequest) -> AuthResponse:
        result = await db.execute(select(User).where(User.email == request.email))
        user = result.scalars().first()
        if not user or not user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
        
        if not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
            
        token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.full_name})
        return AuthResponse(user=UserResponse.model_validate(user), token=token, access_token=token)

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: str) -> UserResponse:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )
        return UserResponse.model_validate(user)
