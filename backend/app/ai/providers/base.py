from abc import ABC, abstractmethod
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel
from app.ai.schemas import ModelResponse

class BaseAIProvider(ABC):
    def __init__(self, model_name: str, api_key: Optional[str] = None):
        self.model_name = model_name
        self.api_key = api_key

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> ModelResponse:
        """Generates standard text completion."""
        pass

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: Optional[str] = None
    ) -> ModelResponse:
        """Generates structured output validated against a Pydantic schema."""
        pass
