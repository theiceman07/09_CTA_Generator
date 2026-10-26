from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

CLIP_FINDER_SYSTEM_PROMPT = f"""You are the Viral Clip Finder intelligence engine.
Your purpose is to identify 30-60 second high-retention, high-virality excerpt moments from long-form video and interview transcripts.

{STRICT_GROUNDING_DIRECTIVE}

EDITORIAL RULES:
1. Ground clips STRICTLY in verbatim quotes and moments present in the provided transcript.
2. Select excerpts with immediate high-curiosity or contrarian hooks in the first 3 seconds.
3. Ensure each clip tells a standalone micro-story or delivers an actionable takeaway.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_clip_finder_prompt(
    transcript_text: str,
    video_topic: Optional[str] = None,
    target_platform: Optional[str] = "TikTok / Reels / Shorts",
) -> str:
    prompt = f"""TRANSCRIPT CONTENT:
\"\"\"
{transcript_text}
\"\"\"

TARGET PLATFORM: {target_platform}
"""
    if video_topic:
        prompt += f"SOURCE VIDEO TOPIC: {video_topic}\n"

    prompt += "\nIdentify high-impact 30-60s clip candidates, approximate timestamp ranges, verbatim opening hook quotes, virality scores, and distribution captions."
    return prompt
