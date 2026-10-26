from typing import Dict, Any, Tuple
from langchain_core.prompts import ChatPromptTemplate
from app.ai.gemini.service import gemini_service, CentralGeminiService
from app.ai.schemas import ModelUsageMetadata
from app.modules.content_idea_generator.schemas import IdeaListOutput
from app.modules.content_idea_generator.prompts import (
    SYSTEM_IDEA_GENERATION_PROMPT,
    build_idea_generation_prompt,
)
from app.core.logging import logger

class IdeaGenerationChain:
    """
    Dedicated LangChain chain for Content Idea Generation.
    Integrates prompt construction, structured output parsing,
    and routing through CentralGeminiService (gemini-3.1-flash-lite).
    Traced to LangSmith under project 'WHOLE SAAS PRODUCT_JAISHANTH'.
    """

    def __init__(self, service: CentralGeminiService = gemini_service):
        self.service = service

    def build_prompt_messages(self, inputs: Dict[str, Any]) -> Tuple[str, str]:
        """
        Constructs system and user prompts using LangChain ChatPromptTemplate.
        """
        topic = inputs.get("topic", "")
        niche = inputs.get("niche", "General Tech & Innovation")
        target_audience = inputs.get("target_audience", "Target Audience")
        content_goal = inputs.get("content_goal", "Engagement")
        platform = inputs.get("platform", "all")
        tone = inputs.get("tone", "engaging")
        number_of_ideas = int(inputs.get("number_of_ideas", 5))
        project_context = inputs.get("project_context", "")

        human_prompt_str = build_idea_generation_prompt(
            topic=topic,
            niche=niche,
            target_audience=target_audience,
            content_goal=content_goal,
            platform=platform,
            tone=tone,
            number_of_ideas=number_of_ideas,
            project_context=project_context,
        )

        template = ChatPromptTemplate.from_messages([
            ("system", "{system_prompt}"),
            ("human", "{human_prompt}")
        ])

        formatted = template.format_prompt(
            system_prompt=SYSTEM_IDEA_GENERATION_PROMPT,
            human_prompt=human_prompt_str
        )
        
        messages = formatted.to_messages()
        system_content = messages[0].content
        human_content = messages[1].content
        return system_content, human_content

    async def ainvoke(self, inputs: Dict[str, Any]) -> Tuple[IdeaListOutput, ModelUsageMetadata]:
        """
        Invokes the LangChain structured generation pipeline through CentralGeminiService.
        Returns validated IdeaListOutput and token usage metadata.
        """
        system_prompt, human_prompt = self.build_prompt_messages(inputs)

        # Delegate execution exclusively through CentralGeminiService
        response = await self.service.generate_structured(
            prompt=human_prompt,
            schema=IdeaListOutput,
            system_prompt=system_prompt,
            temperature=0.7,
        )

        structured_data = response.structured_data or {}

        if isinstance(structured_data, IdeaListOutput):
            validated_output = structured_data
        elif isinstance(structured_data, dict):
            validated_output = IdeaListOutput(**structured_data)
        else:
            raise ValueError(f"Unexpected output type from Gemini service: {type(structured_data)}")

        return validated_output, response.usage
