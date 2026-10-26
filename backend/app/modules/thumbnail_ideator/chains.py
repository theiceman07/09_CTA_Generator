from app.ai.gemini.service import gemini_service
from app.modules.thumbnail_ideator.schemas import (
    ThumbnailIdeatorRequest,
    ThumbnailIdeatorLLMOutput,
)
from app.modules.thumbnail_ideator.prompts import (
    THUMBNAIL_IDEATOR_SYSTEM_PROMPT,
    build_thumbnail_ideator_prompt,
)
from app.core.logging import logger

class ThumbnailIdeatorChain:
    """
    Specialized LangChain chain for visual thumbnail concept ideation.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: ThumbnailIdeatorRequest) -> ThumbnailIdeatorLLMOutput:
        prompt = build_thumbnail_ideator_prompt(
            video_title_or_concept=request.video_title_or_concept,
            platform=request.platform,
            target_audience=request.target_audience,
            include_creator_face=request.include_creator_face,
            style_preference=request.style_preference,
        )

        logger.info(f"Executing ThumbnailIdeatorChain for platform={request.platform}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=ThumbnailIdeatorLLMOutput,
            system_prompt=THUMBNAIL_IDEATOR_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return ThumbnailIdeatorLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Thumbnail Ideator")

thumbnail_ideator_chain = ThumbnailIdeatorChain()
