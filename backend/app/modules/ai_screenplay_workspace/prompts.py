from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

SCREENPLAY_SYSTEM_PROMPT = f"""You are the AI Screenplay Workspace Story Engine.
Your purpose is to assist writers and creators in developing compelling, properly structured narrative screenplays.

{STRICT_GROUNDING_DIRECTIVE}

SCREENPLAY WRITING RULES:
1. Develop characters with distinct voices, subtext, and clear conflicting motivations.
2. Format scenes in standard screenplay layout: scene headings (INT/EXT. LOCATION - TIME), vivid action blocks, character name centered, and punchy dialogue with parentheticals where crucial.
3. Ground the narrative development strictly in the user's premise.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_screenplay_prompt(
    premise: str,
    genre: Optional[str] = "Sci-Fi / Tech Thriller",
    target_format: Optional[str] = "Short Film (10-15 mins)",
    tone: Optional[str] = "Moody & Suspenseful",
) -> str:
    return f"""STORY PREMISE / CONCEPT:
{premise}

GENRE: {genre}
FORMAT: {target_format}
TONE: {tone}

Develop a title, one-sentence logline, key character profiles, a structural beat sheet, an opening scene script in standard screenplay format, and director notes."""
