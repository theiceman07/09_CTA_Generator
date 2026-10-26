from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.creator_research_assistant.schemas import (
    CreatorResearchRequest,
    CreatorResearchResponse,
)
from app.modules.creator_research_assistant.service import creator_research_service

router = APIRouter(prefix="/tools/research", tags=["Creator Research Assistant"])
alias_router = APIRouter(prefix="/tools/creator-research", tags=["Creator Research Assistant"])

@router.post(
    "/generate",
    response_model=CreatorResearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate competitive and domain creator research intelligence"
)
async def generate_research_primary(
    request: CreatorResearchRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_research_service.generate_research(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/generate",
    response_model=CreatorResearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate competitive and domain creator research intelligence (alias)"
)
async def generate_research_alias(
    request: CreatorResearchRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_research_service.generate_research(
        db=db,
        user_id=current_user.id,
        request=request
    )
