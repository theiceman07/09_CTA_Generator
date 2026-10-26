from typing import List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.modules.projects.schemas import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse

class ProjectService:
    @staticmethod
    async def create_project(db: AsyncSession, user_id: str, data: ProjectCreate) -> ProjectResponse:
        project = Project(
            user_id=user_id,
            name=data.name.strip(),
            description=data.description.strip() if data.description else None,
            target_audience=data.target_audience.strip() if data.target_audience else "Creators & Founders",
            tone=data.tone.strip() if data.tone else "Professional",
            primary_goal=data.primary_goal.strip() if data.primary_goal else "Growth",
            status="active"
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        return ProjectResponse.model_validate(project)

    @staticmethod
    async def get_projects(db: AsyncSession, user_id: str) -> List[ProjectResponse]:
        result = await db.execute(
            select(Project)
            .where(Project.user_id == user_id)
            .order_by(Project.created_at.desc())
        )
        projects = result.scalars().all()
        return [ProjectResponse.model_validate(p) for p in projects]

    @staticmethod
    async def get_project(db: AsyncSession, project_id: str, user_id: str) -> ProjectDetailResponse:
        result = await db.execute(
            select(Project)
            .where(Project.id == project_id)
        )
        project = result.scalars().first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found."
            )
        
        # Verify project ownership (Security guardrail)
        if project.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this project."
            )
            
        # Count assets and generations
        asset_count_res = await db.execute(
            select(func.count(Asset.id)).where(Asset.project_id == project_id)
        )
        assets_count = asset_count_res.scalar() or 0

        gen_count_res = await db.execute(
            select(func.count(AIGeneration.id)).where(AIGeneration.project_id == project_id)
        )
        generations_count = gen_count_res.scalar() or 0

        data = ProjectResponse.model_validate(project).model_dump()
        data["assets_count"] = assets_count
        data["generations_count"] = generations_count
        return ProjectDetailResponse(**data)

    @staticmethod
    async def update_project(db: AsyncSession, project_id: str, user_id: str, data: ProjectUpdate) -> ProjectResponse:
        result = await db.execute(select(Project).where(Project.id == project_id))
        project = result.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to modify this project.")
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(project, key, value)
            
        await db.commit()
        await db.refresh(project)
        return ProjectResponse.model_validate(project)

    @staticmethod
    async def delete_project(db: AsyncSession, project_id: str, user_id: str) -> bool:
        result = await db.execute(select(Project).where(Project.id == project_id))
        project = result.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this project.")
            
        await db.delete(project)
        await db.commit()
        return True
