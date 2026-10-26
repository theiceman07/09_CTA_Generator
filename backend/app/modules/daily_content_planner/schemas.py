from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PlannedSlot(BaseModel):
    day: str = Field(description="Day of schedule (e.g. Day 1 / Monday)")
    time_window: str = Field(description="Optimal posting window (e.g. 8:00 AM - 10:00 AM, 12:30 PM, 6:00 PM)")
    platform: str = Field(description="Target platform (e.g. LinkedIn, Instagram, X, YouTube)")
    content_pillar: str = Field(description="Pillar category (e.g. Deep-Dive Educational, Behind The Scenes, Contrarian Debate, Community Engagement)")
    post_title_concept: str = Field(description="Specific post concept grounded in user topics")
    format: str = Field(description="Format (e.g. Carousel, Short Reel, Text + Image, Thread)")
    primary_objective: str = Field(description="Objective (e.g. Reach, Saves, Inbound DMs, Comments)")

class DailyPlannerLLMOutput(BaseModel):
    strategic_overview: str = Field(description="Overview of the content distribution cadence and balance")
    schedule: List[PlannedSlot] = Field(description="Scheduled slots across the planning horizon")
    production_milestones: List[str] = Field(description="Batch production steps for the creator (e.g. Scripting Day, Batch Recording, Scheduling)")
    consistency_tip: str = Field(description="High-leverage habit or scheduling rule to prevent creator burnout")

class DailyContentPlannerRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    core_topics: str = Field(..., min_length=3, description="Core themes or projects to plan around")
    platforms: List[str] = Field(default_factory=lambda: ["LinkedIn", "Instagram", "X"], description="Active platforms")
    days_count: int = Field(default=7, ge=1, le=14, description="Number of days to plan (typically 7 or 14)")
    posts_per_day: int = Field(default=1, ge=1, le=4, description="Desired publishing velocity per day")
    creator_context: Optional[str] = Field(default=None, description="Creator schedule constraints or niche")

class DailyContentPlannerResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "daily-content-planner"
    days_count: int
    platforms: List[str]
    strategic_overview: str
    schedule: List[PlannedSlot]
    production_milestones: List[str]
    consistency_tip: str
    latency_ms: int
    created_at: str
