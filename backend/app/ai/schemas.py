from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ContentAnalysis(BaseModel):
    topic: str = Field(description="Primary topic or subject matter")
    target_audience: str = Field(description="Target audience or niche for this content")
    content_type: str = Field(description="Type of content: Insight, Tutorial, Opinion, Story, Announcement")
    key_points: List[str] = Field(description="Key takeaways or arguments from the text")
    core_message: str = Field(description="One-sentence core thesis statement")

class YouTubeOutput(BaseModel):
    title: str = Field(description="Catchy, high-CTR YouTube video title")
    description: str = Field(description="Structured video description with summary and call to action")
    tags: List[str] = Field(description="List of relevant discovery tags/keywords")
    outline: str = Field(description="Step-by-step video outline or storyboard beats")

class RepurposedOutput(BaseModel):
    linkedin: Optional[str] = Field(default=None, description="Formatted LinkedIn thought leadership post")
    instagram: Optional[str] = Field(default=None, description="Instagram carousel slide-by-slide copy and caption")
    x: Optional[str] = Field(default=None, description="Engaging multi-tweet X thread")
    youtube: Optional[YouTubeOutput] = Field(default=None, description="Structured YouTube package")

class ModelUsageMetadata(BaseModel):
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    latency_ms: Optional[int] = None

class ModelResponse(BaseModel):
    raw_content: str
    structured_data: Optional[Dict[str, Any]] = None
    usage: ModelUsageMetadata
    provider: str
    model: str
