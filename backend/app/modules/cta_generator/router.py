from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.cta_generator.schemas import (
    CTAGeneratorRequest,
    CTAGeneratorResponse,
)
from app.modules.cta_generator.service import cta_generator_service

router = APIRouter(prefix="/tools/ctas", tags=["CTA Generator"])

@router.post(
    "/generate",
    response_model=CTAGeneratorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate high-converting, platform-specific calls to action"
)
async def generate_cta(
    request: CTAGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await cta_generator_service.generate_cta(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = APIRouter(prefix="/tools/cta-generator", tags=["CTA Generator"])

@alias_router.post(
    "/generate",
    response_model=CTAGeneratorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate calls to action (alias)"
)
async def generate_cta_alias(
    request: CTAGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await cta_generator_service.generate_cta(
        db=db,
        user_id=current_user.id,
        request=request
    )
