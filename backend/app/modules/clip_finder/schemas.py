from typing import List, Optional
from pydantic import BaseModel, Field

class ViralClip(BaseModel):
    start_timestamp: str = Field(description="Start time marker, e.g. 02:15")
    end_timestamp: str = Field(description="End time marker, e.g. 03:05")
    duration_seconds: int = Field(description="Clip length in seconds (30-60s ideal)")
    viral_potential_score: int = Field(ge=0, le=100, description="Predicted virality & retention score (0-100)")
    suggested_title: str = Field(description="Punchy title for short-form video")
    hook_quote: str = Field(description="First 3-second verbatim quote that stops the scroll")
    reasoning: str = Field(description="Why this excerpt triggers retention and engagement")
    recommended_aspect_ratio: str = Field(default="9:16", description="Suggested framing: 9:16 vertical or 1:1 square")
    suggested_caption: str = Field(description="Optimized caption with hashtags")

class ClipFinderLLMOutput(BaseModel):
    analysis_summary: str = Field(description="Overall audit of long-form transcript moments")
    clips: List[ViralClip] = Field(description="Extracted viral clips")
    recommended_clip_index: int = Field(default=0, description="Top recommended clip index")

class ClipFinderRequest(BaseModel):
    project_id: str = Field(..., description="Project ID")
    transcript_text: str = Field(..., min_length=30, description="Video, interview, or webinar transcript text with or without timestamps")
    video_topic: Optional[str] = Field(default=None, description="Core topic or title of the original video")
    target_platform: Optional[str] = Field(default="TikTok / Reels / Shorts", description="Target distribution channel")

class ClipFinderResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "clip-finder"
    analysis_summary: str
    clips: List[ViralClip]
    recommended_clip: ViralClip
    latency_ms: int
    created_at: str
