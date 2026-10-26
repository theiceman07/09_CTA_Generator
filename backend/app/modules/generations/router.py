from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.generations.schemas import AIGenerationResponse
from app.modules.generations.service import GenerationService

router = APIRouter(prefix="/projects", tags=["Generations"])

@router.get("/{project_id}/generations", response_model=List[AIGenerationResponse])
async def get_project_generations(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await GenerationService.get_project_generations(db, project_id, current_user.id)
