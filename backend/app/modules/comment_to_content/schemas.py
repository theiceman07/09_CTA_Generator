from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FollowupContentIdea(BaseModel):
    title: str = Field(description="Catchy title or concept headline")
    angle: str = Field(description="Strategic content angle (e.g. Mythbusting, Step-by-Step Tutorial, Behind-the-Scenes Clarification)")
    format: str = Field(description="Best format (e.g. 60s Reel, 7-slide Carousel, Detailed LinkedIn Post, X Thread)")
    hook: str = Field(description="Attention-grabbing opening hook responding directly to the comment")
    key_talking_points: List[str] = Field(description="Core points or script breakdown addressing the comment")
    caption_draft: str = Field(description="Draft caption with hashtag suggestions")
    call_to_action: str = Field(description="Suggested closing CTA to re-engage the community")
    why_it_converts: str = Field(description="Explanation of why this follow-up will resonate with the audience")

class CommentToContentLLMOutput(BaseModel):
    ideas: List[FollowupContentIdea] = Field(description="List of structured follow-up content concepts")
    recommended_idea_index: int = Field(default=0, description="Index of the highest potential follow-up post")
    strategic_summary: str = Field(description="High-level takeaway on how this comment opens a broader conversation")

class CommentToContentRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    comment: str = Field(..., min_length=3, description="The specific audience comment or question to repurpose")
    additional_comments: Optional[List[str]] = Field(default=None, description="Optional supporting comments or context")
    platform: str = Field(default="Instagram", description="Target platform (Instagram, TikTok, YouTube, LinkedIn, X)")
    format_type: str = Field(default="Short-form Video", description="Format preference (Short-form Video, Carousel, Text Post, Detailed Guide)")
    tone: str = Field(default="Educational", description="Tone (Educational, Conversational, Direct, Inspiring, Witty)")
    creator_context: Optional[str] = Field(default=None, description="Creator niche or background information")

class CommentToContentResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "comment-to-content"
    source_comment: str
    platform: str
    ideas: List[FollowupContentIdea]
    recommended_idea: FollowupContentIdea
    strategic_summary: str
    latency_ms: int
    created_at: str
