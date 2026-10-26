from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings
from app.ai.gemini.config import gemini_config
from app.core.logging import logger

_chat_model_instance: Optional[ChatGoogleGenerativeAI] = None

def get_gemini_client(temperature: Optional[float] = None) -> ChatGoogleGenerativeAI:
    """
    Returns the centralized LangChain ChatGoogleGenerativeAI client.
    Enforces singleton usage and standardized gemini-3.1-flash-lite model configuration.
    """
    global _chat_model_instance
    gemini_config.validate_credentials()
    
    temp = temperature if temperature is not None else gemini_config.temperature
    
    if _chat_model_instance is None or temperature is not None:
        client = ChatGoogleGenerativeAI(
            model=gemini_config.model_name,
            google_api_key=gemini_config.api_key,
            temperature=temp,
            max_retries=gemini_config.max_retries,
            timeout=gemini_config.timeout
        )
        if temperature is None:
            _chat_model_instance = client
        return client
        
    return _chat_model_instance
