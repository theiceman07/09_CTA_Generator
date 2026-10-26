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
from app.modules.brand_pitch_builder.schemas import (
    BrandPitchBuilderRequest,
    BrandPitchBuilderResponse,
)
from app.modules.brand_pitch_builder.chains import brand_pitch_chain
from app.core.logging import logger

class BrandPitchBuilderService:
    @staticmethod
    async def generate_pitch(
        db: AsyncSession,
        user_id: str,
        request: BrandPitchBuilderRequest
    ) -> BrandPitchBuilderResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await brand_pitch_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="brand-pitch-builder",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "creator_name": request.creator_name,
                "creator_niche": request.creator_niche,
                "brand_name": request.brand_name,
                "brand_product": request.brand_product,
                "platform": request.primary_platform
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
            type="brand_pitch",
            title=f"{project.name} - Pitch to {request.brand_name}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "brand-pitch-builder",
                "generation_id": generation.id,
                "brand_name": request.brand_name,
                "creator_name": request.creator_name,
                "primary_subject_line": llm_out.email_subject_lines[0] if llm_out.email_subject_lines else ""
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="brand-pitch-builder",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return BrandPitchBuilderResponse(
            generation_id=generation.id,
            project_id=project.id,
            creator_name=request.creator_name,
            brand_name=request.brand_name,
            email_subject_lines=llm_out.email_subject_lines,
            outreach_email_body=llm_out.outreach_email_body,
            executive_summary=llm_out.executive_summary,
            campaign_concepts=llm_out.campaign_concepts,
            recommended_deliverables=llm_out.recommended_deliverables,
            pricing_and_roi_framing=llm_out.pricing_and_roi_framing,
            followup_timeline_advice=llm_out.followup_timeline_advice,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

brand_pitch_builder_service = BrandPitchBuilderService()
