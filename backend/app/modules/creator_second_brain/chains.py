from typing import List, Dict, Any
from app.ai.gemini.service import gemini_service
from app.modules.creator_second_brain.schemas import (
    SecondBrainSynthesisLLMOutput,
)
from app.modules.creator_second_brain.prompts import (
    SECOND_BRAIN_SYSTEM_PROMPT,
    build_second_brain_synthesis_prompt,
)
from app.core.logging import logger

class SecondBrainSynthesisChain:
    """
    LangChain execution chain for associative synthesis over Creator Second Brain notes.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, query: str, retrieved_notes: List[Dict[str, Any]]) -> SecondBrainSynthesisLLMOutput:
        prompt = build_second_brain_synthesis_prompt(
            query=query,
            retrieved_notes=retrieved_notes
        )

        logger.info(f"Executing SecondBrainSynthesisChain for query='{query[:50]}' with {len(retrieved_notes)} notes")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=SecondBrainSynthesisLLMOutput,
            system_prompt=SECOND_BRAIN_SYSTEM_PROMPT,
            temperature=0.3
        )

        if resp.structured_data:
            return SecondBrainSynthesisLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Second Brain")

second_brain_synthesis_chain = SecondBrainSynthesisChain()
