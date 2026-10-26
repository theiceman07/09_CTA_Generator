import os
from typing import Type, Optional, Dict, Any
from pydantic import BaseModel

from app.core.config import settings
from app.core.logging import logger
from app.ai.schemas import ModelResponse
from app.ai.providers.base import BaseAIProvider
from app.ai.providers.google import GoogleGenAIProvider
from app.ai.providers.mock import MockAIProvider
from app.ai.gemini.service import gemini_service, CentralGeminiService
from app.ai.shared.tracing import configure_langsmith

class AIModelGateway:
    """
    Standardized AI Gateway delegating directly to the centralized Google Gemini Service.
    Standardized on gemini-3.1-flash-lite and LangChain across the SaaS.
    """
    def __init__(self):
        configure_langsmith()
        self.gemini = gemini_service

    def get_provider(self, provider_override: Optional[str] = None, model_override: Optional[str] = None) -> BaseAIProvider:
        model_name = model_override or settings.GEMINI_MODEL
        
        # If in automated testing mode, allow MockAIProvider for deterministic unit tests
        if settings.TESTING:
            return MockAIProvider(model_name=model_name)
            
        if not settings.GEMINI_API_KEY:
            raise RuntimeError(
                "Google Gemini API key is missing. Set GEMINI_API_KEY in backend/.env."
            )
            
        return GoogleGenAIProvider(model_name=model_name, api_key=settings.GEMINI_API_KEY)

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        provider: Optional[str] = None,
        model: Optional[str] = None
    ) -> ModelResponse:
        return await self.gemini.generate(prompt=prompt, system_prompt=system_prompt)

    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: Optional[str] = None,
        provider: Optional[str] = None,
        model: Optional[str] = None
    ) -> ModelResponse:
        return await self.gemini.generate_structured(prompt=prompt, schema=schema, system_prompt=system_prompt)

model_gateway = AIModelGateway()

