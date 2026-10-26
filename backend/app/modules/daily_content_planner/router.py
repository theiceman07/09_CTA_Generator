from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.daily_content_planner.schemas import (
    DailyContentPlannerRequest,
    DailyContentPlannerResponse,
)
from app.modules.daily_content_planner.service import daily_content_planner_service

router = APIRouter(prefix="/tools/daily-content-planner", tags=["Daily Content Planner"])

@router.post(
    "/generate",
    response_model=DailyContentPlannerResponse,
    status_code=status.HTTP_200_OK,
    summary="Construct a structured multi-day content publishing calendar"
)
async def generate_plan(
    request: DailyContentPlannerRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await daily_content_planner_service.generate_plan(
        db=db,
        user_id=current_user.id,
        request=request
    )

alias_router = router
