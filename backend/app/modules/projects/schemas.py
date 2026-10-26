from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255, description="Project workspace name")
    description: Optional[str] = Field(default=None, description="Project description or notes")
    target_audience: Optional[str] = Field(default="Creators & Founders", description="Primary audience")
    tone: Optional[str] = Field(default="Professional", description="Default content tone")
    primary_goal: Optional[str] = Field(default="Growth", description="Main conversion objective")

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    target_audience: Optional[str] = None
    tone: Optional[str] = None
    primary_goal: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    target_audience: Optional[str] = None
    tone: str
    primary_goal: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProjectDetailResponse(ProjectResponse):
    assets_count: int = 0
    generations_count: int = 0
