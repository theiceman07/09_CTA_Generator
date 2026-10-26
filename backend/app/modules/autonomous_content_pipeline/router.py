from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.autonomous_content_pipeline.schemas import (
    AutonomousPipelineRequest,
    AutonomousPipelineResponse,
)
from app.modules.autonomous_content_pipeline.service import autonomous_pipeline_service

router = APIRouter(prefix="/tools/autonomous-content-pipeline", tags=["Autonomous Content Pipeline"])
alias_router = APIRouter(prefix="/tools/autonomous-pipeline", tags=["Autonomous Content Pipeline"])

@router.post(
    "/run",
    response_model=AutonomousPipelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger end-to-end autonomous multi-stage content production pipeline"
)
async def run_pipeline_primary(
    request: AutonomousPipelineRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await autonomous_pipeline_service.run_pipeline(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/run",
    response_model=AutonomousPipelineResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def run_pipeline_alias(
    request: AutonomousPipelineRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await autonomous_pipeline_service.run_pipeline(
        db=db,
        user_id=current_user.id,
        request=request
    )
