from app.ai.gemini.service import gemini_service
from app.modules.creator_research_assistant.schemas import (
    CreatorResearchRequest,
    CreatorResearchLLMOutput,
)
from app.modules.creator_research_assistant.prompts import (
    CREATOR_RESEARCH_SYSTEM_PROMPT,
    build_creator_research_prompt,
)
from app.core.logging import logger

class CreatorResearchChain:
    """
    LangChain execution chain for the Creator Research Assistant.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: CreatorResearchRequest) -> CreatorResearchLLMOutput:
        prompt = build_creator_research_prompt(
            topic=request.topic,
            research_depth=request.research_depth,
            target_audience=request.target_audience,
            creator_context=request.creator_context,
            provided_source_text=request.provided_source_text,
        )

        logger.info(f"Executing CreatorResearchChain for topic={request.topic}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=CreatorResearchLLMOutput,
            system_prompt=CREATOR_RESEARCH_SYSTEM_PROMPT,
            temperature=0.4
        )

        if resp.structured_data:
            return CreatorResearchLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Creator Research Assistant")

creator_research_chain = CreatorResearchChain()
