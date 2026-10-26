from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

HOOK_STYLES = [
    "Curiosity",
    "Question",
    "Contrarian",
    "Bold Claim",
    "Statistic/Data",
    "Story",
    "Problem/Pain Point",
    "Fear/Urgency",
    "Future/Possibility",
    "Surprise/Twist",
]

VALID_PLATFORMS = {"all", "instagram", "youtube", "linkedin", "x", "x/twitter", "tiktok"}
VALID_TONES = {"bold", "professional", "funny", "educational", "emotional", "engaging", "storytelling", "casual"}

class HookGeneratorRequest(BaseModel):
    """
    Standardized request schema for the Hook Generator application.
    Supports core topic, optional supporting source content, audience, platform, tone, and hook style.
    """
    topic: str = Field(min_length=1, max_length=1000, description="Topic, headline, thesis, or core project premise")
    source_content: Optional[str] = Field(default=None, max_length=5000, description="Optional supporting draft notes, script excerpt, or article context")
    audience: Optional[str] = Field(default="Target Audience", max_length=200, description="Target audience profile or niche demographic")
    platform: Optional[str] = Field(default="all", description="Target platform: all, instagram, youtube, linkedin, x, tiktok")
    tone: Optional[str] = Field(default="bold", description="Creator tone: bold, professional, funny, educational, emotional, engaging, storytelling, casual")
    hook_style: Optional[str] = Field(default="all", description="Specific style or 'all' to cover all 10 frameworks")
    number_of_hooks: Optional[int] = Field(default=10, ge=1, le=10, description="Number of hooks to generate (1-10)")
    project_id: Optional[str] = Field(default=None, description="Optional project ID for asset association and ownership verification")

    @field_validator("topic")
    @classmethod
    def validate_topic(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Topic cannot be empty or whitespace only.")
        return cleaned

    @field_validator("platform")
    @classmethod
    def validate_platform(cls, v: Optional[str]) -> str:
        if not v:
            return "all"
        cleaned = v.strip().lower()
        if cleaned not in VALID_PLATFORMS:
            raise ValueError(f"Invalid platform '{v}'. Supported: {', '.join(sorted(VALID_PLATFORMS))}")
        return cleaned

    @field_validator("tone")
    @classmethod
    def validate_tone(cls, v: Optional[str]) -> str:
        if not v:
            return "bold"
        cleaned = v.strip().lower()
        if cleaned not in VALID_TONES:
            raise ValueError(f"Invalid tone '{v}'. Supported: {', '.join(sorted(VALID_TONES))}")
        return cleaned


class HookOutput(BaseModel):
    """
    Structured Pydantic representation of an individual generated hook.
    """
    id: Optional[int] = Field(default=None, description="Sequential index (1-10)")
    style: str = Field(description="The psychological hook framework (e.g. Curiosity, Question, Contrarian, Bold Claim, etc.)")
    hook: str = Field(description="The exact scroll-stopping opening copy")
    platform: Optional[str] = Field(default="All Platforms", description="Targeted platform")
    rationale: Optional[str] = Field(default="", description="Strategic or psychological rationale for this hook angle")


class HookListOutput(BaseModel):
    """
    Container schema for structured LLM generation of hooks.
    """
    hooks: List[HookOutput] = Field(description="Array of structured hooks conforming to the 10 frameworks")
    topic: Optional[str] = Field(default="", description="The grounded topic")
    platform: Optional[str] = Field(default="All Platforms", description="Target platform")
    tone: Optional[str] = Field(default="Bold", description="Applied tone")


class HookGeneratorResponse(BaseModel):
    """
    Standardized API response for the Hook Generator application.
    """
    generation_id: Optional[str] = None
    project_id: Optional[str] = None
    hooks: List[HookOutput]
    topic: str
    platform: str
    tone: str
    usage: Dict[str, Optional[int]]
    metadata: Dict[str, Any]
