from app.ai.gemini.service import gemini_service
from app.modules.ai_screenplay_workspace.schemas import (
    ScreenplayWorkspaceRequest,
    ScreenplayLLMOutput,
)
from app.modules.ai_screenplay_workspace.prompts import (
    SCREENPLAY_SYSTEM_PROMPT,
    build_screenplay_prompt,
)
from app.core.logging import logger

class ScreenplayGenerationChain:
    """
    LangChain execution chain for narrative screenplay ideation and scene drafting.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: ScreenplayWorkspaceRequest) -> ScreenplayLLMOutput:
        prompt = build_screenplay_prompt(
            premise=request.premise,
            genre=request.genre,
            target_format=request.target_format,
            tone=request.tone,
        )

        logger.info(f"Executing ScreenplayGenerationChain for premise='{request.premise[:40]}'")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=ScreenplayLLMOutput,
            system_prompt=SCREENPLAY_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return ScreenplayLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Screenplay Workspace")

screenplay_generation_chain = ScreenplayGenerationChain()
