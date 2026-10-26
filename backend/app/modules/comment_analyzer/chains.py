from app.ai.gemini.service import gemini_service
from app.modules.comment_analyzer.schemas import (
    CommentAnalyzerRequest,
    CommentAnalysisLLMOutput,
)
from app.modules.comment_analyzer.prompts import (
    COMMENT_ANALYZER_SYSTEM_PROMPT,
    build_comment_analyzer_prompt,
)
from app.core.logging import logger

class CommentAnalysisChain:
    """
    Specialized LangChain chain for analyzing audience comments.
    Orchestrates prompt formatting, structured sentiment & theme extraction via Gemini.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: CommentAnalyzerRequest) -> CommentAnalysisLLMOutput:
        prompt = build_comment_analyzer_prompt(
            comments=request.comments,
            platform=request.platform,
            content_context=request.content_context,
            focus_area=request.focus_area,
        )

        logger.info(f"Executing CommentAnalysisChain for {len(request.comments)} comments on {request.platform}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=CommentAnalysisLLMOutput,
            system_prompt=COMMENT_ANALYZER_SYSTEM_PROMPT,
            temperature=0.3
        )

        if resp.structured_data:
            return CommentAnalysisLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Comment Analyzer")

comment_analysis_chain = CommentAnalysisChain()
