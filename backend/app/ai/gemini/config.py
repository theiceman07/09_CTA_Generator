from typing import Optional
from pydantic import BaseModel, Field
from app.core.config import settings

class GeminiConfig(BaseModel):
    """
    Centralized configuration for Google Gemini AI Service.
    Standardized on gemini-3.1-flash-lite across the SaaS.
    """
    model_name: str = Field(default_factory=lambda: settings.GEMINI_MODEL)
    api_key: Optional[str] = Field(default_factory=lambda: settings.GEMINI_API_KEY)
    temperature: float = 0.7
    max_retries: int = 3
    timeout: float = 60.0

    def validate_credentials(self) -> None:
        if not settings.TESTING and not self.api_key:
            raise RuntimeError(
                "Google Gemini API key is missing. Set GEMINI_API_KEY in backend/.env."
            )

gemini_config = GeminiConfig()
