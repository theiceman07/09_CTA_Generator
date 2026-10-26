import time
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.db.models.usage import UsageRecord
from app.modules.creator_second_brain.schemas import (
    SecondBrainItemCreate,
    SecondBrainItemResponse,
    SecondBrainQueryRequest,
    SecondBrainQueryResponse,
    SecondBrainSynthesisLLMOutput
)
from app.modules.creator_second_brain.chains import second_brain_synthesis_chain

class CreatorSecondBrainService:
    @staticmethod
    async def create_item(
        db: AsyncSession,
        user_id: str,
        data: SecondBrainItemCreate
    ) -> SecondBrainItemResponse:
        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == data.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        asset = Asset(
            project_id=project.id,
            user_id=user_id,
            type="second_brain_item",
            title=data.title,
            content=data.content,
            meta_info={
                "tool": "creator-second-brain",
                "category": data.category,
                "tags": data.tags,
                "source_ref": data.source_ref
            }
        )
        db.add(asset)
        await db.commit()
        await db.refresh(asset)

        return SecondBrainItemResponse(
            id=asset.id,
            project_id=asset.project_id,
            title=asset.title,
            content=asset.content,
            category=data.category,
            tags=data.tags,
            source_ref=data.source_ref,
            created_at=asset.created_at.isoformat() if asset.created_at else ""
        )

    @staticmethod
    async def list_items(
        db: AsyncSession,
        user_id: str,
        project_id: str,
        query: Optional[str] = None,
        category: Optional[str] = None
    ) -> List[SecondBrainItemResponse]:
        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        stmt = (
            select(Asset)
            .where(Asset.project_id == project_id, Asset.type == "second_brain_item")
            .order_by(desc(Asset.created_at))
        )
        res = await db.execute(stmt)
        assets = res.scalars().all()

        results = []
        for a in assets:
            meta = a.meta_info or {}
            item_cat = meta.get("category", "")
            tags = meta.get("tags", [])
            source_ref = meta.get("source_ref")

            if category and item_cat.lower() != category.lower():
                continue

            if query:
                q_low = query.lower()
                matches_title = q_low in a.title.lower()
                matches_content = q_low in a.content.lower()
                matches_tags = any(q_low in t.lower() for t in tags)
                if not (matches_title or matches_content or matches_tags):
                    continue

            results.append(
                SecondBrainItemResponse(
                    id=a.id,
                    project_id=a.project_id,
                    title=a.title,
                    content=a.content,
                    category=item_cat or "general",
                    tags=tags,
                    source_ref=source_ref,
                    created_at=a.created_at.isoformat() if a.created_at else ""
                )
            )
        return results

    @staticmethod
    async def query_brain(
        db: AsyncSession,
        user_id: str,
        request: SecondBrainQueryRequest
    ) -> SecondBrainQueryResponse:
        start_time = time.time()

        # Check project ownership
        proj_res = await db.execute(select(Project).where(Project.id == request.project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Retrieve items
        all_items = await CreatorSecondBrainService.list_items(
            db=db,
            user_id=user_id,
            project_id=request.project_id,
            category=request.category_filter
        )

        # Build retrieval context
        retrieved_dict_list = [
            {
                "title": item.title,
                "content": item.content,
                "category": item.category,
                "tags": item.tags
            }
            for item in all_items
        ]

        if not retrieved_dict_list:
            # Handle empty brain gracefully
            llm_out = SecondBrainSynthesisLLMOutput(
                direct_answer="Your Second Brain currently has no notes recorded in this project. Save thoughts, research snippets, or frameworks first to unlock contextual answers.",
                connected_themes=["No saved memories yet"],
                suggested_content_hooks=["Document your first technical takeaway to start your second brain knowledge base."],
                referenced_item_titles=[]
            )
        else:
            llm_out = await second_brain_synthesis_chain.execute(
                query=request.query,
                retrieved_notes=retrieved_dict_list
            )

        latency = int((time.time() - start_time) * 1000)

        # Record AIGeneration
        generation = AIGeneration(
            project_id=project.id,
            user_id=user_id,
            tool="creator-second-brain",
            provider="gemini",
            model=settings.GEMINI_MODEL,
            input_data={"query": request.query, "category_filter": request.category_filter},
            output_data=llm_out.model_dump(),
            latency_ms=latency,
            status="completed"
        )
        db.add(generation)
        await db.flush()

        # Usage record
        usage = UsageRecord(
            user_id=user_id,
            project_id=project.id,
            generation_id=generation.id,
            tool="creator-second-brain",
            provider="gemini",
            model=settings.GEMINI_MODEL
        )
        db.add(usage)
        await db.commit()

        return SecondBrainQueryResponse(
            generation_id=generation.id,
            project_id=project.id,
            query=request.query,
            direct_answer=llm_out.direct_answer,
            connected_themes=llm_out.connected_themes,
            suggested_content_hooks=llm_out.suggested_content_hooks,
            referenced_item_titles=llm_out.referenced_item_titles,
            matched_items=all_items[:10],
            latency_ms=latency,
            created_at=datetime.now(timezone.utc).isoformat()
        )

creator_second_brain_service = CreatorSecondBrainService()
