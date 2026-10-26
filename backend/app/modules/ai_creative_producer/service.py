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
from app.modules.ai_creative_producer.schemas import (
    CreativeProducerRequest,
    CreativeProducerResponse,
)
from app.modules.ai_creative_producer.chains import creative_producer_chain

class CreativeProducerService:
    @staticmethod
    async def produce_package(
        db: AsyncSession,
        user_id: str,
        request: CreativeProducerRequest
    ) -> CreativeProducerResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute chain
        llm_out = await creative_producer_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="ai-creative-producer",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "creative_concept": request.creative_concept,
                "aesthetic_vibe": request.aesthetic_vibe,
                "primary_deliverable": request.primary_deliverable
            },
            output_data=llm_out.model_dump(),
            latency_ms=latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()

        # Save Asset
        asset = Asset(
            project_id=project.id,
            user_id=user_id,
            type="production_package",
            title=f"{project.name} - Producer: {llm_out.production_package_title[:40]}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "ai-creative-producer",
                "generation_id": generation.id,
                "shots_count": len(llm_out.shot_list),
                "aesthetic_vibe": request.aesthetic_vibe
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="ai-creative-producer",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return CreativeProducerResponse(
            generation_id=generation.id,
            project_id=project.id,
            production_package_title=llm_out.production_package_title,
            creative_vision=llm_out.creative_vision,
            visual_style_guide=llm_out.visual_style_guide,
            shot_list=llm_out.shot_list,
            distribution_strategy=llm_out.distribution_strategy,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

creative_producer_service = CreativeProducerService()
