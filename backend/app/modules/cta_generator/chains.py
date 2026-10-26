from app.ai.gemini.service import gemini_service
from app.modules.cta_generator.schemas import (
    CTAGeneratorRequest,
    CTAGeneratorLLMOutput,
)
from app.modules.cta_generator.prompts import (
    CTA_GENERATOR_SYSTEM_PROMPT,
    build_cta_generator_prompt,
)
from app.core.logging import logger

class CTAGenerationChain:
    """
    Specialized LangChain chain for Call-To-Action (CTA) generation.
    Orchestrates prompt formatting, structured output parsing via Gemini,
    and grounding enforcement.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: CTAGeneratorRequest) -> CTAGeneratorLLMOutput:
        prompt = build_cta_generator_prompt(
            content=request.content,
            caption=request.caption,
            hook=request.hook,
            platform=request.platform,
            goal=request.goal,
            tone=request.tone,
            target_audience=request.target_audience,
            count=request.count,
            creator_context=request.creator_context,
        )

        logger.info(f"Executing CTAGenerationChain for platform={request.platform}, goal={request.goal}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=CTAGeneratorLLMOutput,
            system_prompt=CTA_GENERATOR_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return CTAGeneratorLLMOutput(**resp.structured_data)
        
        raise RuntimeError("Failed to parse validated structured output for CTA Generator")

cta_generation_chain = CTAGenerationChain()
