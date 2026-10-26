from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DirectedPackage(BaseModel):
    concept: str = Field(description="Core strategic angle")
    hook: str = Field(description="Selected scroll-stopping hook")
    script_summary: str = Field(description="Narrative beats and visual direction")
    caption_summary: str = Field(description="Drafted caption copy")
    primary_cta: str = Field(description="High-converting call to action")

class ContentDirectorLLMOutput(BaseModel):
    campaign_title: str = Field(description="Campaign headline")
    strategic_thesis: str = Field(description="Editorial thesis statement")
    workflow_steps_executed: List[str] = Field(description="Orchestrated workflow stages")
    directed_package: DirectedPackage = Field(description="End-to-end coordinated creative asset package")
    production_readiness_score: int = Field(ge=0, le=100, description="Readiness score (0-100)")
    guruvelah_principles: Optional[List[str]] = Field(default_factory=list, description="Philosophical rules applied")

class ContentDirectorRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    topic: str = Field(..., min_length=3, description="Campaign topic or focus")
    target_platform: Optional[str] = Field(default="Instagram", description="Primary distribution platform")
    target_audience: Optional[str] = Field(default=None, description="Audience demographic")
    campaign_goal: Optional[str] = Field(default="Saves & Authority", description="Core metric goal")

class ContentDirectorResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "ai-content-director"
    campaign_title: str
    strategic_thesis: str
    workflow_steps_executed: List[str]
    directed_package: DirectedPackage
    production_readiness_score: int
    guruvelah_principles: Optional[List[str]] = None
    latency_ms: int
    created_at: str
