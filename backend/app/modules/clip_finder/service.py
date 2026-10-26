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
from app.modules.clip_finder.schemas import (
    ClipFinderRequest,
    ClipFinderResponse,
)
from app.modules.clip_finder.chains import clip_finder_chain

class ClipFinderService:
    @staticmethod
    async def extract_clips(
        db: AsyncSession,
        user_id: str,
        request: ClipFinderRequest
    ) -> ClipFinderResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute chain
        llm_out = await clip_finder_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        best_clip = (
            llm_out.clips[llm_out.recommended_clip_index]
            if 0 <= llm_out.recommended_clip_index < len(llm_out.clips)
            else (llm_out.clips[0] if llm_out.clips else None)
        )

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="clip-finder",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "video_topic": request.video_topic,
                "target_platform": request.target_platform,
                "transcript_length": len(request.transcript_text)
            },
            output_data=llm_out.model_dump(),
            latency_ms=latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()

        # Save primary asset
        asset = Asset(
            project_id=project.id,
            user_id=user_id,
            type="highlight_clips",
            title=f"{project.name} - Clips: {request.video_topic or 'Long-form Transcript'}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "clip-finder",
                "generation_id": generation.id,
                "clips_count": len(llm_out.clips),
                "top_clip_title": best_clip.suggested_title if best_clip else ""
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="clip-finder",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return ClipFinderResponse(
            generation_id=generation.id,
            project_id=project.id,
            analysis_summary=llm_out.analysis_summary,
            clips=llm_out.clips,
            recommended_clip=best_clip,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

clip_finder_service = ClipFinderService()
