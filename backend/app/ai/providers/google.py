import time
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from app.ai.providers.base import BaseAIProvider
from app.ai.schemas import ModelResponse, ModelUsageMetadata
from app.core.logging import logger

def extract_text_content(content: Any) -> str:
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

class GoogleGenAIProvider(BaseAIProvider):
    def __init__(self, model_name: str, api_key: Optional[str] = None):
        super().__init__(model_name=model_name, api_key=api_key)
        if not self.api_key:
            raise ValueError("Google Gemini API key is missing. Set AI_API_KEY or GEMINI_API_KEY in .env.")
            
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            google_api_key=self.api_key,
            max_retries=3,
            temperature=0.7
        )

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> ModelResponse:
        start_time = time.time()
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        try:
            response = await self.llm.ainvoke(messages)
            latency = int((time.time() - start_time) * 1000)
            
            # Extract token usage if available from response_metadata
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
                provider="google",
                model=self.model_name
            )
        except Exception as e:
            err_msg = str(e)
            if self.api_key and self.api_key in err_msg:
                err_msg = err_msg.replace(self.api_key, "[REDACTED]")
            logger.error(f"Google AI Provider error: {err_msg}")
            raise RuntimeError(f"AI Provider error: {err_msg}")

    async def generate_structured(
        self,
        prompt: str,
        schema: Type[BaseModel],
        system_prompt: Optional[str] = None
    ) -> ModelResponse:
        start_time = time.time()
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        try:
            structured_llm = self.llm.with_structured_output(schema)
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
                provider="google",
                model=self.model_name
            )
        except Exception as e:
            err_msg = str(e)
            if self.api_key and self.api_key in err_msg:
                err_msg = err_msg.replace(self.api_key, "[REDACTED]")
            logger.error(f"Google AI Structured Provider error: {err_msg}")
            raise RuntimeError(f"AI Provider error: {err_msg}")
