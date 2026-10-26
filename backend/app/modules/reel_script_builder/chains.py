from typing import Dict, Any, Tuple
from langchain_core.prompts import ChatPromptTemplate
from app.ai.gemini.service import gemini_service, CentralGeminiService
from app.ai.schemas import ModelUsageMetadata
from app.modules.reel_script_builder.schemas import ReelScriptOutput
from app.modules.reel_script_builder.prompts import (
    SYSTEM_REEL_SCRIPT_PROMPT,
    build_reel_script_prompt,
)
from app.core.logging import logger

class ReelScriptGenerationChain:
    """
    Dedicated LangChain chain for Reel Script Generation.
    Integrates LangChain prompt templates, structured Pydantic output parsing,
    and execution through CentralGeminiService (gemini-3.1-flash-lite).
    Traced to LangSmith under project 'WHOLE SAAS PRODUCT_JAISHANTH'.
    """

    def __init__(self, service: CentralGeminiService = gemini_service):
        self.service = service

    def build_prompt_messages(self, inputs: Dict[str, Any]) -> Tuple[str, str]:
        """
        Constructs system and human prompts using LangChain ChatPromptTemplate.
        """
        topic = inputs.get("topic", "")
        hook = inputs.get("hook")
        audience = inputs.get("audience")
        platform = inputs.get("platform", "all")
        tone = inputs.get("tone", "engaging")
        duration = inputs.get("duration", "30-60")
        content_goal = inputs.get("content_goal", "educate")
        creator_context = inputs.get("creator_context")
        project_context = inputs.get("project_context")

        human_prompt_str = build_reel_script_prompt(
            topic=topic,
            hook=hook,
            audience=audience,
            platform=platform,
            tone=tone,
            duration=duration,
            content_goal=content_goal,
            creator_context=creator_context,
            project_context=project_context,
        )

        template = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"),
            ("human", "{human_prompt}"),
        ])

        formatted = template.format_prompt(
            system_prompt=SYSTEM_REEL_SCRIPT_PROMPT,
            human_prompt=human_prompt_str,
        )

        messages = formatted.to_messages()
        system_content = messages[0].content
        human_content = messages[1].content
        return system_content, human_content

    async def ainvoke(self, inputs: Dict[str, Any]) -> Tuple[ReelScriptOutput, ModelUsageMetadata]:
        """
        Invokes the LangChain structured generation pipeline through CentralGeminiService.
        Returns validated ReelScriptOutput and token usage metadata.
        """
        system_prompt, human_prompt = self.build_prompt_messages(inputs)

        # Delegate execution exclusively through CentralGeminiService
        response = await self.service.generate_structured(
            prompt=human_prompt,
            schema=ReelScriptOutput,
            system_prompt=system_prompt,
            temperature=0.7,
        )

        structured_data = response.structured_data or {}

        if isinstance(structured_data, ReelScriptOutput):
            validated_output = structured_data
        elif isinstance(structured_data, dict):
            validated_output = ReelScriptOutput(**structured_data)
        else:
            raise ValueError(f"Unexpected output type from Gemini service: {type(structured_data)}")

        return validated_output, response.usage
