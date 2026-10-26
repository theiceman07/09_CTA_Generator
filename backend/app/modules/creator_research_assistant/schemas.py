from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CompetitorAngle(BaseModel):
    angle_title: str = Field(description="Competitor angle or common content trope")
    critique_or_gap: str = Field(description="What existing creators miss or where the opportunity lies")
    recommended_differentiation: str = Field(description="How to position your take to stand out uniquely")

class ResearchSection(BaseModel):
    heading: str = Field(description="Section heading or thematic pillar")
    key_findings: List[str] = Field(description="Core synthesized technical or domain insights")
    content_implications: str = Field(description="How creators can translate these findings into viral or educational content")

class CreatorResearchLLMOutput(BaseModel):
    executive_brief: str = Field(description="High-level synthesis of topic research")
    technical_pillars: List[ResearchSection] = Field(description="In-depth domain breakdown sections")
    competitor_landscape: List[CompetitorAngle] = Field(description="Market angle analysis and white space opportunities")
    content_angle_recommendations: List[str] = Field(description="Specific actionable video/post angles derived from research")
    cautions_and_misconceptions: List[str] = Field(description="Common myths or pitfalls to avoid")

class CreatorResearchRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    topic: str = Field(..., min_length=3, description="Topic, technology, niche, or competitor to research")
    research_depth: str = Field(default="Comprehensive Deep-Dive", description="Depth: Comprehensive Deep-Dive, Rapid Overview, Competitor Whitespace, Technical Teardown")
    target_audience: Optional[str] = Field(default=None, description="Intended audience demographic")
    creator_context: Optional[str] = Field(default=None, description="Creator perspective or channel style")
    provided_source_text: Optional[str] = Field(default=None, description="Optional raw reference papers, docs, or notes to synthesize")

class CreatorResearchResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "creator-research-assistant"
    topic: str
    research_depth: str
    executive_brief: str
    technical_pillars: List[ResearchSection]
    competitor_landscape: List[CompetitorAngle]
    content_angle_recommendations: List[str]
    cautions_and_misconceptions: List[str]
    latency_ms: int
    created_at: str
