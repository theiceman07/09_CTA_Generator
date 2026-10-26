from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, model_validator

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    name: Optional[str] = None

    @model_validator(mode="after")
    def resolve_name(self):
        if not self.full_name and self.name:
            self.full_name = self.name
        elif not self.full_name:
            self.full_name = "Creator"
        return self

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = "Creator"
    name: Optional[str] = None
    subscription_tier: str = "free"
    created_at: Optional[datetime] = None
    
    @model_validator(mode="after")
    def populate_name(self):
        if not self.name:
            self.name = self.full_name or "Creator"
        return self

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserResponse
    token: str
    access_token: str
    token_type: str = "bearer"

    @model_validator(mode="before")
    @classmethod
    def populate_tokens(cls, data: Any):
        if isinstance(data, dict):
            tok = data.get("access_token") or data.get("token")
            if tok:
                data["token"] = tok
                data["access_token"] = tok
        return data
