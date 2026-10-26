from typing import Dict, Any, Tuple
from langchain_core.prompts import ChatPromptTemplate
from app.ai.gemini.service import gemini_service, CentralGeminiService
from app.ai.schemas import ModelUsageMetadata
from app.modules.caption_assistant.schemas import CaptionOutput
from app.modules.caption_assistant.prompts import (
    SYSTEM_CAPTION_PROMPT,
    build_caption_prompt,
)
from app.core.logging import logger


class CaptionGenerationChain:
    """
    Dedicated LangChain chain for Caption Assistant.
    Integrates LangChain ChatPromptTemplate, structured Pydantic output parsing,
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
        platform = inputs.get("platform", "Instagram")
        tone = inputs.get("tone", "Engaging")
        target_audience = inputs.get("target_audience", "General Audience")
        content_goal = inputs.get("content_goal", "Engagement")
        caption_length = inputs.get("caption_length", "Medium")
        hook = inputs.get("hook")
        cta = inputs.get("cta")
        include_hashtags = inputs.get("include_hashtags", True)
        hashtag_count = inputs.get("hashtag_count", 5)
        include_emojis = inputs.get("include_emojis", True)
        include_seo_keywords = inputs.get("include_seo_keywords", True)
        format_type = inputs.get("format_type", "Photo post")
        creator_context = inputs.get("creator_context")
        project_context = inputs.get("project_context")

        human_prompt_str = build_caption_prompt(
            topic=topic,
            platform=platform,
            tone=tone,
            target_audience=target_audience,
            content_goal=content_goal,
            caption_length=caption_length,
            hook=hook,
            cta=cta,
            include_hashtags=include_hashtags,
            hashtag_count=hashtag_count,
            include_emojis=include_emojis,
            include_seo_keywords=include_seo_keywords,
            format_type=format_type,
            creator_context=creator_context,
            project_context=project_context,
        )

        template = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"),
            ("human", "{human_prompt}"),
        ])

        formatted = template.format_prompt(
            system_prompt=SYSTEM_CAPTION_PROMPT,
            human_prompt=human_prompt_str,
        )

        messages = formatted.to_messages()
        system_content = messages[0].content
        human_content = messages[1].content
        return system_content, human_content

    async def ainvoke(self, inputs: Dict[str, Any]) -> Tuple[CaptionOutput, ModelUsageMetadata]:
        """
        Invokes the LangChain structured generation pipeline through CentralGeminiService.
        Returns validated CaptionOutput and token usage metadata.
        """
        system_prompt, human_prompt = self.build_prompt_messages(inputs)

        # Delegate execution exclusively through CentralGeminiService
        response = await self.service.generate_structured(
            prompt=human_prompt,
            schema=CaptionOutput,
            system_prompt=system_prompt,
            temperature=0.7,
        )

        structured_data = response.structured_data or {}

        if isinstance(structured_data, CaptionOutput):
            validated_output = structured_data
        elif isinstance(structured_data, dict):
            validated_output = CaptionOutput(**structured_data)
        else:
            raise ValueError(f"Unexpected output type from Gemini service: {type(structured_data)}")

        # Ensure character_count is accurately computed if omitted or 0
        if not validated_output.character_count and validated_output.caption:
            validated_output.character_count = len(validated_output.caption)

        return validated_output, response.usage
