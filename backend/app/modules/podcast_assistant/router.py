from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.podcast_assistant.schemas import (
    PodcastPlanningRequest,
    PodcastPlanningResponse,
)
from app.modules.podcast_assistant.service import podcast_assistant_service

router = APIRouter(prefix="/tools/podcast-assistant", tags=["Podcast Assistant"])
alias_router = APIRouter(prefix="/tools/podcast", tags=["Podcast Assistant"])

@router.post(
    "/plan",
    response_model=PodcastPlanningResponse,
    status_code=status.HTTP_200_OK,
    summary="Plan podcast episode structure, segments, show notes, and questions"
)
async def plan_podcast_episode_primary(
    request: PodcastPlanningRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await podcast_assistant_service.plan_episode(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/plan",
    response_model=PodcastPlanningResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def plan_podcast_episode_alias(
    request: PodcastPlanningRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await podcast_assistant_service.plan_episode(
        db=db,
        user_id=current_user.id,
        request=request
    )
