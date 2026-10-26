from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.comment_analyzer.schemas import (
    CommentAnalyzerRequest,
    CommentAnalyzerResponse,
)
from app.modules.comment_analyzer.service import comment_analyzer_service

router = APIRouter(prefix="/tools/comments", tags=["Comment Analyzer"])

@router.post(
    "/analyze",
    response_model=CommentAnalyzerResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze audience comments for sentiment, questions, and insights"
)
async def analyze_comments(
    request: CommentAnalyzerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await comment_analyzer_service.analyze_comments(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = APIRouter(prefix="/tools/comment-analyzer", tags=["Comment Analyzer"])

@alias_router.post(
    "/analyze",
    response_model=CommentAnalyzerResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze audience comments (alias)"
)
async def analyze_comments_alias(
    request: CommentAnalyzerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await comment_analyzer_service.analyze_comments(
        db=db,
        user_id=current_user.id,
        request=request
    )
