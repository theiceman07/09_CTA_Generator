from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WorkspaceAssetItem(BaseModel):
    id: str
    title: str
    type: str
    created_at: str
    content_snippet: str
    meta_info: Dict[str, Any] = Field(default_factory=dict)

class WorkspaceProjectOverview(BaseModel):
    project_id: str
    project_name: str
    description: Optional[str] = None
    target_audience: Optional[str] = None
    tone: Optional[str] = None
    total_assets: int
    asset_types_breakdown: Dict[str, int]
    recent_assets: List[WorkspaceAssetItem]
    recent_generations_count: int

class WorkspaceHandoffRequest(BaseModel):
    source_asset_id: str
    target_tool: str = Field(..., description="Target tool identifier (e.g. hook_generator, reel_script_builder, caption_assistant, cta_generator)")

class WorkspaceHandoffResponse(BaseModel):
    source_asset_id: str
    source_type: str
    target_tool: str
    prefill_content: str
    suggested_params: Dict[str, Any] = Field(default_factory=dict)
