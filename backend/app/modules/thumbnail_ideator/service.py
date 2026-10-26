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
from app.modules.thumbnail_ideator.schemas import (
    ThumbnailIdeatorRequest,
    ThumbnailIdeatorResponse,
)
from app.modules.thumbnail_ideator.chains import thumbnail_ideator_chain
from app.core.logging import logger

class ThumbnailIdeatorService:
    @staticmethod
    async def generate_concepts(
        db: AsyncSession,
        user_id: str,
        request: ThumbnailIdeatorRequest
    ) -> ThumbnailIdeatorResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await thumbnail_ideator_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        best_concept = (
            llm_out.concepts[llm_out.recommended_concept_index]
            if 0 <= llm_out.recommended_concept_index < len(llm_out.concepts)
            else (llm_out.concepts[0] if llm_out.concepts else None)
        )

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="thumbnail-ideator",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "video_title_or_concept": request.video_title_or_concept,
                "platform": request.platform,
                "style_preference": request.style_preference,
                "include_creator_face": request.include_creator_face
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
            type="thumbnail_concept",
            title=f"{project.name} - Thumbnail Concepts",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "thumbnail-ideator",
                "generation_id": generation.id,
                "platform": request.platform,
                "recommended_concept_title": best_concept.title if best_concept else ""
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="thumbnail-ideator",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return ThumbnailIdeatorResponse(
            generation_id=generation.id,
            project_id=project.id,
            video_title_or_concept=request.video_title_or_concept,
            platform=request.platform,
            concepts=llm_out.concepts,
            recommended_concept=best_concept,
            a_b_testing_hypothesis=llm_out.a_b_testing_hypothesis,
            title_thumbnail_synergy_tip=llm_out.title_thumbnail_synergy_tip,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

thumbnail_ideator_service = ThumbnailIdeatorService()
