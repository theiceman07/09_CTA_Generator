from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel

class UsageRecordResponse(BaseModel):
    id: str
    project_id: str
    generation_id: str
    tool: str
    provider: str
    model: str
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UsageSummaryResponse(BaseModel):
    total_generations: int
    total_input_tokens: int
    total_output_tokens: int
    total_tokens: int
    tool_breakdown: Dict[str, int]
    recent_records: List[UsageRecordResponse]
