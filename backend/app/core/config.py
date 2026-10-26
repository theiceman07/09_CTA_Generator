import os
from typing import List, Optional
from dotenv import load_dotenv
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings

# Load .env variables into environment
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "OmniCreator AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    TESTING: bool = False
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # Database (PostgreSQL 16 default, supports asyncpg)
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/omnicreator",
        description="Async PostgreSQL connection URL"
    )
    SYNC_DATABASE_URL: Optional[str] = Field(
        default="postgresql://postgres:postgres@localhost:5432/omnicreator",
        description="Sync PostgreSQL connection URL for Alembic"
    )
    
    # Better Auth / Security
    BETTER_AUTH_SECRET: str = Field(
        default="omnicreator-saas-better-auth-secret-key-32chars",
        description="Shared secret for JWT verification with Better Auth"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Centralized Google Gemini AI Service (Hard Rule: Gemini ONLY)
    GEMINI_API_KEY: Optional[str] = Field(default=None, description="Google Gemini API Key")
    GEMINI_MODEL: str = Field(default="gemini-3.1-flash-lite", description="Standardized Gemini model across SaaS")
    
    # Backward compatibility aliases (Gemini is the only provider)
    AI_PROVIDER: str = "google"
    AI_MODEL: str = "gemini-3.1-flash-lite"
    AI_API_KEY: Optional[str] = None
    
    @model_validator(mode="after")
    def resolve_api_keys(self):
        if not self.GEMINI_API_KEY:
            self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("AI_API_KEY") or self.AI_API_KEY
        self.AI_API_KEY = self.GEMINI_API_KEY
        self.AI_MODEL = self.GEMINI_MODEL
        return self
    
    # LangSmith Observability
    LANGSMITH_TRACING: bool = False
    LANGSMITH_API_KEY: Optional[str] = None
    LANGSMITH_PROJECT: str = "omnicreator-saas"
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"
    
    # Redis / Async Workers
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Cloudflare R2 / S3
    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: str = "omnicreator-assets"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
