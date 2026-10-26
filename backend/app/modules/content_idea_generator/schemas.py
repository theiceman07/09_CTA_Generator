from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator

VALID_TONES = {"engaging", "professional", "casual", "educational", "storytelling"}
VALID_PLATFORMS = {"all", "youtube", "linkedin", "x", "instagram", "tiktok"}

class ContentIdeaRequest(BaseModel):
    """
    Standardized request schema for the Content Idea Generator application.
    Supports core creator inputs and optional project context.
    """
    topic: str = Field(min_length=1, max_length=1000, description="Core topic, concept seed, or raw draft notes")
    niche: Optional[str] = Field(default="General Tech & Innovation", max_length=200, description="Creator niche or industry vertical")
    target_audience: Optional[str] = Field(default="Target Audience", max_length=200, description="Intended demographic or audience profile")
    content_goal: Optional[str] = Field(default="Engagement", max_length=100, description="Primary content objective: Engagement, Authority, Growth, Conversion, Education")
    platform: Optional[str] = Field(default="all", description="Target platform: all, youtube, linkedin, x, instagram, tiktok")
    tone: Optional[str] = Field(default="engaging", description="Creator tone: engaging, professional, casual, educational, storytelling")
    number_of_ideas: Optional[int] = Field(default=5, ge=1, le=10, description="Number of distinct ideas to generate (1-10)")
    project_id: Optional[str] = Field(default=None, description="Optional target project ID for asset association and ownership verification")

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
            return "engaging"
        cleaned = v.strip().lower()
        if cleaned not in VALID_TONES:
            raise ValueError(f"Invalid tone '{v}'. Supported: {', '.join(sorted(VALID_TONES))}")
        return cleaned


class IdeaOutput(BaseModel):
    """
    Structured Pydantic representation of an individual content idea.
    Conforms to the standardized creator workflow contract for downstream handoff.
    """
    title: str = Field(description="Catchy, high-engagement concept title or working headline")
    idea: str = Field(description="Core thesis, unique narrative angle, or concept premise")
    hook: str = Field(description="Scroll-stopping opening hook or high-retention first sentence")
    description: str = Field(description="Actionable overview of the execution plan and key takeaways")
    target_audience: str = Field(description="Specific audience segment this idea resonates with")
    platform: str = Field(description="Recommended platform for maximum impact (e.g. YouTube, LinkedIn, X, Instagram, TikTok)")
    rationale: str = Field(description="Psychological or algorithmic reason why this content idea performs")


class IdeaListOutput(BaseModel):
    """
    Container schema for structured LLM generation of multiple ideas.
    """
    ideas: List[IdeaOutput] = Field(description="List of distinct, grounded content ideas")
    summary: Optional[str] = Field(default="", description="Strategic overview of the ideation batch")


class ContentIdeaResponse(BaseModel):
    """
    API Response model conforming to SaaS platform standards.
    """
    generation_id: Optional[str] = None
    project_id: Optional[str] = None
    ideas: List[IdeaOutput]
    summary: Optional[str] = None
    usage: Dict[str, Optional[int]]
    metadata: Dict[str, Any]
