from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator


class CaptionVariant(BaseModel):
    """
    Individual creative caption take with distinct angle, hook, and reach reasoning.
    Preserves the multi-take architecture from the original 08_Caption_Assistant.
    """
    label: str = Field(..., description="Variant name/angle, e.g. 'Story-Led', 'Direct & Punchy', 'Educational Breakdown'")
    hook: str = Field(..., description="First line hook (under 125 characters)")
    body: str = Field(..., description="Main narrative or informational body of the caption")
    cta: str = Field(..., description="Closing call to action tailored to the content goal")
    hashtags: List[str] = Field(default_factory=list, description="Curated hashtags without '#' prefix")
    keywords: List[str] = Field(default_factory=list, description="SEO keywords included in the caption")
    reach_score: int = Field(85, description="Estimated reach potential index (0-100) based on algorithm hooks and save triggers")
    why: str = Field(..., description="Copywriting rationale for why this angle works")
    extra: Optional[str] = Field(None, description="Platform-specific tip (e.g. Reel audio idea, Carousel slide headline)")


class CaptionOutput(BaseModel):
    """
    Structured Pydantic output schema for Caption Assistant.
    Provides a primary publishable caption plus multiple creative takes.
    """
    caption: str = Field(..., description="Complete, formatted primary publishable caption with hook, body, CTA, and hashtags")
    hook: str = Field(..., description="Opening hook line under 125 characters")
    body: str = Field(..., description="Main caption text body")
    call_to_action: str = Field(..., description="Clear call to action aligned with content goal")
    hashtags: List[str] = Field(default_factory=list, description="List of relevant hashtags without '#' prefix")
    platform: str = Field("Instagram", description="Target social platform")
    tone: str = Field("Engaging", description="Tone profile applied to the caption")
    content_goal: str = Field("Engagement", description="Primary goal (e.g. Saves, Shares, Comments, Reach, Follows)")
    caption_length: str = Field("Medium", description="Length category (Short, Medium, Long)")
    character_count: int = Field(..., description="Character count of the primary caption")
    variants: List[CaptionVariant] = Field(
        default_factory=list,
        description="List of 3-4 distinct caption takes differing in angle and tone"
    )
    recommended_variant_index: int = Field(0, description="0-based index of the recommended variant")
    recommend_reason: str = Field(..., description="One-sentence explanation of why the chosen variant is recommended")
    planning_trace: Optional[str] = Field(
        None,
        description="Agent planning reflections explaining SEO positioning and retention decisions"
    )


class CaptionGeneratorRequest(BaseModel):
    """
    API payload for caption generation.
    Supports cross-application handoff from Content Idea Generator, Hook Generator, and Reel Script Builder.
    """
    topic: str = Field(..., min_length=3, max_length=1000, description="Core topic, post description, or project summary")
    platform: str = Field("Instagram", description="Target platform: 'Instagram', 'LinkedIn', 'X', 'TikTok', 'YouTube'")
    tone: str = Field("Engaging", description="Tone: 'Engaging', 'Professional', 'Educational', 'Storytelling', 'Witty', 'Bold', 'Casual'")
    target_audience: Optional[str] = Field("General Audience", max_length=200, description="Target demographic or niche community")
    content_goal: Optional[str] = Field("Engagement", description="Goal: 'Engagement', 'Saves', 'Shares', 'Comments', 'Reach', 'Follows'")
    caption_length: str = Field("Medium", description="Length: 'Short', 'Medium', 'Long'")
    hook: Optional[str] = Field(None, max_length=300, description="Optional pre-existing hook (e.g. from Hook Generator) to preserve")
    cta: Optional[str] = Field(None, max_length=300, description="Optional custom call to action to enforce")
    include_hashtags: bool = Field(True, description="Whether to generate relevant hashtags")
    hashtag_count: int = Field(5, ge=0, le=15, description="Target number of hashtags to generate")
    include_emojis: bool = Field(True, description="Whether to use emojis tastefully")
    include_seo_keywords: bool = Field(True, description="Whether to weave SEO keywords into the first sentence")
    format_type: Optional[str] = Field("Photo post", description="Post format: 'Photo post', 'Reel', 'Carousel', 'Story', 'Text post'")
    creator_context: Optional[str] = Field(None, max_length=500, description="Creator style or channel niche context")
    project_id: Optional[str] = Field(None, description="Optional UUID of the project for asset persistence")

    @field_validator("topic")
    @classmethod
    def validate_topic_non_empty(cls, v: str) -> str:
        if not v or not v.strip() or len(v.strip()) < 3:
            raise ValueError("Topic must contain at least 3 non-whitespace characters")
        return v.strip()


class CaptionGeneratorResponse(BaseModel):
    """
    Standardized API response for Caption Assistant.
    """
    generation_id: str
    project_id: Optional[str] = None
    topic: str
    platform: str
    tone: str
    caption_length: str
    caption: CaptionOutput
    usage: Dict[str, Any]
    metadata: Dict[str, Any]
