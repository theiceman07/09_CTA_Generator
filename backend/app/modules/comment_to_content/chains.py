from app.ai.gemini.service import gemini_service
from app.modules.comment_to_content.schemas import (
    CommentToContentRequest,
    CommentToContentLLMOutput,
)
from app.modules.comment_to_content.prompts import (
    COMMENT_TO_CONTENT_SYSTEM_PROMPT,
    build_comment_to_content_prompt,
)
from app.core.logging import logger

class CommentToContentChain:
    """
    Specialized LangChain chain for transforming comments into content.
    """
    def __init__(self):
        self.gemini = gemini_service

    async def execute(self, request: CommentToContentRequest) -> CommentToContentLLMOutput:
        prompt = build_comment_to_content_prompt(
            comment=request.comment,
            additional_comments=request.additional_comments,
            platform=request.platform,
            format_type=request.format_type,
            tone=request.tone,
            creator_context=request.creator_context,
        )

        logger.info(f"Executing CommentToContentChain for platform={request.platform}")

        resp = await self.gemini.generate_structured(
            prompt=prompt,
            schema=CommentToContentLLMOutput,
            system_prompt=COMMENT_TO_CONTENT_SYSTEM_PROMPT,
            temperature=0.7
        )

        if resp.structured_data:
            return CommentToContentLLMOutput(**resp.structured_data)

        raise RuntimeError("Failed to parse validated structured output for Comment to Content")

comment_to_content_chain = CommentToContentChain()
