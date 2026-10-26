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
from app.modules.comment_analyzer.schemas import (
    CommentAnalyzerRequest,
    CommentAnalyzerResponse,
)
from app.modules.comment_analyzer.chains import comment_analysis_chain
from app.core.logging import logger

class CommentAnalyzerService:
    @staticmethod
    async def analyze_comments(
        db: AsyncSession,
        user_id: str,
        request: CommentAnalyzerRequest
    ) -> CommentAnalyzerResponse:
        start_time = time.time()

        # 1. Project ownership check
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # 2. Execute Chain
        llm_out = await comment_analysis_chain.execute(request)
        latency = int((time.time() - start_time) * 1000)

        # 3. Save AIGeneration Record
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="comment-analyzer",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={
                "comments_count": len(request.comments),
                "platform": request.platform,
                "focus_area": request.focus_area,
                "content_context": request.content_context
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
            type="comment_analysis",
            title=f"{project.name} - {request.platform} Audience Insights",
            content=json.dumps(llm_out.model_dump(), indent=2),
            meta_info={
                "tool": "comment-analyzer",
                "generation_id": generation.id,
                "platform": request.platform,
                "comments_count": len(request.comments),
                "overall_sentiment": llm_out.overall_sentiment
            }
        )
        db.add(asset)

        # 5. Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="comment-analyzer",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return CommentAnalyzerResponse(
            generation_id=generation.id,
            project_id=project.id,
            total_comments_analyzed=len(request.comments),
            platform=request.platform,
            focus_area=request.focus_area,
            overall_sentiment=llm_out.overall_sentiment,
            sentiment_distribution=llm_out.sentiment_distribution,
            key_themes=llm_out.key_themes,
            top_questions=llm_out.top_questions,
            objections_and_critiques=llm_out.objections_and_critiques,
            audience_insights=llm_out.audience_insights,
            actionable_recommendations=llm_out.actionable_recommendations,
            notable_quotes=llm_out.notable_quotes,
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

comment_analyzer_service = CommentAnalyzerService()
