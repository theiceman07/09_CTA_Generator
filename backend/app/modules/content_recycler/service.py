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
from app.modules.content_recycler.schemas import (
    ContentRecyclerRequest,
    ContentRecyclerResponse,
)
from app.modules.content_recycler.chains import content_recycler_chain
from app.core.logging import logger

class ContentRecyclerService:
    @staticmethod
    async def recycle_content(
        db: AsyncSession,
        user_id: str,
        request: ContentRecyclerRequest
    ) -> ContentRecyclerResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await content_recycler_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        best_var = (
            llm_out.variations[llm_out.recommended_variation_index]
            if 0 <= llm_out.recommended_variation_index < len(llm_out.variations)
            else (llm_out.variations[0] if llm_out.variations else None)
        )

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="content-recycler",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "past_content_preview": request.past_content[:200],
                "original_platform": request.original_platform,
                "refresh_goal": request.refresh_goal,
                "target_platforms": request.target_platforms
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
            type="recycled_content",
            title=f"{project.name} - Recycled: {request.refresh_goal}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "content-recycler",
                "generation_id": generation.id,
                "original_platform": request.original_platform,
                "recommended_format": best_var.format_name if best_var else ""
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="content-recycler",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return ContentRecyclerResponse(
            generation_id=generation.id,
            project_id=project.id,
            refreshed_angles_summary=llm_out.refreshed_angles_summary,
            variations=llm_out.variations,
            recommended_variation=best_var,
            republishing_schedule_advice=llm_out.republishing_schedule_advice,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

content_recycler_service = ContentRecyclerService()
