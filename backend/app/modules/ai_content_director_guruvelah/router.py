from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.ai_content_director_guruvelah.schemas import (
    GuruvelahDirectorRequest,
    GuruvelahDirectorResponse,
)
from app.modules.ai_content_director_guruvelah.service import guruvelah_director_service

router = APIRouter(prefix="/tools/ai-content-director-guruvelah", tags=["AI Content Director — Guruvelah"])
alias_router = APIRouter(prefix="/tools/guruvelah", tags=["AI Content Director — Guruvelah"])

@router.post(
    "/direct",
    response_model=GuruvelahDirectorResponse,
    status_code=status.HTTP_200_OK,
    summary="Direct philosophical narrative campaign via Guruvelah strategy engine"
)
async def direct_guruvelah_primary(
    request: GuruvelahDirectorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await guruvelah_director_service.direct_campaign(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/direct",
    response_model=GuruvelahDirectorResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def direct_guruvelah_alias(
    request: GuruvelahDirectorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await guruvelah_director_service.direct_campaign(
        db=db,
        user_id=current_user.id,
        request=request
    )
