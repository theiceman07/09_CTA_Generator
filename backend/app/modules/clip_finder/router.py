from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.clip_finder.schemas import (
    ClipFinderRequest,
    ClipFinderResponse,
)
from app.modules.clip_finder.service import clip_finder_service

router = APIRouter(prefix="/tools/clip-finder", tags=["Clip Finder"])
alias_router = APIRouter(prefix="/tools/clips", tags=["Clip Finder"])

@router.post(
    "/extract",
    response_model=ClipFinderResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract viral high-retention highlight clips from transcript"
)
async def extract_clips_primary(
    request: ClipFinderRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await clip_finder_service.extract_clips(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/extract",
    response_model=ClipFinderResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def extract_clips_alias(
    request: ClipFinderRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await clip_finder_service.extract_clips(
        db=db,
        user_id=current_user.id,
        request=request
    )
