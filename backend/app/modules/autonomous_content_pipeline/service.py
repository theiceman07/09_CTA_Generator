import time
import json
import uuid
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.db.models.usage import UsageRecord
from app.modules.autonomous_content_pipeline.schemas import (
    AutonomousPipelineRequest,
    AutonomousPipelineResponse,
)
from app.modules.autonomous_content_pipeline.graph import autonomous_pipeline_graph

class AutonomousPipelineService:
    @staticmethod
    async def run_pipeline(
        db: AsyncSession,
        user_id: str,
        request: AutonomousPipelineRequest
    ) -> AutonomousPipelineResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        pipeline_run_id = f"pipe_{uuid.uuid4().hex[:10]}"

        # Invoke LangGraph state machine
        initial_state = {
            "pipeline_id": pipeline_run_id,
            "source_input": request.source_input,
            "target_platforms": request.target_platforms or ["Instagram", "LinkedIn"],
            "automation_depth": request.automation_depth or "Full Production Pass",
            "current_stage": "init",
            "stages_completed": [],
            "title": "",
            "script": "",
            "caption": "",
            "hashtags": [],
            "audit_verdict": "",
            "final_output": None
        }

        graph_result = await autonomous_pipeline_graph.ainvoke(initial_state)
        llm_out = graph_result.get("final_output")

        latency = int((time.time() - start_time) * 1000)

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="autonomous-content-pipeline",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "source_input": request.source_input,
                "automation_depth": request.automation_depth
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
            type="pipeline_production_bundle",
            title=f"{project.name} - Pipeline: {llm_out.output_bundle.title[:40]}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "autonomous-content-pipeline",
                "generation_id": generation.id,
                "pipeline_id": llm_out.pipeline_id,
                "stages_count": len(llm_out.stages_completed)
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="autonomous-content-pipeline",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return AutonomousPipelineResponse(
            generation_id=generation.id,
            project_id=project.id,
            pipeline_id=llm_out.pipeline_id,
            status=llm_out.status,
            stages_completed=llm_out.stages_completed,
            output_bundle=llm_out.output_bundle,
            audit_verdict=llm_out.audit_verdict,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

autonomous_pipeline_service = AutonomousPipelineService()
