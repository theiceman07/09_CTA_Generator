from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.comment_to_content.schemas import (
    CommentToContentRequest,
    CommentToContentResponse,
)
from app.modules.comment_to_content.service import comment_to_content_service

router = APIRouter(prefix="/tools/comment-to-content", tags=["Comment to Content"])

@router.post(
    "/generate",
    response_model=CommentToContentResponse,
    status_code=status.HTTP_200_OK,
    summary="Transform audience comments into complete content concepts"
)
async def generate_content_from_comment(
    request: CommentToContentRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await comment_to_content_service.generate_content_from_comment(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = router  # No separate prefix needed
