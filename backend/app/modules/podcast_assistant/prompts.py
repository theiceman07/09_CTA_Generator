from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

PODCAST_ASSISTANT_SYSTEM_PROMPT = f"""You are the Podcast Production Assistant.
Your purpose is to produce complete episode architecture: viral episode titles, engaging descriptions, chronological segments, host-guest talking questions, markdown show notes, and promotional teasers.

{STRICT_GROUNDING_DIRECTIVE}

PRODUCTION RULES:
1. Ground the planning strictly in the provided episode concept, notes, and guest background.
2. Structure segments logically across the intended runtime.
3. Formulate thought-provoking questions that extract specific technical or storytelling gold.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_podcast_planning_prompt(
    episode_concept: str,
    target_duration_minutes: Optional[int] = 45,
    guest_name_or_archetype: Optional[str] = None,
    tone: Optional[str] = "In-depth & Conversational",
    creator_notes: Optional[str] = None,
) -> str:
    prompt = f"""EPISODE THEME / CONCEPT:
{episode_concept}

TARGET DURATION: ~{target_duration_minutes} minutes
DESIRED TONE: {tone}
"""
    if guest_name_or_archetype:
        prompt += f"GUEST / CO-HOST INFO: {guest_name_or_archetype}\n"
    if creator_notes:
        prompt += f"CREATOR NOTES / KEY POINTS: {creator_notes}\n"

    prompt += "\nGenerate episode titles, structured description, host questions, timed segments, full markdown show notes, and promotional snippets."
    return prompt
