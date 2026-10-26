from typing import List, Optional
from pydantic import BaseModel, Field

class PodcastSegment(BaseModel):
    timestamp_range: str = Field(description="Estimated timing, e.g. 00:00 - 05:00")
    segment_title: str = Field(description="Segment or chapter title")
    summary_and_questions: str = Field(description="Core talking points and host discussion questions")

class PodcastPlanningLLMOutput(BaseModel):
    episode_title_options: List[str] = Field(description="High-converting episode titles")
    recommended_title_index: int = Field(default=0, description="Index of recommended title")
    episode_description: str = Field(description="Platform episode description summary for Spotify / Apple")
    host_guest_talking_points: List[str] = Field(description="Primary thematic beats and questions")
    timed_segments: List[PodcastSegment] = Field(description="Chronological segment breakdown")
    show_notes_markdown: str = Field(description="Formatted markdown show notes with links and highlights")
    social_promotional_snippets: List[str] = Field(description="Promotional snippets for X, LinkedIn, and Instagram")

class PodcastPlanningRequest(BaseModel):
    project_id: str = Field(..., description="Project ID")
    episode_concept: str = Field(..., min_length=5, description="Episode theme, topic, or raw interview transcript")
    target_duration_minutes: Optional[int] = Field(default=45, description="Intended episode length in minutes")
    guest_name_or_archetype: Optional[str] = Field(default=None, description="Optional guest details")
    tone: Optional[str] = Field(default="In-depth & Conversational", description="Episode tone")
    creator_notes: Optional[str] = Field(default=None, description="Specific questions or sponsors to highlight")

class PodcastPlanningResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "podcast-assistant"
    episode_title_options: List[str]
    recommended_title: str
    episode_description: str
    host_guest_talking_points: List[str]
    timed_segments: List[PodcastSegment]
    show_notes_markdown: str
    social_promotional_snippets: List[str]
    latency_ms: int
    created_at: str
