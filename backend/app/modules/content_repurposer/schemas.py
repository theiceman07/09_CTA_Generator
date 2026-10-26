from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from app.ai.schemas import YouTubeOutput

VALID_PLATFORMS = {"linkedin", "instagram", "x", "youtube"}
VALID_TONES = {"professional", "casual", "educational", "storytelling", "engaging"}

class ContentRepurposerRequest(BaseModel):
    project_id: str = Field(description="Target project ID")
    content: str = Field(min_length=1, description="Source content to repurpose")
    platforms: List[str] = Field(min_length=1, description="List of target platforms (linkedin, instagram, x, youtube)")
    tone: Optional[str] = Field(default="professional", description="Content tone")

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Content cannot be empty or whitespace only.")
        return cleaned

    @field_validator("platforms")
    @classmethod
    def validate_platforms(cls, v: List[str]) -> List[str]:
        cleaned = [p.strip().lower() for p in v if p.strip()]
        if not cleaned:
            raise ValueError("At least one platform must be selected.")
        invalid = [p for p in cleaned if p not in VALID_PLATFORMS]
        if invalid:
            raise ValueError(f"Invalid platform(s): {', '.join(invalid)}. Supported: {', '.join(VALID_PLATFORMS)}")
        return list(dict.fromkeys(cleaned))  # Deduplicate

    @field_validator("tone")
    @classmethod
    def validate_tone(cls, v: Optional[str]) -> str:
        if not v:
            return "professional"
        cleaned = v.strip().lower()
        if cleaned not in VALID_TONES:
            raise ValueError(f"Invalid tone '{v}'. Supported: {', '.join(VALID_TONES)}")
        return cleaned

class ContentRepurposerResponse(BaseModel):
    generation_id: str
    project_id: str
    results: Dict[str, Any]
    usage: Dict[str, Optional[int]]
    analysis: Optional[Dict[str, Any]] = None
