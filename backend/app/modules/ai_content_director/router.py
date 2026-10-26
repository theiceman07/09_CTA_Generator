from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.ai_content_director.schemas import (
    ContentDirectorRequest,
    ContentDirectorResponse,
)
from app.modules.ai_content_director.service import ai_content_director_service

router = APIRouter(prefix="/tools/ai-content-director", tags=["AI Content Director"])
alias_router = APIRouter(prefix="/tools/content-director", tags=["AI Content Director"])

@router.post(
    "/direct",
    response_model=ContentDirectorResponse,
    status_code=status.HTTP_200_OK,
    summary="Orchestrate end-to-end creative content campaign via LangGraph"
)
async def direct_content_primary(
    request: ContentDirectorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ai_content_director_service.direct_content(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/direct",
    response_model=ContentDirectorResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def direct_content_alias(
    request: ContentDirectorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ai_content_director_service.direct_content(
        db=db,
        user_id=current_user.id,
        request=request
    )
