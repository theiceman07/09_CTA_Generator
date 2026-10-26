from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class BaseGeneratedContent(BaseModel):
    """Standardized output structure for single-asset generation."""
    title: Optional[str] = Field(default=None, description="Generated title or headline")
    content: str = Field(description="Main body text of the generated content")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Platform or tool metadata")

class BaseAIToolRequest(BaseModel):
    """Standardized base request schema for all creator tools."""
    project_id: str = Field(description="Target project ID")
    tone: Optional[str] = Field(default="professional", description="Desired content tone")

class BaseAIToolResponse(BaseModel):
    """Standardized base response schema for all creator tools."""
    generation_id: str
    project_id: str
    tool_id: str
    results: Dict[str, Any]
    usage: Dict[str, Optional[int]]
