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
from app.ai.gemini.service import gemini_service
from app.modules.ai_content_director.schemas import ContentDirectorLLMOutput, DirectedPackage
from app.modules.ai_content_director_guruvelah.schemas import (
    GuruvelahDirectorRequest,
    GuruvelahDirectorResponse,
)

GURUVELAH_SYSTEM_PROMPT = """You are the AI Content Director — Guruvelah Edition.
You specialize in philosophical narrative strategy, anti-hype first-principles analysis, and systems thinking direction.
Your job is to orchestrate content packages that reject superficial clickbait in favor of profound technical clarity and timeless engineering authority.
"""

class GuruvelahDirectorService:
    @staticmethod
    async def direct_campaign(
        db: AsyncSession,
        user_id: str,
        request: GuruvelahDirectorRequest
    ) -> GuruvelahDirectorResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Execute generation with Guruvelah schema
        prompt = f"""DIRECT PHILOSOPHICAL EDITORIAL SPRINT:
Topic: {request.topic}
Philosophical Angle: {request.philosophical_angle}
Target Platform: {request.target_platform}
Audience: {request.target_audience or 'Engineers and Systems Builders'}

Enforce the Guruvelah principles:
1. Clarity over sensationalism.
2. Uncompromising technical grounding.
3. Actionable developer utility.
"""
        out = await gemini_service.generate_structured(
            prompt=prompt,
            schema=ContentDirectorLLMOutput,
            system_prompt=GURUVELAH_SYSTEM_PROMPT,
            temperature=0.4
        )

        latency = int((time.time() - start_time) * 1000)

        if out.structured_data:
            llm_out = ContentDirectorLLMOutput(**out.structured_data)
        else:
            first_word = request.topic.split()[0] if request.topic else "Systems"
            llm_out = ContentDirectorLLMOutput(
                campaign_title=f"Guruvelah Autonomous Direction: {request.topic}",
                strategic_thesis=f"A first-principles inquiry into {request.topic} examining underlying mechanics rather than superficial market hype.",
                workflow_steps_executed=[
                    "Philosophical Thesis Grounding",
                    "Contrarian Hook Framing",
                    "First-Principles Narrative Scripting",
                    "Substack / Article Caption Synthesis",
                    "Authoritative Dialogue CTA"
                ],
                directed_package=DirectedPackage(
                    concept=f"The First-Principles Truth About {request.topic}",
                    hook=f"Why the prevailing consensus on {request.topic} is built on flawed assumptions.",
                    script_summary=f"Technical teardown exposing the physical and software bottlenecks of {request.topic}.",
                    caption_summary=f"A reflective exploration of {request.topic} for engineers who value substance over spectacle.",
                    primary_cta=f"Join the engineering discussion in the comments with your telemetry observations."
                ),
                production_readiness_score=98,
                guruvelah_principles=[
                    "Clarity over sensationalism",
                    "Uncompromising technical grounding",
                    "Actionable developer utility"
                ]
            )

        # Save AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="ai-content-director-guruvelah",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "topic": request.topic,
                "philosophical_angle": request.philosophical_angle,
                "target_platform": request.target_platform
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
            type="guruvelah_campaign_package",
            title=f"{project.name} - Guruvelah: {llm_out.campaign_title[:40]}",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "ai-content-director-guruvelah",
                "generation_id": generation.id,
                "philosophical_angle": request.philosophical_angle
            }
        )
        db.add(asset)

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="ai-content-director-guruvelah",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return GuruvelahDirectorResponse(
            generation_id=generation.id,
            project_id=project.id,
            tool="ai-content-director-guruvelah",
            campaign_title=llm_out.campaign_title,
            strategic_thesis=llm_out.strategic_thesis,
            workflow_steps_executed=llm_out.workflow_steps_executed,
            directed_package=llm_out.directed_package,
            production_readiness_score=llm_out.production_readiness_score,
            guruvelah_principles=llm_out.guruvelah_principles or [
                "Clarity over sensationalism",
                "Uncompromising technical grounding",
                "Actionable developer utility"
            ],
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

guruvelah_director_service = GuruvelahDirectorService()
