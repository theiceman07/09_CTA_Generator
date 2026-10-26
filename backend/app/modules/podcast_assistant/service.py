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
from app.modules.podcast_assistant.schemas import (
    PodcastPlanningRequest,
    PodcastPlanningResponse,
)
from app.modules.podcast_assistant.chains import podcast_planning_chain

class PodcastAssistantService:
    @staticmethod
    async def plan_episode(
        db: AsyncSession,
        user_id: str,
        request: PodcastPlanningRequest
    ) -> PodcastPlanningResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute chain
        llm_out = await podcast_planning_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        best_title = (
            llm_out.episode_title_options[llm_out.recommended_title_index]
            if 0 <= llm_out.recommended_title_index < len(llm_out.episode_title_options)
            else (llm_out.episode_title_options[0] if llm_out.episode_title_options else "Podcast Episode")
        )

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="podcast-assistant",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "episode_concept": request.episode_concept,
                "target_duration_minutes": request.target_duration_minutes,
                "guest_name_or_archetype": request.guest_name_or_archetype
            },
            output_data=llm_out.model_dump(),
            latency_ms=latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()

        # Save asset
        asset = Asset(
            project_id=project.id,
            user_id=user_id,
            type="podcast_show_notes",
            title=f"{project.name} - Podcast: {best_title[:40]}",
            content=llm_out.show_notes_markdown,
            meta_info={
                "tool": "podcast-assistant",
                "generation_id": generation.id,
                "episode_title": best_title,
                "segments_count": len(llm_out.timed_segments)
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="podcast-assistant",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return PodcastPlanningResponse(
            generation_id=generation.id,
            project_id=project.id,
            episode_title_options=llm_out.episode_title_options,
            recommended_title=best_title,
            episode_description=llm_out.episode_description,
            host_guest_talking_points=llm_out.host_guest_talking_points,
            timed_segments=llm_out.timed_segments,
            show_notes_markdown=llm_out.show_notes_markdown,
            social_promotional_snippets=llm_out.social_promotional_snippets,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

podcast_assistant_service = PodcastAssistantService()
