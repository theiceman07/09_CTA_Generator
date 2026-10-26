from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel

class AIGenerationResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    tool: str
    provider: str
    model: str
    input_data: Dict[str, Any]
    output_data: Dict[str, Any]
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    latency_ms: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
