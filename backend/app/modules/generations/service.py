from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.db.models.project import Project
from app.db.models.generation import AIGeneration
from app.modules.generations.schemas import AIGenerationResponse

class GenerationService:
    @staticmethod
    async def get_project_generations(db: AsyncSession, project_id: str, user_id: str) -> List[AIGenerationResponse]:
        proj_res = await db.execute(select(Project).where(Project.id == project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        result = await db.execute(
            select(AIGeneration)
            .where(AIGeneration.project_id == project_id)
            .order_by(AIGeneration.created_at.desc())
        )
        generations = result.scalars().all()
        return [AIGenerationResponse.model_validate(g) for g in generations]
