from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.usage.schemas import UsageSummaryResponse
from app.modules.usage.service import UsageService

router = APIRouter(prefix="/usage", tags=["Usage Tracking"])

@router.get("", response_model=UsageSummaryResponse)
async def get_usage(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await UsageService.get_user_usage_summary(db, current_user.id)
