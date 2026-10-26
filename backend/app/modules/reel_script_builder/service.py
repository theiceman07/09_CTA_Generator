import time
from typing import Dict, Any, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.logging import logger
from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.db.models.usage import UsageRecord
from app.ai.shared.validators import verify_content_grounding
from app.modules.reel_script_builder.schemas import (
    ReelScriptGeneratorRequest,
    ReelScriptGeneratorResponse,
    ReelScriptOutput,
)
from app.modules.reel_script_builder.chains import ReelScriptGenerationChain

class ReelScriptBuilderService:
    """
    Application Service orchestrating short-form video script generation,
    grounding verification, and database asset persistence.
    """

    def __init__(self, chain: Optional[ReelScriptGenerationChain] = None):
        self.chain = chain or ReelScriptGenerationChain()

    async def generate_script(
        self,
        db: AsyncSession,
        user_id: str,
        request: ReelScriptGeneratorRequest
    ) -> ReelScriptGeneratorResponse:
        start_time = time.time()

        # 1. Project ownership check if project_id is supplied
        project = None
        if request.project_id:
            proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
            project = proj_res.scalars().first()
            if not project:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            if project.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to access this project"
                )

        # 2. Invoke ReelScriptGenerationChain
        chain_inputs = {
            "topic": request.topic,
            "hook": request.hook,
            "audience": request.audience,
            "platform": request.platform,
            "tone": request.tone,
            "duration": request.duration,
            "content_goal": request.content_goal,
            "creator_context": request.creator_context,
            "project_context": project.description if project else None,
        }

        try:
            script_output, usage_metadata = await self.chain.ainvoke(chain_inputs)
        except Exception as e:
            logger.error(f"Reel script generation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Reel Script Generation error: {str(e)}"
            )

        total_latency = int((time.time() - start_time) * 1000)

        # 3. Grounding Verification
        script_text_parts = [
            script_output.title,
            script_output.hook,
            script_output.body,
            script_output.cta
        ]
        for sc in script_output.scenes:
            script_text_parts.append(sc.dialogue)
            script_text_parts.append(sc.visual_direction)
            if sc.on_screen_text:
                script_text_parts.append(sc.on_screen_text)

        full_script_text = "\n".join(script_text_parts)
        is_grounded, grounding_errors = verify_content_grounding(request.topic, full_script_text)
        if not is_grounded:
            logger.warning(f"Reel script grounding warnings: {grounding_errors}")

        # 4. Database Persistence (when project is provided)
        generation_id: Optional[str] = None
        if project:
            generation = AIGeneration(
                user_id=user_id,
                project_id=project.id,
                tool="reel-script-builder",
                provider="gemini",
                model=settings.GEMINI_MODEL,
                input_data=request.model_dump(),
                output_data=script_output.model_dump(),
                input_tokens=usage_metadata.input_tokens if usage_metadata else None,
                output_tokens=usage_metadata.output_tokens if usage_metadata else None,
                total_tokens=usage_metadata.total_tokens if usage_metadata else None,
                latency_ms=total_latency,
                status="completed"
            )
            db.add(generation)
            await db.flush()  # Populates generation.id
            generation_id = str(generation.id)

            # Build structured Markdown document for the asset
            scene_md_blocks = []
            for sc in script_output.scenes:
                scene_md_blocks.append(
                    f"### Scene {sc.scene_number} ({sc.timestamp})\n"
                    f"**Visual:** {sc.visual_direction}\n\n"
                    f"**Audio/Dialogue:** \"{sc.dialogue}\"\n\n"
                    f"**On-Screen Text:** {sc.on_screen_text or 'None'}\n"
                )

            asset_markdown = (
                f"# Reel Script: {script_output.title}\n\n"
                f"**Target Duration:** {script_output.duration} | **Platform:** {request.platform.upper()} | **Tone:** {request.tone.capitalize()}\n\n"
                f"## 1. Opening Hook (0 - 5 s)\n"
                f"> \"{script_output.hook}\"\n\n"
                f"## 2. Scene Breakdown\n"
                f"{''.join(scene_md_blocks)}\n"
                f"## 3. Call to Action (50 - 60 s)\n"
                f"> \"{script_output.cta}\"\n\n"
                f"## 4. Suggested Caption & Hashtags\n"
                f"{script_output.caption_suggestion or 'None'}\n"
            )

            asset = Asset(
                project_id=project.id,
                user_id=user_id,
                type="reel_script",
                title=f"Reel Script: {script_output.title[:100]}",
                content=asset_markdown,
                meta_info={
                    "tool": "reel-script-builder",
                    "generation_id": generation_id,
                    "duration": script_output.duration,
                    "platform": request.platform,
                    "tone": request.tone,
                    "scene_count": len(script_output.scenes),
                    "script_data": script_output.model_dump()
                }
            )
            db.add(asset)

            # Persist UsageRecord
            usage_rec = UsageRecord(
                user_id=user_id,
                project_id=project.id,
                generation_id=generation.id,
                tool="reel-script-builder",
                provider=generation.provider,
                model=generation.model,
                input_tokens=generation.input_tokens,
                output_tokens=generation.output_tokens,
                total_tokens=generation.total_tokens
            )
            db.add(usage_rec)
            await db.commit()
        else:
            import uuid
            generation_id = str(uuid.uuid4())

        return ReelScriptGeneratorResponse(
            generation_id=generation_id,
            project_id=project.id if project else None,
            topic=request.topic,
            platform=request.platform,
            tone=request.tone,
            duration=script_output.duration,
            script=script_output,
            usage={
                "input_tokens": usage_metadata.input_tokens if usage_metadata else None,
                "output_tokens": usage_metadata.output_tokens if usage_metadata else None,
                "total_tokens": usage_metadata.total_tokens if usage_metadata else None,
                "latency_ms": total_latency
            },
            metadata={
                "topic": request.topic,
                "hook_preserved": bool(request.hook),
                "scene_count": len(script_output.scenes),
                "is_grounded": is_grounded
            }
        )

reel_script_builder_service = ReelScriptBuilderService()
reel_script_service = reel_script_builder_service
