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
from app.modules.creator_research_assistant.schemas import (
    CreatorResearchRequest,
    CreatorResearchResponse,
)
from app.modules.creator_research_assistant.chains import creator_research_chain
from app.core.logging import logger

class CreatorResearchService:
    @staticmethod
    async def generate_research(
        db: AsyncSession,
        user_id: str,
        request: CreatorResearchRequest
    ) -> CreatorResearchResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await creator_research_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="creator-research-assistant",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "topic": request.topic,
                "research_depth": request.research_depth,
                "target_audience": request.target_audience
            },
            output_data=llm_out.model_dump(),
            latency_ms=latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()

        # 4. Save primary asset to Project
        asset = Asset(
            project_id=project.id,
            user_id=user_id,
            type="research_report",
            title=f"{project.name} - Research: {request.topic[:40]}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "creator-research-assistant",
                "generation_id": generation.id,
                "topic": request.topic,
                "research_depth": request.research_depth
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="creator-research-assistant",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return CreatorResearchResponse(
            generation_id=generation.id,
            project_id=project.id,
            topic=request.topic,
            research_depth=request.research_depth,
            executive_brief=llm_out.executive_brief,
            technical_pillars=llm_out.technical_pillars,
            competitor_landscape=llm_out.competitor_landscape,
            content_angle_recommendations=llm_out.content_angle_recommendations,
            cautions_and_misconceptions=llm_out.cautions_and_misconceptions,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

creator_research_service = CreatorResearchService()
