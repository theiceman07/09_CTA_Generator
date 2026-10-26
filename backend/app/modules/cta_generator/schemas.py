from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CTAItem(BaseModel):
    text: str = Field(description="The call-to-action text phrase")
    placement: str = Field(description="Suggested placement (e.g. End of caption, Pinned comment, Video outro, Bio link)")
    category: str = Field(description="Goal category (e.g. Conversational, High-Intent Conversion, Resource Bookmark)")
    why_it_works: str = Field(description="Psychological rationale explaining the conversion trigger")
    character_count: int = Field(default=0, description="Length of the CTA in characters")

class CTAGeneratorLLMOutput(BaseModel):
    ctas: List[CTAItem] = Field(description="Generated calls to action")
    recommended_cta_index: int = Field(default=0, description="Zero-based index of the highest-converting CTA")
    recommended_reason: str = Field(description="Why this specific CTA best fits the audience and platform")
    placement_strategy: str = Field(description="Strategic advice on how and where to position the CTA for maximum reach")

class CTAGeneratorRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    content: str = Field(..., min_length=3, description="Core topic, post description, or context")
    caption: Optional[str] = Field(default=None, description="Optional full caption to pair the CTA with")
    hook: Optional[str] = Field(default=None, description="Optional opening hook for stylistic consistency")
    platform: str = Field(default="Instagram", description="Target platform (Instagram, LinkedIn, X, YouTube, TikTok, Newsletter)")
    goal: str = Field(default="Engagement & Comments", description="CTA objective (Engagement & Comments, Saves & Bookmarks, Profile Follow, Link Click, Direct Message, Newsletter Signup)")
    tone: str = Field(default="Engaging", description="Desired tone (Engaging, Direct, Professional, Urgent, Casual, Provocative)")
    target_audience: Optional[str] = Field(default=None, description="Target creator audience")
    count: int = Field(default=3, ge=1, le=10, description="Number of CTA variations to generate")
    creator_context: Optional[str] = Field(default=None, description="Creator niche or brand context")

class CTAGeneratorResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "cta-generator"
    platform: str
    goal: str
    tone: str
    ctas: List[CTAItem]
    recommended_cta: str
    recommended_reason: str
    placement_strategy: str
    latency_ms: int
    created_at: str
