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
from app.modules.hook_generator.schemas import (
    HookGeneratorRequest,
    HookGeneratorResponse,
    HookOutput,
    HookListOutput,
)
from app.modules.hook_generator.chains import HookGenerationChain

class HookGeneratorService:
    """
    Application Service orchestrating Hook Generation across 10 psychological frameworks,
    grounding verification, and database asset persistence.
    """

    def __init__(self, chain: Optional[HookGenerationChain] = None):
        self.chain = chain or HookGenerationChain()

    async def generate_hooks(
        self,
        db: AsyncSession,
        user_id: str,
        request: HookGeneratorRequest
    ) -> HookGeneratorResponse:
        start_time = time.time()

        # 1. Project ownership check if project_id is supplied
        project = None
        if request.project_id:
            proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
            project = proj_res.scalars().first()
            if not project:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found."
                )
            if project.user_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have access to this project."
                )

        # 2. Assemble creator & project context
        project_context = ""
        if project:
            context_items = []
            if project.name:
                context_items.append(f"Project Name: {project.name}")
            if project.description:
                context_items.append(f"Description: {project.description}")
            if project.target_audience:
                context_items.append(f"Audience: {project.target_audience}")
            if project.tone:
                context_items.append(f"Tone: {project.tone}")
            project_context = "\n".join(context_items)

        chain_inputs = {
            "topic": request.topic,
            "source_content": request.source_content or "",
            "audience": request.audience or (project.target_audience if project else "Target Audience"),
            "platform": request.platform or "all",
            "tone": request.tone or (project.tone if project else "bold"),
            "hook_style": request.hook_style or "all",
            "number_of_hooks": request.number_of_hooks or 10,
            "project_context": project_context,
        }

        # 3. Execute dedicated HookGenerationChain
        hook_list_output, usage_metadata = await self.chain.ainvoke(chain_inputs)

        # 4. Strict grounding verification
        all_hooks_text = " ".join(f"{h.hook} {h.style}" for h in hook_list_output.hooks)
        is_grounded, grounding_errors = verify_content_grounding(request.topic, all_hooks_text)
        if not is_grounded:
            logger.warning(f"Hook generation grounding check note: {grounding_errors}")

        total_latency = int((time.time() - start_time) * 1000)

        # 5. Database Persistence (when project is provided)
        generation_id: Optional[str] = None
        if project:
            generation = AIGeneration(
                project_id=project.id,
                user_id=user_id,
                tool="hook-generator",
                provider="gemini",
                model=settings.GEMINI_MODEL,
                input_data=request.model_dump(),
                output_data={
                    "hooks": [h.model_dump() for h in hook_list_output.hooks],
                    "topic": request.topic,
                    "platform": request.platform,
                    "tone": request.tone
                },
                input_tokens=usage_metadata.input_tokens,
                output_tokens=usage_metadata.output_tokens,
                total_tokens=usage_metadata.total_tokens,
                latency_ms=total_latency,
                status="completed"
            )
            db.add(generation)
            await db.flush()  # Populates generation.id
            generation_id = str(generation.id)

            # Persist each hook as a Project Asset
            for idx, hook in enumerate(hook_list_output.hooks, start=1):
                asset_content = (
                    f"Hook ({hook.style}):\n\"{hook.hook}\"\n\n"
                    f"Platform: {hook.platform or request.platform}\n"
                    f"Framework: {hook.style}\n"
                    f"Rationale: {hook.rationale or 'N/A'}"
                )
                asset = Asset(
                    project_id=project.id,
                    user_id=user_id,
                    type="hook",
                    title=f"[{hook.style}] {hook.hook[:100]}",
                    content=asset_content,
                    meta_info={
                        "tool": "hook-generator",
                        "generation_id": generation_id,
                        "style": hook.style,
                        "platform": hook.platform or request.platform,
                        "hook_index": idx,
                        "hook_data": hook.model_dump()
                    }
                )
                db.add(asset)

            # Persist UsageRecord
            usage_rec = UsageRecord(
                user_id=user_id,
                project_id=project.id,
                generation_id=generation.id,
                tool="hook-generator",
                provider=generation.provider,
                model=generation.model,
                input_tokens=generation.input_tokens,
                output_tokens=generation.output_tokens,
                total_tokens=generation.total_tokens
            )
            db.add(usage_rec)
            await db.commit()

        return HookGeneratorResponse(
            generation_id=generation_id,
            project_id=str(project.id) if project else None,
            hooks=hook_list_output.hooks,
            topic=request.topic,
            platform=request.platform or "all",
            tone=request.tone or "bold",
            usage={
                "input_tokens": usage_metadata.input_tokens,
                "output_tokens": usage_metadata.output_tokens,
                "total_tokens": usage_metadata.total_tokens,
                "latency_ms": total_latency
            },
            metadata={
                "topic": request.topic,
                "audience": request.audience,
                "platform": request.platform,
                "tone": request.tone,
                "number_of_hooks": len(hook_list_output.hooks),
                "is_grounded": is_grounded
            }
        )

hook_generator_service = HookGeneratorService()
