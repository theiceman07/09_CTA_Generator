from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.thumbnail_ideator.schemas import (
    ThumbnailIdeatorRequest,
    ThumbnailIdeatorResponse,
)
from app.modules.thumbnail_ideator.service import thumbnail_ideator_service

router = APIRouter(prefix="/tools/thumbnail-ideator", tags=["Thumbnail Ideator"])

@router.post(
    "/generate",
    response_model=ThumbnailIdeatorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate high-CTR visual thumbnail concepts and AI generation prompts"
)
async def generate_concepts(
    request: ThumbnailIdeatorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await thumbnail_ideator_service.generate_concepts(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = router
