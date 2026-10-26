import os
from typing import Optional
from app.core.config import settings
from app.core.logging import logger

def configure_langsmith() -> bool:
    """
    Centralized LangSmith initialization for LangChain observability and evaluation.
    """
    if settings.LANGSMITH_TRACING and settings.LANGSMITH_API_KEY:
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_API_KEY"] = settings.LANGSMITH_API_KEY
        os.environ["LANGCHAIN_PROJECT"] = settings.LANGSMITH_PROJECT
        os.environ["LANGCHAIN_ENDPOINT"] = settings.LANGSMITH_ENDPOINT
        logger.info(f"LangSmith Tracing active for project: {settings.LANGSMITH_PROJECT}")
        return True
    else:
        os.environ["LANGCHAIN_TRACING_V2"] = "false"
        return False

# Initialize tracing on module import
is_tracing_active = configure_langsmith()
