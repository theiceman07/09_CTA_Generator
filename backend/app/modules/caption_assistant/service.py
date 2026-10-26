import time
import uuid
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
from app.modules.caption_assistant.schemas import (
    CaptionGeneratorRequest,
    CaptionGeneratorResponse,
    CaptionOutput,
)
from app.modules.caption_assistant.chains import CaptionGenerationChain


class CaptionAssistantService:
    """
    Application Service orchestrating social media caption generation,
    grounding verification, and database asset persistence.
    """

    def __init__(self, chain: Optional[CaptionGenerationChain] = None):
        self.chain = chain or CaptionGenerationChain()

    async def generate_caption(
        self,
        db: AsyncSession,
        user_id: str,
        request: CaptionGeneratorRequest
    ) -> CaptionGeneratorResponse:
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

        # 2. Invoke CaptionGenerationChain
        chain_inputs = {
            "topic": request.topic,
            "platform": request.platform,
            "tone": request.tone,
            "target_audience": request.target_audience,
            "content_goal": request.content_goal,
            "caption_length": request.caption_length,
            "hook": request.hook,
            "cta": request.cta,
            "include_hashtags": request.include_hashtags,
            "hashtag_count": request.hashtag_count,
            "include_emojis": request.include_emojis,
            "include_seo_keywords": request.include_seo_keywords,
            "format_type": request.format_type,
            "creator_context": request.creator_context,
            "project_context": project.description if project else None,
        }

        try:
            caption_output, usage_metadata = await self.chain.ainvoke(chain_inputs)
        except Exception as e:
            logger.error(f"Caption generation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Caption Generation error: {str(e)}"
            )

        total_latency = int((time.time() - start_time) * 1000)

        # 3. Grounding Verification
        text_parts = [
            caption_output.caption,
            caption_output.hook,
            caption_output.body,
            caption_output.call_to_action
        ]
        for v in caption_output.variants:
            text_parts.append(v.hook)
            text_parts.append(v.body)
            text_parts.append(v.cta)

        full_caption_text = "\n".join(text_parts)
        is_grounded, grounding_errors = verify_content_grounding(request.topic, full_caption_text)
        if not is_grounded:
            logger.warning(f"Caption grounding warnings: {grounding_errors}")

        # 4. Database Persistence (when project is provided)
        generation_id: Optional[str] = None
        if project:
            generation = AIGeneration(
                user_id=user_id,
                project_id=project.id,
                tool="caption-assistant",
                provider="gemini",
                model=settings.GEMINI_MODEL,
                input_data=request.model_dump(),
                output_data=caption_output.model_dump(),
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
            variants_md = []
            for i, v in enumerate(caption_output.variants):
                is_rec = " ★ [RECOMMENDED]" if i == caption_output.recommended_variant_index else ""
                v_tags = " ".join(f"#{t.lstrip('#')}" for t in v.hashtags) if v.hashtags else "None"
                variants_md.append(
                    f"### Take {i + 1}: {v.label}{is_rec}\n"
                    f"**Reach Score:** {v.reach_score}/100\n\n"
                    f"**Hook:** {v.hook}\n\n"
                    f"{v.body}\n\n"
                    f"**CTA:** {v.cta}\n\n"
                    f"**Hashtags:** {v_tags}\n\n"
                    f"**Why it works:** {v.why}\n"
                )

            tags_formatted = " ".join(f"#{t.lstrip('#')}" for t in caption_output.hashtags) if caption_output.hashtags else "None"

            asset_markdown = (
                f"# Social Caption: {caption_output.hook[:80]}\n\n"
                f"**Platform:** {request.platform.upper()} | **Tone:** {request.tone.capitalize()} | **Goal:** {caption_output.content_goal}\n\n"
                f"## Primary Publishable Caption\n\n"
                f"{caption_output.caption}\n\n"
                f"**Hashtags:** {tags_formatted}\n\n"
                f"## Creative Variations ({len(caption_output.variants)} Takes)\n\n"
                f"{''.join(variants_md)}\n\n"
                f"## Strategy & Reach Reason\n"
                f"> {caption_output.recommend_reason}\n"
            )

            asset = Asset(
                project_id=project.id,
                user_id=user_id,
                type="caption",
                title=f"Caption: {caption_output.hook[:80]}",
                content=asset_markdown,
                meta_info={
                    "tool": "caption-assistant",
                    "generation_id": generation_id,
                    "platform": request.platform,
                    "tone": request.tone,
                    "content_goal": caption_output.content_goal,
                    "variant_count": len(caption_output.variants),
                    "caption_data": caption_output.model_dump()
                }
            )
            db.add(asset)

            # Persist UsageRecord
            usage_rec = UsageRecord(
                user_id=user_id,
                project_id=project.id,
                generation_id=generation.id,
                tool="caption-assistant",
                provider=generation.provider,
                model=generation.model,
                input_tokens=generation.input_tokens,
                output_tokens=generation.output_tokens,
                total_tokens=generation.total_tokens
            )
            db.add(usage_rec)
            await db.commit()
        else:
            generation_id = str(uuid.uuid4())

        return CaptionGeneratorResponse(
            generation_id=generation_id,
            project_id=project.id if project else None,
            topic=request.topic,
            platform=request.platform,
            tone=request.tone,
            caption_length=request.caption_length,
            caption=caption_output,
            usage={
                "input_tokens": usage_metadata.input_tokens if usage_metadata else None,
                "output_tokens": usage_metadata.output_tokens if usage_metadata else None,
                "total_tokens": usage_metadata.total_tokens if usage_metadata else None,
                "latency_ms": total_latency
            },
            metadata={
                "topic": request.topic,
                "platform": request.platform,
                "tone": request.tone,
                "hook_preserved": bool(request.hook),
                "variant_count": len(caption_output.variants),
                "is_grounded": is_grounded
            }
        )


caption_assistant_service = CaptionAssistantService()
caption_service = caption_assistant_service
