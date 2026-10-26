from typing import List, Optional
from pydantic import BaseModel, Field

class ScreenplayCharacter(BaseModel):
    name: str = Field(description="Character name")
    role: str = Field(description="Protagonist, antagonist, mentor, ally")
    motivation: str = Field(description="Internal desire and external objective")
    arc_description: str = Field(description="Psychological development arc")

class ScreenplayLLMOutput(BaseModel):
    title: str = Field(description="Screenplay title")
    logline: str = Field(description="One-sentence dramatic hook")
    genre: str = Field(description="Genre classification")
    character_profiles: List[ScreenplayCharacter] = Field(description="Character ensemble")
    beat_sheet: List[str] = Field(description="Classic Save The Cat / 3-Act structural beats")
    scene_script: str = Field(description="Formatted screenplay scene script in industry standard slugline and dialogue format")
    director_notes: str = Field(description="Camera blocking, lighting, sound design, and acting notes")

class ScreenplayWorkspaceRequest(BaseModel):
    project_id: str = Field(..., description="Project ID")
    premise: str = Field(..., min_length=10, description="Dramatic premise, story logline, or character concept")
    genre: Optional[str] = Field(default="Sci-Fi / Tech Thriller", description="Film/TV genre")
    target_format: Optional[str] = Field(default="Short Film (10-15 mins)", description="Format: Feature, Short Film, Episodic Pilot")
    tone: Optional[str] = Field(default="Moody & Suspenseful", description="Dramatic tone")

class ScreenplayWorkspaceResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "screenplay-workspace"
    title: str
    logline: str
    genre: str
    character_profiles: List[ScreenplayCharacter]
    beat_sheet: List[str]
    scene_script: str
    director_notes: str
    latency_ms: int
    created_at: str
