from app.ai.gemini.service import gemini_service
from app.modules.clip_finder.schemas import (
    ClipFinderRequest,
    ClipFinderLLMOutput,
)
from app.modules.clip_finder.prompts import (
    CLIP_FINDER_SYSTEM_PROMPT,
    build_clip_finder_prompt,
)
from app.core.logging import logger

class ClipFinderChain:
    """
    LangChain execution chain for identifying high-retention vertical clips from long transcripts.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: ClipFinderRequest) -> ClipFinderLLMOutput:
        prompt = build_clip_finder_prompt(
            transcript_text=request.transcript_text,
            video_topic=request.video_topic,
            target_platform=request.target_platform,
        )

        logger.info(f"Executing ClipFinderChain on transcript length={len(request.transcript_text)}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=ClipFinderLLMOutput,
            system_prompt=CLIP_FINDER_SYSTEM_PROMPT,
            temperature=0.5
        )

        if resp.structured_data:
            return ClipFinderLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Clip Finder")

clip_finder_chain = ClipFinderChain()
