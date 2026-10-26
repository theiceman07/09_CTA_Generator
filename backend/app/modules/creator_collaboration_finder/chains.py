from app.ai.gemini.service import gemini_service
from app.modules.creator_collaboration_finder.schemas import (
    CollaborationFinderRequest,
    CollaborationFinderLLMOutput,
)
from app.modules.creator_collaboration_finder.prompts import (
    COLLABORATION_FINDER_SYSTEM_PROMPT,
    build_collaboration_finder_prompt,
)
from app.core.logging import logger

class CollaborationFinderChain:
    """
    Specialized LangChain chain for finding creator collaboration opportunities and outreach pitches.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: CollaborationFinderRequest) -> CollaborationFinderLLMOutput:
        prompt = build_collaboration_finder_prompt(
            creator_niche=request.creator_niche,
            primary_platform=request.primary_platform,
            audience_description=request.audience_description,
            collaboration_goal=request.collaboration_goal,
            preferred_format=request.preferred_format,
            creator_skills_and_strengths=request.creator_skills_and_strengths,
        )

        logger.info(f"Executing CollaborationFinderChain for niche={request.creator_niche}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=CollaborationFinderLLMOutput,
            system_prompt=COLLABORATION_FINDER_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return CollaborationFinderLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Creator Collaboration Finder")

collaboration_finder_chain = CollaborationFinderChain()
