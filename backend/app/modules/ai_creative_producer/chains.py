from app.ai.gemini.service import gemini_service
from app.modules.ai_creative_producer.schemas import (
    CreativeProducerRequest,
    CreativeProducerLLMOutput,
)
from app.modules.ai_creative_producer.prompts import (
    CREATIVE_PRODUCER_SYSTEM_PROMPT,
    build_creative_producer_prompt,
)
from app.core.logging import logger

class CreativeProducerChain:
    """
    LangChain execution chain for high-end creative direction, shot list design, and visual aesthetics.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: CreativeProducerRequest) -> CreativeProducerLLMOutput:
        prompt = build_creative_producer_prompt(
            creative_concept=request.creative_concept,
            aesthetic_vibe=request.aesthetic_vibe,
            primary_deliverable=request.primary_deliverable,
        )

        logger.info(f"Executing CreativeProducerChain for concept='{request.creative_concept[:40]}'")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=CreativeProducerLLMOutput,
            system_prompt=CREATIVE_PRODUCER_SYSTEM_PROMPT,
            temperature=0.6
        )

        if resp.structured_data:
            return CreativeProducerLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Creative Producer")

creative_producer_chain = CreativeProducerChain()
