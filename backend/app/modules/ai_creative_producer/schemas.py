from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class VisualStyleGuide(BaseModel):
    color_grading: str = Field(description="Color palette, LUT styling, and temperature guidance")
    camera_movement: str = Field(description="Dynamic tracking, handheld, macro slider, or static framing")
    audio_design: str = Field(description="Foley, sound effects, background audio, and vocal EQ recommendations")

class ProductionShot(BaseModel):
    shot_number: int = Field(description="Sequence index")
    shot_type: str = Field(description="e.g. Extreme Close-Up, Overhead Desk Master, Wide Establishing")
    description: str = Field(description="Subject action, framing, and visual storytelling purpose")
    equipment_recommendation: str = Field(description="Lens, lighting, or mount recommendations")

class CreativeProducerLLMOutput(BaseModel):
    production_package_title: str = Field(description="Executive production title")
    creative_vision: str = Field(description="Core aesthetic manifesto and creative direction")
    visual_style_guide: VisualStyleGuide = Field(description="Style guide specification")
    shot_list: List[ProductionShot] = Field(description="Comprehensive shot list breakdown")
    distribution_strategy: str = Field(description="Multi-platform release sequencing and asset rollout advice")

class CreativeProducerRequest(BaseModel):
    project_id: str = Field(..., description="Project ID")
    creative_concept: str = Field(..., min_length=5, description="High-level video concept, series idea, or script outline")
    aesthetic_vibe: Optional[str] = Field(default="Cinematic Industrial Documentary", description="Visual aesthetic vibe")
    primary_deliverable: Optional[str] = Field(default="Hero YouTube Video + Vertical Reels", description="Main video deliverables")

class CreativeProducerResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "ai-creative-producer"
    production_package_title: str
    creative_vision: str
    visual_style_guide: VisualStyleGuide
    shot_list: List[ProductionShot]
    distribution_strategy: str
    latency_ms: int
    created_at: str
