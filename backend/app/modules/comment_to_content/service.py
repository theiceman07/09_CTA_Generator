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
from app.modules.comment_to_content.schemas import (
    CommentToContentRequest,
    CommentToContentResponse,
)
from app.modules.comment_to_content.chains import comment_to_content_chain
from app.core.logging import logger

class CommentToContentService:
    @staticmethod
    async def generate_content_from_comment(
        db: AsyncSession,
        user_id: str,
        request: CommentToContentRequest
    ) -> CommentToContentResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await comment_to_content_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        best_idea = (
            llm_out.ideas[llm_out.recommended_idea_index]
            if 0 <= llm_out.recommended_idea_index < len(llm_out.ideas)
            else (llm_out.ideas[0] if llm_out.ideas else None)
        )

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="comment-to-content",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data=request.model_dump(),
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
            type="content_idea",
            title=f"{project.name} - Reply: {request.comment[:40]}...",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "comment-to-content",
                "generation_id": generation.id,
                "source_comment": request.comment,
                "platform": request.platform,
                "recommended_title": best_idea.title if best_idea else ""
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="comment-to-content",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return CommentToContentResponse(
            generation_id=generation.id,
            project_id=project.id,
            source_comment=request.comment,
            platform=request.platform,
            ideas=llm_out.ideas,
            recommended_idea=best_idea,
            strategic_summary=llm_out.strategic_summary,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

comment_to_content_service = CommentToContentService()
