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
from app.modules.creator_collaboration_finder.schemas import (
    CollaborationFinderRequest,
    CollaborationFinderResponse,
)
from app.modules.creator_collaboration_finder.chains import collaboration_finder_chain
from app.core.logging import logger

class CollaborationFinderService:
    @staticmethod
    async def find_collaborations(
        db: AsyncSession,
        user_id: str,
        request: CollaborationFinderRequest
    ) -> CollaborationFinderResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await collaboration_finder_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="collaboration-finder",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "creator_niche": request.creator_niche,
                "primary_platform": request.primary_platform,
                "collaboration_goal": request.collaboration_goal
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
            type="collaboration_matches",
            title=f"{project.name} - Collaboration Opportunities",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "collaboration-finder",
                "generation_id": generation.id,
                "creator_niche": request.creator_niche,
                "archetypes_count": len(llm_out.partner_archetypes)
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="collaboration-finder",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return CollaborationFinderResponse(
            generation_id=generation.id,
            project_id=project.id,
            creator_niche=request.creator_niche,
            primary_platform=request.primary_platform,
            creator_positioning_analysis=llm_out.creator_positioning_analysis,
            ideal_partner_criteria=llm_out.ideal_partner_criteria,
            partner_archetypes=llm_out.partner_archetypes,
            collaboration_ideas=llm_out.collaboration_ideas,
            outreach_strategy_tips=llm_out.outreach_strategy_tips,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

collaboration_finder_service = CollaborationFinderService()
