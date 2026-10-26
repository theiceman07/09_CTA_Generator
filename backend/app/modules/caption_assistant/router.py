from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.caption_assistant.schemas import (
    CaptionGeneratorRequest,
    CaptionGeneratorResponse,
)
from app.modules.caption_assistant.service import caption_assistant_service

router = APIRouter(prefix="/tools/captions", tags=["Caption Assistant"])


@router.post(
    "/generate",
    response_model=CaptionGeneratorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate high-converting, platform-optimized social media captions"
)
async def generate_caption(
    request: CaptionGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate platform-optimized social media captions with scroll-stopping hooks,
    content-grounded narrative, high-intent CTA, and SEO hashtags.
    Powered by Google Gemini (gemini-3.1-flash-lite) and LangChain.
    """
    return await caption_assistant_service.generate_caption(
        db=db,
        user_id=current_user.id,
        request=request
    )


# Alias router mounted under /tools/caption-assistant to match application ID convention
alias_router = APIRouter(prefix="/tools/caption-assistant", tags=["Caption Assistant"])


@alias_router.post(
    "/generate",
    response_model=CaptionGeneratorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate social media captions (alias)"
)
async def generate_caption_alias(
    request: CaptionGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await caption_assistant_service.generate_caption(
        db=db,
        user_id=current_user.id,
        request=request
    )
