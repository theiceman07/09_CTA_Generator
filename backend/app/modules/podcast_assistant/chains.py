from app.ai.gemini.service import gemini_service
from app.modules.podcast_assistant.schemas import (
    PodcastPlanningRequest,
    PodcastPlanningLLMOutput,
)
from app.modules.podcast_assistant.prompts import (
    PODCAST_ASSISTANT_SYSTEM_PROMPT,
    build_podcast_planning_prompt,
)
from app.core.logging import logger

class PodcastPlanningChain:
    """
    LangChain execution chain for comprehensive podcast episode architecture.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: PodcastPlanningRequest) -> PodcastPlanningLLMOutput:
        prompt = build_podcast_planning_prompt(
            episode_concept=request.episode_concept,
            target_duration_minutes=request.target_duration_minutes,
            guest_name_or_archetype=request.guest_name_or_archetype,
            tone=request.tone,
            creator_notes=request.creator_notes,
        )

        logger.info(f"Executing PodcastPlanningChain for concept='{request.episode_concept[:50]}'")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=PodcastPlanningLLMOutput,
            system_prompt=PODCAST_ASSISTANT_SYSTEM_PROMPT,
            temperature=0.6
        )

        if resp.structured_data:
            return PodcastPlanningLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Podcast Assistant")

podcast_planning_chain = PodcastPlanningChain()
