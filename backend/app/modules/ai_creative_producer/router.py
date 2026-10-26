from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.ai_creative_producer.schemas import (
    CreativeProducerRequest,
    CreativeProducerResponse,
)
from app.modules.ai_creative_producer.service import creative_producer_service

router = APIRouter(prefix="/tools/ai-creative-producer", tags=["AI Creative Producer"])
alias_router = APIRouter(prefix="/tools/creative-producer", tags=["AI Creative Producer"])

@router.post(
    "/produce",
    response_model=CreativeProducerResponse,
    status_code=status.HTTP_200_OK,
    summary="Design executive creative direction, shot list, and visual style guide"
)
async def produce_package_primary(
    request: CreativeProducerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creative_producer_service.produce_package(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/produce",
    response_model=CreativeProducerResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def produce_package_alias(
    request: CreativeProducerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creative_producer_service.produce_package(
        db=db,
        user_id=current_user.id,
        request=request
    )
