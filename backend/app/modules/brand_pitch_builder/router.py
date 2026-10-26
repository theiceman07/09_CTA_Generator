from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.brand_pitch_builder.schemas import (
    BrandPitchBuilderRequest,
    BrandPitchBuilderResponse,
)
from app.modules.brand_pitch_builder.service import brand_pitch_builder_service

router = APIRouter(prefix="/tools/brand-pitch", tags=["Brand Pitch Builder"])

@router.post(
    "/generate",
    response_model=BrandPitchBuilderResponse,
    status_code=status.HTTP_200_OK,
    summary="Construct tailored brand sponsorship pitches and outreach emails"
)
async def generate_pitch(
    request: BrandPitchBuilderRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await brand_pitch_builder_service.generate_pitch(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = APIRouter(prefix="/tools/brand-pitch-builder", tags=["Brand Pitch Builder"])

@alias_router.post(
    "/generate",
    response_model=BrandPitchBuilderResponse,
    status_code=status.HTTP_200_OK,
    summary="Construct brand sponsorship pitches (alias)"
)
async def generate_pitch_alias(
    request: BrandPitchBuilderRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await brand_pitch_builder_service.generate_pitch(
        db=db,
        user_id=current_user.id,
        request=request
    )
