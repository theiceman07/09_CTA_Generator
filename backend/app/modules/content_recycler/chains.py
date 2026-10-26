from app.ai.gemini.service import gemini_service
from app.modules.content_recycler.schemas import (
    ContentRecyclerRequest,
    ContentRecyclerLLMOutput,
)
from app.modules.content_recycler.prompts import (
    CONTENT_RECYCLER_SYSTEM_PROMPT,
    build_content_recycler_prompt,
)
from app.core.logging import logger

class ContentRecyclerChain:
    """
    Specialized LangChain chain for recycling past successful content assets.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: ContentRecyclerRequest) -> ContentRecyclerLLMOutput:
        prompt = build_content_recycler_prompt(
            past_content=request.past_content,
            original_platform=request.original_platform,
            target_platforms=request.target_platforms,
            refresh_goal=request.refresh_goal,
            tone=request.tone,
        )

        logger.info(f"Executing ContentRecyclerChain for original_platform={request.original_platform}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=ContentRecyclerLLMOutput,
            system_prompt=CONTENT_RECYCLER_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return ContentRecyclerLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Content Recycler")

content_recycler_chain = ContentRecyclerChain()
