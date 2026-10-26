from app.ai.gemini.service import gemini_service
from app.modules.brand_pitch_builder.schemas import (
    BrandPitchBuilderRequest,
    BrandPitchLLMOutput,
)
from app.modules.brand_pitch_builder.prompts import (
    BRAND_PITCH_SYSTEM_PROMPT,
    build_brand_pitch_prompt,
)
from app.core.logging import logger

class BrandPitchChain:
    """
    Specialized LangChain chain for constructing creator brand pitches and proposals.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: BrandPitchBuilderRequest) -> BrandPitchLLMOutput:
        prompt = build_brand_pitch_prompt(
            creator_name=request.creator_name,
            creator_niche=request.creator_niche,
            brand_name=request.brand_name,
            brand_product=request.brand_product,
            primary_platform=request.primary_platform,
            target_audience=request.target_audience,
            metrics_summary=request.metrics_summary,
            deliverables_requested=request.deliverables_requested,
            tone=request.tone,
            custom_notes=request.custom_notes,
        )

        logger.info(f"Executing BrandPitchChain for creator={request.creator_name} to brand={request.brand_name}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=BrandPitchLLMOutput,
            system_prompt=BRAND_PITCH_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return BrandPitchLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Brand Pitch Builder")

brand_pitch_chain = BrandPitchChain()
