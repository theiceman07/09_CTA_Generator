from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RecycledVariation(BaseModel):
    format_name: str = Field(description="Name of format (e.g. 5-Slide Carousel, 60s Reel Script, High-Density X Thread, LinkedIn Case Study)")
    angle_description: str = Field(description="The refreshed angle or framing applied")
    hook: str = Field(description="New scroll-stopping hook for this variation")
    content_body: str = Field(description="Refreshed narrative or structured outline")
    cta: str = Field(description="Conversion-focused closing CTA")

class ContentRecyclerLLMOutput(BaseModel):
    refreshed_angles_summary: str = Field(description="Summary of how the core ideas were modernized and repositioned")
    variations: List[RecycledVariation] = Field(description="Multiple refreshed content variations across different formats")
    recommended_variation_index: int = Field(default=0, description="Index of the highest impact refreshed asset")
    republishing_schedule_advice: str = Field(description="Strategic timing and cadence advice for republishing without fatigue")

class ContentRecyclerRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    past_content: str = Field(..., min_length=10, description="The original post, article, or script to refresh")
    original_platform: str = Field(default="LinkedIn", description="Where the original content was posted")
    target_platforms: List[str] = Field(default_factory=lambda: ["LinkedIn", "X", "Instagram"], description="Platforms for recycled assets")
    refresh_goal: str = Field(default="Modernize & Expand", description="Goal: Modernize & Expand, Condensed Bite-Sized, Contrarian Angle, Visual Breakdown")
    tone: str = Field(default="Authoritative", description="Tone (Authoritative, Engaging, Storytelling, Direct)")

class ContentRecyclerResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "content-recycler"
    refreshed_angles_summary: str
    variations: List[RecycledVariation]
    recommended_variation: RecycledVariation
    republishing_schedule_advice: str
    latency_ms: int
    created_at: str
