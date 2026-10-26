from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.creator_collaboration_finder.schemas import (
    CollaborationFinderRequest,
    CollaborationFinderResponse,
)
from app.modules.creator_collaboration_finder.service import collaboration_finder_service

router = APIRouter(prefix="/tools/collaboration-finder", tags=["Creator Collaboration Finder"])

@router.post(
    "/generate",
    response_model=CollaborationFinderResponse,
    status_code=status.HTTP_200_OK,
    summary="Formulate creator collaboration opportunities and outreach pitches"
)
async def find_collaborations(
    request: CollaborationFinderRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await collaboration_finder_service.find_collaborations(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = APIRouter(prefix="/tools/creator-collaboration-finder", tags=["Creator Collaboration Finder"])

@alias_router.post(
    "/generate",
    response_model=CollaborationFinderResponse,
    status_code=status.HTTP_200_OK,
    summary="Formulate creator collaborations (alias)"
)
async def find_collaborations_alias(
    request: CollaborationFinderRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await collaboration_finder_service.find_collaborations(
        db=db,
        user_id=current_user.id,
        request=request
    )
