from typing import List, Optional
from pydantic import BaseModel, Field
from app.modules.ai_content_director.schemas import DirectedPackage, ContentDirectorResponse

class GuruvelahDirectorRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    topic: str = Field(..., min_length=3, description="Topic, thesis, or engineering principle")
    philosophical_angle: Optional[str] = Field(default="First-Principles Technical Clarity", description="Core philosophy: First-Principles Technical Clarity, Anti-Hype Pragmatism, Systems Thinking")
    target_platform: Optional[str] = Field(default="LinkedIn / Substack", description="Target distribution platform")
    target_audience: Optional[str] = Field(default=None, description="Audience demographic")

class GuruvelahDirectorResponse(ContentDirectorResponse):
    guruvelah_principles: List[str] = Field(default_factory=list, description="Philosophical rules applied to this campaign")
