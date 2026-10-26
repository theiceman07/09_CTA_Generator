from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SecondBrainItemCreate(BaseModel):
    project_id: str = Field(..., description="Project ID to scope this knowledge item")
    title: str = Field(..., min_length=2, max_length=200, description="Title of the knowledge snippet")
    content: str = Field(..., min_length=5, description="Core note, framework, idea, transcript excerpt, or reference")
    category: str = Field(default="framework", description="Category: framework, story, idea, research, quote, statistic")
    tags: List[str] = Field(default_factory=list, description="Searchable tags")
    source_ref: Optional[str] = Field(default=None, description="Optional original URL or book/video reference")

class SecondBrainItemResponse(BaseModel):
    id: str
    project_id: str
    title: str
    content: str
    category: str
    tags: List[str]
    source_ref: Optional[str] = None
    created_at: str

class SecondBrainQueryRequest(BaseModel):
    project_id: str = Field(..., description="Project ID to query")
    query: str = Field(..., min_length=3, description="Search query or synthesis prompt to answer from second brain memory")
    category_filter: Optional[str] = Field(default=None, description="Optional category filter")

class SecondBrainSynthesisLLMOutput(BaseModel):
    direct_answer: str = Field(description="Synthesized direct answer grounded strictly in saved knowledge")
    connected_themes: List[str] = Field(description="Key recurring themes connected across memories")
    suggested_content_hooks: List[str] = Field(description="Content angles and hooks inspired by this retrieved knowledge")
    referenced_item_titles: List[str] = Field(description="Titles of items directly referenced in this synthesis")

class SecondBrainQueryResponse(BaseModel):
    generation_id: str
    project_id: str
    query: str
    direct_answer: str
    connected_themes: List[str]
    suggested_content_hooks: List[str]
    referenced_item_titles: List[str]
    matched_items: List[SecondBrainItemResponse]
    latency_ms: int
    created_at: str
