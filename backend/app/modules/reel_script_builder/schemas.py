from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

class ReelScene(BaseModel):
    """
    Represents an individual chronological scene or segment within a short-form reel.
    """
    scene_number: int = Field(..., description="Chronological sequence number of the scene (1-indexed)")
    timestamp: str = Field(..., description="Timestamp interval, e.g., '0:00 - 0:05' or '0:05 - 0:25'")
    dialogue: str = Field(..., description="Spoken voiceover, narration, or on-camera dialogue")
    visual_direction: str = Field(..., description="Camera framing, subject action, B-roll, or graphics instructions")
    on_screen_text: Optional[str] = Field(None, description="Punchy text overlay or caption highlights to be rendered on screen")

class ReelScriptOutput(BaseModel):
    """
    Structured short-form video script model adhering to the 05_Reel_Script_Builder standard.
    Preserves opening hook (0-5s), main body value (5-50s), and closing CTA (50-60s),
    paired with granular scene-by-scene production direction.
    """
    title: str = Field(..., description="Catchy title or concept headline for the reel")
    hook: str = Field(..., description="The opening 3-5 seconds attention grabber (0 - 5 s)")
    body: str = Field(..., description="The main content value breakdown (5 - 50 s)")
    cta: str = Field(..., description="Closing call to action (50 - 60 s)")
    duration: str = Field("30-60s", description="Estimated target duration of the video, e.g. '30-60s'")
    scenes: List[ReelScene] = Field(
        default_factory=list,
        description="Chronological scene-by-scene production breakdown including timing, dialogue, and visuals"
    )
    caption_suggestion: Optional[str] = Field(
        None,
        description="Suggested social media caption paired with relevant topic hashtags"
    )
    estimated_word_count: Optional[int] = Field(
        None,
        description="Total spoken word count across the script to verify spoken pacing"
    )
    thoughts: Optional[List[str]] = Field(
        default_factory=list,
        description="Agentic planning thoughts and pacing decisions preserved from the original Reel Script Builder"
    )

class ReelScriptGeneratorRequest(BaseModel):
    """
    API payload for reel script generation.
    Supports cross-application handoff from Content Idea Generator and Hook Generator.
    """
    topic: str = Field(..., min_length=3, max_length=500, description="Core topic or concept premise for the reel")
    hook: Optional[str] = Field(None, max_length=500, description="Optional pre-existing hook (e.g. from Hook Generator) to preserve")
    audience: Optional[str] = Field(None, max_length=200, description="Target viewer demographic or niche community")
    platform: str = Field("all", description="Target platform: 'all', 'instagram', 'youtube_shorts', 'tiktok'")
    tone: str = Field("engaging", description="Tone profile: 'engaging', 'educational', 'storytelling', 'funny', 'controversial', 'bold'")
    duration: str = Field("30-60", description="Target duration in seconds: '15-30', '30-60', '60-90', '30', '60'")
    content_goal: Optional[str] = Field("educate", description="Primary goal: 'educate', 'entertain', 'inspire', 'promote', 'convert'")
    creator_context: Optional[str] = Field(None, max_length=500, description="Optional creator style or channel niche context")
    project_id: Optional[str] = Field(None, description="Optional UUID of the project for asset persistence")

    @field_validator("topic")
    @classmethod
    def validate_topic_non_empty(cls, v: str) -> str:
        if not v or not v.strip() or len(v.strip()) < 3:
            raise ValueError("Topic must contain at least 3 non-whitespace characters")
        return v.strip()

class ReelScriptGeneratorResponse(BaseModel):
    """
    Standardized API response for Reel Script Builder.
    """
    generation_id: str
    project_id: Optional[str] = None
    topic: str
    platform: str
    tone: str
    duration: str
    script: ReelScriptOutput
    usage: Dict[str, Any]
    metadata: Dict[str, Any]
