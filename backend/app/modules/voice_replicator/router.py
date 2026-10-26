from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.security import get_current_user, CurrentUser
from app.modules.voice_replicator.schemas import (
    VoiceReplicatorRequest,
    VoiceReplicatorResponse,
)
from app.modules.voice_replicator.service import voice_replicator_service

router = APIRouter(prefix="/tools/voice-replicator", tags=["Voice Replicator"])
alias_router = APIRouter(prefix="/tools/voice", tags=["Voice Replicator"])

@router.post(
    "/generate",
    response_model=VoiceReplicatorResponse,
    status_code=status.HTTP_200_OK,
    summary="Replicate author stylistic writing voice for a new topic"
)
async def replicate_voice_primary(
    request: VoiceReplicatorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await voice_replicator_service.replicate_voice(
        db=db,
        user_id=current_user.id,
        request=request
    )

@alias_router.post(
    "/generate",
    response_model=VoiceReplicatorResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def replicate_voice_alias(
    request: VoiceReplicatorRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await voice_replicator_service.replicate_voice(
        db=db,
        user_id=current_user.id,
        request=request
    )
