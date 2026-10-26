from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CollaborationArchetype(BaseModel):
    partner_niche: str = Field(description="Ideal partner creator niche (e.g. 3D Printing & CAD Design, Embedded Firmware, Environmental Science)")
    audience_synergy_reason: str = Field(description="Why this creator's audience overlaps cleanly with yours without direct competition")
    suggested_format: str = Field(description="Collaborative format (e.g. Guest Challenge, Co-hosted Stream, Cross-post Tutorial, Debate)")
    win_win_value_proposition: str = Field(description="What both creators gain from this specific collaboration")

class CollaborationPitchIdea(BaseModel):
    title: str = Field(description="Collaborative project / video title")
    pitch_angle: str = Field(description="The hook or angle pitched to the potential partner creator")
    outreach_dm_template: str = Field(description="Short, high-response DM or email template ready to send to a creator")

class CollaborationFinderLLMOutput(BaseModel):
    creator_positioning_analysis: str = Field(description="Summary of your unique creator strengths and value proposition to partners")
    ideal_partner_criteria: List[str] = Field(description="Checklist of attributes to look for in ideal collaborative partners")
    partner_archetypes: List[CollaborationArchetype] = Field(description="Specific complementary creator niches to target")
    collaboration_ideas: List[CollaborationPitchIdea] = Field(description="Ready-to-propose collaborative content concepts and outreach templates")
    outreach_strategy_tips: List[str] = Field(description="Best practices for warming up the relationship before reaching out")

class CollaborationFinderRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    creator_niche: str = Field(..., min_length=2, description="Your primary content niche")
    primary_platform: str = Field(default="YouTube", description="Your main platform")
    audience_description: Optional[str] = Field(default=None, description="Description of your current audience demographics and interests")
    collaboration_goal: str = Field(default="Audience Growth", description="Goal: Audience Growth, Skill Exchange, Co-hosting a Series, Product Launch")
    preferred_format: Optional[str] = Field(default="Cross-over Video", description="Preferred collaboration format")
    creator_skills_and_strengths: Optional[str] = Field(default=None, description="Your unique technical or creative superpowers")

class CollaborationFinderResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "collaboration-finder"
    creator_niche: str
    primary_platform: str
    creator_positioning_analysis: str
    ideal_partner_criteria: List[str]
    partner_archetypes: List[CollaborationArchetype]
    collaboration_ideas: List[CollaborationPitchIdea]
    outreach_strategy_tips: List[str]
    latency_ms: int
    created_at: str
