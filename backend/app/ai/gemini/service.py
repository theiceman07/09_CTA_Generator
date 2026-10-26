import time
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel
from langchain_core.messages import SystemMessage, HumanMessage

from app.core.config import settings
from app.core.logging import logger
from app.ai.gemini.config import gemini_config
from app.ai.gemini.client import get_gemini_client
from app.ai.schemas import ModelResponse, ModelUsageMetadata
from app.ai.providers.mock import MockAIProvider

def extract_text_content(content: Any) -> str:
    """Extract plain text from string or multi-part content blocks."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, str):
                parts.append(item)
            elif isinstance(item, dict) and "text" in item:
                parts.append(item["text"])
            elif hasattr(item, "text"):
                parts.append(str(item.text))
        return "\n".join(parts) if parts else str(content)
    return str(content)

class CentralGeminiService:
    """
    Centralized Google Gemini AI Service for the entire Creator AI SaaS.
    Standardized on gemini-3.1-flash-lite and LangChain.
    """
    def __init__(self):
        self.config = gemini_config

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None
    ) -> ModelResponse:
        """
        Executes a prompt through the centralized Gemini service.
        """
        if settings.TESTING:
            mock = MockAIProvider(model_name=self.config.model_name)
            return await mock.generate(prompt=prompt, system_prompt=system_prompt)

        api_key = settings.GEMINI_API_KEY or self.config.api_key
        if not api_key:
            raise RuntimeError("Google Gemini API key is missing. Set GEMINI_API_KEY in backend/.env.")

        start_time = time.time()
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        try:
            client = get_gemini_client(temperature=temperature)
            response = await client.ainvoke(messages)
            latency = int((time.time() - start_time) * 1000)

            usage_metadata = response.response_metadata.get("usage_metadata") or {}
            input_tokens = usage_metadata.get("prompt_token_count")
            output_tokens = usage_metadata.get("candidates_token_count")
            total_tokens = usage_metadata.get("total_token_count")

            clean_text = extract_text_content(response.content)

            return ModelResponse(
                raw_content=clean_text,
                structured_data=None,
                usage=ModelUsageMetadata(
                    input_tokens=input_tokens,
                    output_tokens=output_tokens,
                    total_tokens=total_tokens,
                    latency_ms=latency
                ),
                provider="gemini",
                model=self.config.model_name
            )
        except Exception as e:
            err_msg = str(e)
            if self.config.api_key and self.config.api_key in err_msg:
                err_msg = err_msg.replace(self.config.api_key, "[REDACTED]")
            logger.error(f"Centralized Gemini service error: {err_msg}")
            raise RuntimeError(f"Gemini Service error: {err_msg}")

    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None
    ) -> ModelResponse:
        """
        Executes a prompt and parses validated structured output conforming to a Pydantic schema.
        """
        if settings.TESTING:
            mock = MockAIProvider(model_name=self.config.model_name)
            return await mock.generate_structured(prompt=prompt, schema=schema, system_prompt=system_prompt)

        api_key = settings.GEMINI_API_KEY or self.config.api_key
        if not api_key:
            raise RuntimeError("Google Gemini API key is missing. Set GEMINI_API_KEY in backend/.env.")

        start_time = time.time()
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        try:
            client = get_gemini_client(temperature=temperature)
            structured_llm = client.with_structured_output(schema)
            parsed_data = await structured_llm.ainvoke(messages)
            latency = int((time.time() - start_time) * 1000)

            result_dict = parsed_data.model_dump() if hasattr(parsed_data, "model_dump") else dict(parsed_data)

            return ModelResponse(
                raw_content=str(parsed_data),
                structured_data=result_dict,
                usage=ModelUsageMetadata(
                    input_tokens=None,
                    output_tokens=None,
                    total_tokens=None,
                    latency_ms=latency
                ),
                provider="gemini",
                model=self.config.model_name
            )
        except Exception as e:
            err_msg = str(e)
            if self.config.api_key and self.config.api_key in err_msg:
                err_msg = err_msg.replace(self.config.api_key, "[REDACTED]")
            logger.error(f"Centralized Gemini structured service error: {err_msg}")
            raise RuntimeError(f"Gemini Structured Service error: {err_msg}")

# Central singleton instance
gemini_service = CentralGeminiService()
