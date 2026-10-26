from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.assets.schemas import AssetResponse
from app.modules.assets.service import AssetService

router = APIRouter(prefix="/projects", tags=["Assets"])

@router.get("/{project_id}/assets", response_model=List[AssetResponse])
async def get_project_assets(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await AssetService.get_project_assets(db, project_id, current_user.id)
