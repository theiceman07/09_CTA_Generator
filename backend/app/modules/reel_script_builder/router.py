from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.reel_script_builder.schemas import (
    ReelScriptGeneratorRequest,
    ReelScriptGeneratorResponse,
)
from app.modules.reel_script_builder.service import reel_script_builder_service

router = APIRouter(prefix="/tools/reel-scripts", tags=["Reel Script Builder"])

@router.post(
    "/generate",
    response_model=ReelScriptGeneratorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a structured short-form reel script"
)
async def generate_reel_script(
    request: ReelScriptGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a structured short-form reel script with opening hook (0-5s),
    scene-by-scene value breakdown (5-50s), and call to action (50-60s).
    Powered by Google Gemini (gemini-3.1-flash-lite) and LangChain.
    """
    return await reel_script_builder_service.generate_script(
        db=db,
        user_id=current_user.id,
        request=request
    )

# Alias router mounted under /tools/reel-script-builder to match application ID convention
alias_router = APIRouter(prefix="/tools/reel-script-builder", tags=["Reel Script Builder"])

@alias_router.post(
    "/generate",
    response_model=ReelScriptGeneratorResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate a structured short-form reel script (alias)"
)
async def generate_reel_script_alias(
    request: ReelScriptGeneratorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await reel_script_builder_service.generate_script(
        db=db,
        user_id=current_user.id,
        request=request
    )
