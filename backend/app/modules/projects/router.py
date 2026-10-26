from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.projects.schemas import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse
from app.modules.projects.service import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.create_project(db, current_user.id, data)

@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.get_projects(db, current_user.id)

@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.get_project(db, project_id, current_user.id)

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    data: ProjectUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await ProjectService.update_project(db, project_id, current_user.id, data)

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await ProjectService.delete_project(db, project_id, current_user.id)
    return None
