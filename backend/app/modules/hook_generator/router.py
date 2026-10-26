from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.hook_generator.schemas import HookGeneratorRequest, HookGeneratorResponse
from app.modules.hook_generator.service import hook_generator_service

router = APIRouter(prefix="/tools/hooks", tags=["Hook Generator"])

@router.post("/generate", response_model=HookGeneratorResponse, status_code=status.HTTP_200_OK)
async def generate_hooks(
    request: HookGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate high-converting, scroll-stopping hooks across 10 psychological frameworks.
    Powered by Google Gemini (gemini-3.1-flash-lite) and LangChain.
    """
    return await hook_generator_service.generate_hooks(
        db=db,
        user_id=current_user.id,
        request=request
    )

# Alias router mounted under /tools/hook-generator to match application ID convention
alias_router = APIRouter(prefix="/tools/hook-generator", tags=["Hook Generator"])

@alias_router.post("/generate", response_model=HookGeneratorResponse, status_code=status.HTTP_200_OK)
async def generate_hooks_alias(
    request: HookGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await hook_generator_service.generate_hooks(
        db=db,
        user_id=current_user.id,
        request=request
    )
