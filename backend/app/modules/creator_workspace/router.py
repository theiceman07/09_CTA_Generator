from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.creator_workspace.schemas import (
    WorkspaceProjectOverview,
    WorkspaceHandoffRequest,
    WorkspaceHandoffResponse,
)
from app.modules.creator_workspace.service import creator_workspace_service

router = APIRouter(prefix="/tools/workspace", tags=["Creator Workspace"])

@router.get(
    "/projects/{project_id}/overview",
    response_model=WorkspaceProjectOverview,
    status_code=status.HTTP_200_OK,
    summary="Get unified workspace project overview, assets, and activity"
)
async def get_workspace_project_overview(
    project_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_workspace_service.get_overview(
        db=db,
        user_id=current_user.id,
        project_id=project_id
    )

@router.post(
    "/handoff",
    response_model=WorkspaceHandoffResponse,
    status_code=status.HTTP_200_OK,
    summary="Prepare cross-application handoff from one asset to another tool"
)
async def prepare_workspace_handoff(
    request: WorkspaceHandoffRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await creator_workspace_service.prepare_handoff(
        db=db,
        user_id=current_user.id,
        request=request
    )
