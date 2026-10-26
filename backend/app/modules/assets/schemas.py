from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel

class AssetResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    type: str
    title: str
    content: str
    storage_ref: Optional[str] = None
    meta_info: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
