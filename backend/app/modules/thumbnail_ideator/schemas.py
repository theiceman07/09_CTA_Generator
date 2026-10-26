from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ThumbnailConcept(BaseModel):
    title: str = Field(description="Concept name (e.g. Extreme Close-Up Curiosity, Before vs After Split, Shocking Stat Callout)")
    visual_focal_point: str = Field(description="The primary subject/element that catches the eye immediately")
    background_and_lighting: str = Field(description="Lighting style, background environment, and contrast palette")
    text_overlay: Optional[str] = Field(default=None, description="2-4 punchy words on thumbnail (NOT repeating the title)")
    creator_expression: Optional[str] = Field(default=None, description="Facial expression / pose if creator face is featured")
    color_palette: List[str] = Field(description="Dominant high-contrast colors (e.g. Neon Yellow, Deep Charcoal, Electric Blue)")
    ctr_psychology_rationale: str = Field(description="Why this visual stops users from scrolling")
    image_generation_prompt: str = Field(description="Detailed text prompt suitable for Midjourney / DALL-E / Imagen")

class ThumbnailIdeatorLLMOutput(BaseModel):
    concepts: List[ThumbnailConcept] = Field(description="3 distinct thumbnail visual concepts")
    recommended_concept_index: int = Field(default=0, description="Highest expected CTR visual concept")
    a_b_testing_hypothesis: str = Field(description="Specific split-test recommendation between concept A and concept B")
    title_thumbnail_synergy_tip: str = Field(description="Advice on how to pair the thumbnail text with the video title for maximum click-through")

class ThumbnailIdeatorRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    video_title_or_concept: str = Field(..., min_length=3, description="Video title, hook, or script concept")
    platform: str = Field(default="YouTube", description="Platform (YouTube, Instagram Reel, TikTok)")
    target_audience: Optional[str] = Field(default=None, description="Audience demographic or niche")
    include_creator_face: bool = Field(default=True, description="Whether the creator's face will be featured")
    style_preference: str = Field(default="High-Contrast & Clean", description="Style: High-Contrast & Clean, Cinematic & Moody, Bold Typography & Graphics, Minimalist")

class ThumbnailIdeatorResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "thumbnail-ideator"
    video_title_or_concept: str
    platform: str
    concepts: List[ThumbnailConcept]
    recommended_concept: ThumbnailConcept
    a_b_testing_hypothesis: str
    title_thumbnail_synergy_tip: str
    latency_ms: int
    created_at: str
