import time
import json
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.db.models.usage import UsageRecord
from app.modules.voice_replicator.schemas import (
    VoiceReplicatorRequest,
    VoiceReplicatorResponse,
)
from app.modules.voice_replicator.chains import voice_replication_chain

class VoiceReplicatorService:
    @staticmethod
    async def replicate_voice(
        db: AsyncSession,
        user_id: str,
        request: VoiceReplicatorRequest
    ) -> VoiceReplicatorResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute chain
        llm_out = await voice_replication_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="voice-replicator",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "topic": request.topic,
                "platform": request.platform,
                "tone": request.tone
            },
            output_data=llm_out.model_dump(),
            latency_ms=latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()

        # Save generated content asset
        asset = Asset(
            project_id=project.id,
            user_id=user_id,
            type="voice_replicated_post",
            title=f"{project.name} - In Voice: {request.topic[:40]}",
            content=llm_out.generated_content,
            meta_info={
                "tool": "voice-replicator",
                "generation_id": generation.id,
                "style_profile": llm_out.style_profile.model_dump(),
                "style_alignment_score": llm_out.style_alignment_score,
                "platform": request.platform
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="voice-replicator",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return VoiceReplicatorResponse(
            generation_id=generation.id,
            project_id=project.id,
            topic=request.topic,
            style_profile=llm_out.style_profile,
            generated_content=llm_out.generated_content,
            style_alignment_score=llm_out.style_alignment_score,
            reusable_voice_guidelines=llm_out.reusable_voice_guidelines,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

voice_replicator_service = VoiceReplicatorService()
