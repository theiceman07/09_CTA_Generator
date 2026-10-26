from typing import Dict, Any, Tuple
from langchain_core.prompts import ChatPromptTemplate
from app.ai.gemini.service import gemini_service, CentralGeminiService
from app.ai.schemas import ModelUsageMetadata
from app.modules.hook_generator.schemas import HookListOutput
from app.modules.hook_generator.prompts import (
    SYSTEM_HOOK_GENERATION_PROMPT,
    build_hook_generation_prompt,
)
from app.core.logging import logger

class HookGenerationChain:
    """
    Dedicated LangChain chain for Hook Generation.
    Integrates LangChain prompt templates, structured Pydantic output parsing,
    and invocation through CentralGeminiService (gemini-3.1-flash-lite).
    Traced to LangSmith under project 'WHOLE SAAS PRODUCT_JAISHANTH'.
    """

    def __init__(self, service: CentralGeminiService = gemini_service):
        self.service = service

    def build_prompt_messages(self, inputs: Dict[str, Any]) -> Tuple[str, str]:
        """
        Constructs system and user prompts using LangChain ChatPromptTemplate.
        """
        topic = inputs.get("topic", "")
        source_content = inputs.get("source_content", "")
        audience = inputs.get("audience", "Target Audience")
        platform = inputs.get("platform", "all")
        tone = inputs.get("tone", "bold")
        hook_style = inputs.get("hook_style", "all")
        number_of_hooks = int(inputs.get("number_of_hooks", 10))
        project_context = inputs.get("project_context", "")

        human_prompt_str = build_hook_generation_prompt(
            topic=topic,
            source_content=source_content,
            audience=audience,
            platform=platform,
            tone=tone,
            hook_style=hook_style,
            number_of_hooks=number_of_hooks,
            project_context=project_context,
        )

        template = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"),
            ("human", "{human_prompt}"),
        ])

        formatted = template.format_prompt(
            system_prompt=SYSTEM_HOOK_GENERATION_PROMPT,
            human_prompt=human_prompt_str,
        )

        messages = formatted.to_messages()
        system_content = messages[0].content
        human_content = messages[1].content
        return system_content, human_content

    async def ainvoke(self, inputs: Dict[str, Any]) -> Tuple[HookListOutput, ModelUsageMetadata]:
        """
        Invokes the LangChain structured generation pipeline through CentralGeminiService.
        Returns validated HookListOutput and token usage metadata.
        """
        system_prompt, human_prompt = self.build_prompt_messages(inputs)

        # Delegate execution exclusively through CentralGeminiService
        response = await self.service.generate_structured(
            prompt=human_prompt,
            schema=HookListOutput,
            system_prompt=system_prompt,
            temperature=0.7,
        )

        structured_data = response.structured_data or {}

        if isinstance(structured_data, HookListOutput):
            validated_output = structured_data
        elif isinstance(structured_data, dict):
            validated_output = HookListOutput(**structured_data)
        else:
            raise ValueError(f"Unexpected output type from Gemini service: {type(structured_data)}")

        return validated_output, response.usage
