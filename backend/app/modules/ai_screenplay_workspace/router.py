from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.ai_screenplay_workspace.schemas import (
    ScreenplayWorkspaceRequest,
    ScreenplayWorkspaceResponse,
)
from app.modules.ai_screenplay_workspace.service import screenplay_workspace_service

router = APIRouter(prefix="/tools/screenplay-workspace", tags=["AI Screenplay Workspace"])
alias_router = APIRouter(prefix="/tools/screenplay", tags=["AI Screenplay Workspace"])

@router.post(
    "/develop",
    response_model=ScreenplayWorkspaceResponse,
    status_code=status.HTTP_200_OK,
    summary="Develop narrative screenplay, characters, beats, and formatted scene script"
)
async def develop_screenplay_primary(
    request: ScreenplayWorkspaceRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await screenplay_workspace_service.develop_screenplay(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/develop",
    response_model=ScreenplayWorkspaceResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def develop_screenplay_alias(
    request: ScreenplayWorkspaceRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await screenplay_workspace_service.develop_screenplay(
        db=db,
        user_id=current_user.id,
        request=request
    )
