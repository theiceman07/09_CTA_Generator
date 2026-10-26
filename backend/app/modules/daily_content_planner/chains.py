from app.ai.gemini.service import gemini_service
from app.modules.daily_content_planner.schemas import (
    DailyContentPlannerRequest,
    DailyPlannerLLMOutput,
)
from app.modules.daily_content_planner.prompts import (
    DAILY_PLANNER_SYSTEM_PROMPT,
    build_daily_planner_prompt,
)
from app.core.logging import logger

class DailyPlannerChain:
    """
    Specialized LangChain chain for multi-day creator content planning.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: DailyContentPlannerRequest) -> DailyPlannerLLMOutput:
        prompt = build_daily_planner_prompt(
            core_topics=request.core_topics,
            platforms=request.platforms,
            days_count=request.days_count,
            posts_per_day=request.posts_per_day,
            creator_context=request.creator_context,
        )

        logger.info(f"Executing DailyPlannerChain for {request.days_count} days")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=DailyPlannerLLMOutput,
            system_prompt=DAILY_PLANNER_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return DailyPlannerLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Daily Content Planner")

daily_planner_chain = DailyPlannerChain()
