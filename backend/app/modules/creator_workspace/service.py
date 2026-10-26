import json
from collections import Counter
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.db.models.project import Project
from app.db.models.asset import Asset
from app.db.models.generation import AIGeneration
from app.modules.creator_workspace.schemas import (
    WorkspaceAssetItem,
    WorkspaceProjectOverview,
    WorkspaceHandoffRequest,
    WorkspaceHandoffResponse,
)

class CreatorWorkspaceService:
    @staticmethod
    async def get_overview(
        db: AsyncSession,
        user_id: str,
        project_id: str
    ) -> WorkspaceProjectOverview:
        # Verify project ownership
        proj_res = await db.execute(select(Project).where(Project.id == project_id))
        project = proj_res.scalars().first()
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
        if project.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this project.")

        # Fetch assets
        assets_res = await db.execute(
            select(Asset)
            .where(Asset.project_id == project_id)
            .order_by(desc(Asset.created_at))
        )
        assets = assets_res.scalars().all()

        # Fetch generations count
        gen_res = await db.execute(
            select(AIGeneration)
            .where(AIGeneration.project_id == project_id)
        )
        generations = gen_res.scalars().all()

        type_counter = Counter(a.type for a in assets)

        recent_items = [
            WorkspaceAssetItem(
                id=a.id,
                title=a.title,
                type=a.type,
                created_at=a.created_at.isoformat() if a.created_at else "",
                content_snippet=(a.content[:160] + "...") if len(a.content) > 160 else a.content,
                meta_info=a.meta_info or {}
            )
            for a in assets[:20]
        ]

        return WorkspaceProjectOverview(
            project_id=project.id,
            project_name=project.name,
            description=project.description,
            target_audience=project.target_audience,
            tone=project.tone,
            total_assets=len(assets),
            asset_types_breakdown=dict(type_counter),
            recent_assets=recent_items,
            recent_generations_count=len(generations)
        )

    @staticmethod
    async def prepare_handoff(
        db: AsyncSession,
        user_id: str,
        request: WorkspaceHandoffRequest
    ) -> WorkspaceHandoffResponse:
        asset_res = await db.execute(select(Asset).where(Asset.id == request.source_asset_id))
        asset = asset_res.scalars().first()
        if not asset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found.")
        if asset.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this asset.")

        content_text = asset.content
        try:
            parsed = json.loads(asset.content)
            if isinstance(parsed, dict):
                # Extract primary text field if available
                content_text = (
                    parsed.get("script") or
                    parsed.get("caption") or
                    parsed.get("repurposed_content") or
                    parsed.get("overview") or
                    parsed.get("executive_brief") or
                    parsed.get("hook") or
                    str(asset.content)
                )
        except Exception:
            pass

        return WorkspaceHandoffResponse(
            source_asset_id=asset.id,
            source_type=asset.type,
            target_tool=request.target_tool,
            prefill_content=str(content_text),
            suggested_params={"project_id": asset.project_id}
        )

creator_workspace_service = CreatorWorkspaceService()
