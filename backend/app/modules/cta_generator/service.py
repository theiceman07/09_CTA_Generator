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
from app.modules.cta_generator.schemas import (
    CTAGeneratorRequest,
    CTAGeneratorResponse,
)
from app.modules.cta_generator.chains import cta_generation_chain
from app.core.logging import logger

class CTAGeneratorService:
    @staticmethod
    async def generate_cta(
        db: AsyncSession,
        user_id: str,
        request: CTAGeneratorRequest
    ) -> CTAGeneratorResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await cta_generation_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # Compute character counts if not set
        for item in llm_out.ctas:
            if not item.character_count:
                item.character_count = len(item.text)

        recommended_text = (
            llm_out.ctas[llm_out.recommended_cta_index].text
            if 0 <= llm_out.recommended_cta_index < len(llm_out.ctas)
            else (llm_out.ctas[0].text if llm_out.ctas else "")
        )

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="cta-generator",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data=request.model_dump(),
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
            type="cta",
            title=f"{project.name} - {request.platform} CTA",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "cta-generator",
                "generation_id": generation.id,
                "platform": request.platform,
                "goal": request.goal,
                "recommended_cta": recommended_text
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="cta-generator",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return CTAGeneratorResponse(
            generation_id=generation.id,
            project_id=project.id,
            platform=request.platform,
            goal=request.goal,
            tone=request.tone,
            ctas=llm_out.ctas,
            recommended_cta=recommended_text,
            recommended_reason=llm_out.recommended_reason,
            placement_strategy=llm_out.placement_strategy,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

cta_generator_service = CTAGeneratorService()
