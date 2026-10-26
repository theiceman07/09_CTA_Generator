from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

CREATIVE_PRODUCER_SYSTEM_PROMPT = f"""You are the AI Creative Producer.
Your purpose is to direct high-end video creative direction, cinematic visual styling, shot list planning, and cross-platform asset production.

{STRICT_GROUNDING_DIRECTIVE}

PRODUCTION RULES:
1. Provide actionable, practical shot-list breakdowns with clear lens and lighting recommendations.
2. Formulate distinct visual style guides (color LUTs, camera kinematics, and audio Foley).
3. Ground all creative directions in the user's concept and deliverables.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_creative_producer_prompt(
    creative_concept: str,
    aesthetic_vibe: Optional[str] = "Cinematic Industrial Documentary",
    primary_deliverable: Optional[str] = "Hero YouTube Video + Vertical Reels",
) -> str:
    return f"""CONCEPT / SCRIPT OUTLINE:
{creative_concept}

AESTHETIC VIBE: {aesthetic_vibe}
DELIVERABLES: {primary_deliverable}

Develop an executive production title, a creative vision statement, a detailed visual style guide, a numbered shot list with equipment recommendations, and a multi-platform release strategy."""
