import time
import json
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
from app.modules.content_idea_generator.schemas import (
    ContentIdeaRequest,
    ContentIdeaResponse,
    IdeaOutput,
    IdeaListOutput,
)
from app.modules.content_idea_generator.chains import IdeaGenerationChain

class ContentIdeaGeneratorService:
    """
    Application Service orchestrating Content Idea Generation,
    grounding verification, and database asset persistence.
    """

    def __init__(self, chain: Optional[IdeaGenerationChain] = None):
        self.chain = chain or IdeaGenerationChain()

    async def generate_ideas(
        self,
        db: AsyncSession,
        user_id: str,
        request: ContentIdeaRequest
    ) -> ContentIdeaResponse:
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
            "niche": request.niche or (project.name if project else "General Tech & Innovation"),
            "target_audience": request.target_audience or (project.target_audience if project else "Target Audience"),
            "content_goal": request.content_goal or (project.primary_goal if project else "Engagement"),
            "platform": request.platform or "all",
            "tone": request.tone or (project.tone if project else "engaging"),
            "number_of_ideas": request.number_of_ideas or 5,
            "project_context": project_context,
        }

        # 3. Execute the dedicated IdeaGenerationChain
        idea_list_output, usage_metadata = await self.chain.ainvoke(chain_inputs)

        # 4. Strict grounding verification
        all_ideas_text = " ".join(
            f"{i.title} {i.idea} {i.hook} {i.description} {i.platform}" for i in idea_list_output.ideas
        )
        is_grounded, grounding_errors = verify_content_grounding(request.topic, all_ideas_text)
        if not is_grounded:
            logger.warning(f"Idea generation grounding check note: {grounding_errors}")

        total_latency = int((time.time() - start_time) * 1000)

        # 5. Database Persistence (when project is provided)
        generation_id: Optional[str] = None
        if project:
            generation = AIGeneration(
                project_id=project.id,
                user_id=user_id,
                tool="content-idea-generator",
                provider="gemini",
                model=settings.GEMINI_MODEL,
                input_data=request.model_dump(),
                output_data={
                    "ideas": [i.model_dump() for i in idea_list_output.ideas],
                    "summary": idea_list_output.summary
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

            # Persist each idea as a Project Asset
            for idx, idea in enumerate(idea_list_output.ideas, start=1):
                asset_content = (
                    f"Concept: {idea.idea}\n\n"
                    f"Hook: {idea.hook}\n\n"
                    f"Execution Plan: {idea.description}\n\n"
                    f"Target Audience: {idea.target_audience}\n"
                    f"Platform: {idea.platform}\n"
                    f"Rationale: {idea.rationale}"
                )
                asset = Asset(
                    project_id=project.id,
                    user_id=user_id,
                    type="content-idea",
                    title=f"{idea.title[:120]}",
                    content=asset_content,
                    meta_info={
                        "tool": "content-idea-generator",
                        "generation_id": generation_id,
                        "platform": idea.platform,
                        "idea_index": idx,
                        "idea_data": idea.model_dump()
                    }
                )
                db.add(asset)

            # Persist UsageRecord
            usage_rec = UsageRecord(
                user_id=user_id,
                project_id=project.id,
                generation_id=generation.id,
                tool="content-idea-generator",
                provider=generation.provider,
                model=generation.model,
                input_tokens=generation.input_tokens,
                output_tokens=generation.output_tokens,
                total_tokens=generation.total_tokens
            )
            db.add(usage_rec)
            await db.commit()

        return ContentIdeaResponse(
            generation_id=generation_id,
            project_id=str(project.id) if project else None,
            ideas=idea_list_output.ideas,
            summary=idea_list_output.summary,
            usage={
                "input_tokens": usage_metadata.input_tokens,
                "output_tokens": usage_metadata.output_tokens,
                "total_tokens": usage_metadata.total_tokens,
                "latency_ms": total_latency
            },
            metadata={
                "topic": request.topic,
                "niche": request.niche,
                "platform": request.platform,
                "tone": request.tone,
                "number_of_ideas": len(idea_list_output.ideas),
                "is_grounded": is_grounded
            }
        )

content_idea_service = ContentIdeaGeneratorService()
