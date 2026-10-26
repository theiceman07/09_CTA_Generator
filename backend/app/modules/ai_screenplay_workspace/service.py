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
from app.modules.ai_screenplay_workspace.schemas import (
    ScreenplayWorkspaceRequest,
    ScreenplayWorkspaceResponse,
)
from app.modules.ai_screenplay_workspace.chains import screenplay_generation_chain

class ScreenplayWorkspaceService:
    @staticmethod
    async def develop_screenplay(
        db: AsyncSession,
        user_id: str,
        request: ScreenplayWorkspaceRequest
    ) -> ScreenplayWorkspaceResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute chain
        llm_out = await screenplay_generation_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="screenplay-workspace",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "premise": request.premise,
                "genre": request.genre,
                "target_format": request.target_format
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
            type="screenplay_script",
            title=f"{project.name} - Screenplay: {llm_out.title[:40]}",
            content=llm_out.scene_script,
            meta_info={
                "tool": "screenplay-workspace",
                "generation_id": generation.id,
                "logline": llm_out.logline,
                "genre": llm_out.genre,
                "characters_count": len(llm_out.character_profiles)
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="screenplay-workspace",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return ScreenplayWorkspaceResponse(
            generation_id=generation.id,
            project_id=project.id,
            title=llm_out.title,
            logline=llm_out.logline,
            genre=llm_out.genre,
            character_profiles=llm_out.character_profiles,
            beat_sheet=llm_out.beat_sheet,
            scene_script=llm_out.scene_script,
            director_notes=llm_out.director_notes,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

screenplay_workspace_service = ScreenplayWorkspaceService()
