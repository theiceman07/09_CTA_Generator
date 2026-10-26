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
from app.modules.ai_content_director.schemas import (
    ContentDirectorRequest,
    ContentDirectorResponse,
)
from app.modules.ai_content_director.graph import content_director_graph

class AIContentDirectorService:
    @staticmethod
    async def direct_content(
        db: AsyncSession,
        user_id: str,
        request: ContentDirectorRequest
    ) -> ContentDirectorResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute LangGraph workflow
        initial_state = {
            "topic": request.topic,
            "target_platform": request.target_platform or "Instagram",
            "target_audience": request.target_audience,
            "campaign_goal": request.campaign_goal,
            "current_step": "init",
            "concept": "",
            "hook": "",
            "script_summary": "",
            "caption_summary": "",
            "primary_cta": "",
            "steps_executed": [],
            "errors": [],
            "final_output": None
        }

        graph_result = await content_director_graph.ainvoke(initial_state)
        llm_out = graph_result.get("final_output")

        latency = int((time.time() - start_time) * 1000)

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="ai-content-director",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "topic": request.topic,
                "target_platform": request.target_platform,
                "campaign_goal": request.campaign_goal
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
            type="directed_campaign_package",
            title=f"{project.name} - Direction: {llm_out.campaign_title[:40]}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "ai-content-director",
                "generation_id": generation.id,
                "production_readiness_score": llm_out.production_readiness_score
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="ai-content-director",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return ContentDirectorResponse(
            generation_id=generation.id,
            project_id=project.id,
            campaign_title=llm_out.campaign_title,
            strategic_thesis=llm_out.strategic_thesis,
            workflow_steps_executed=llm_out.workflow_steps_executed,
            directed_package=llm_out.directed_package,
            production_readiness_score=llm_out.production_readiness_score,
            guruvelah_principles=llm_out.guruvelah_principles,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

ai_content_director_service = AIContentDirectorService()
