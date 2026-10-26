from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.content_recycler.schemas import (
    ContentRecyclerRequest,
    ContentRecyclerResponse,
)
from app.modules.content_recycler.service import content_recycler_service

router = APIRouter(prefix="/tools/content-recycler", tags=["Content Recycler"])

@router.post(
    "/generate",
    response_model=ContentRecyclerResponse,
    status_code=status.HTTP_200_OK,
    summary="Recycle and modernize past successful content assets"
)
async def recycle_content(
    request: ContentRecyclerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await content_recycler_service.recycle_content(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = router
