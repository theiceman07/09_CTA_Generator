# Google Gemini Integration Guide

## Standard Configuration
- **Model**: `gemini-3.1-flash-lite`
- **SDK**: `langchain-google-genai` wrapping `google-genai`
- **Environment**:
  ```env
  GEMINI_API_KEY=your_key_here
  GEMINI_MODEL=gemini-3.1-flash-lite
  ```

## Service Architecture (`backend/app/ai/gemini/`)
1. **`config.py`**:
   Validates presence of `GEMINI_API_KEY`, defines default temperature, timeout, and max retry parameters.
2. **`client.py`**:
   Provides `get_gemini_client()` singleton creating `ChatGoogleGenerativeAI`.
3. **`service.py`**:
   Exposes `gemini_service.generate()` and `gemini_service.generate_structured()`.
   Normalizes multi-part responses, extracts usage metadata (prompt tokens, candidate tokens, latency), and catches/redacts API keys from error messages.

## Best Practices
- **Content Blocks Handling**: Gemini API responses often arrive as lists of content dictionaries. `extract_text_content()` normalizes them to plain string text safely.
- **Quota & Demands**: `gemini-3.1-flash-lite` offers reliable throughput without the 503 high-demand spike errors observed in preview models.
- **No Client Exposure**: Never expose `GEMINI_API_KEY` to the Next.js frontend or browser.
