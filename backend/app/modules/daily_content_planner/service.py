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
from app.modules.daily_content_planner.schemas import (
    DailyContentPlannerRequest,
    DailyContentPlannerResponse,
)
from app.modules.daily_content_planner.chains import daily_planner_chain
from app.core.logging import logger

class DailyContentPlannerService:
    @staticmethod
    async def generate_plan(
        db: AsyncSession,
        user_id: str,
        request: DailyContentPlannerRequest
    ) -> DailyContentPlannerResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await daily_planner_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="daily-content-planner",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "core_topics": request.core_topics,
                "days_count": request.days_count,
                "platforms": request.platforms
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
            type="content_schedule",
            title=f"{project.name} - {request.days_count}-Day Content Calendar",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "daily-content-planner",
                "generation_id": generation.id,
                "days_count": request.days_count,
                "slots_count": len(llm_out.schedule)
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="daily-content-planner",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return DailyContentPlannerResponse(
            generation_id=generation.id,
            project_id=project.id,
            days_count=request.days_count,
            platforms=request.platforms,
            strategic_overview=llm_out.strategic_overview,
            schedule=llm_out.schedule,
            production_milestones=llm_out.production_milestones,
            consistency_tip=llm_out.consistency_tip,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

daily_content_planner_service = DailyContentPlannerService()
