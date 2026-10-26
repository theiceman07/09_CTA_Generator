from typing import Optional
from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

CREATOR_RESEARCH_SYSTEM_PROMPT = f"""You are the Creator Research Assistant, an elite competitive intelligence and content researcher for creators.
Your mission is to perform structured research, competitive whitespace analysis, audience sentiment mapping, and deep thematic breakdown.

{STRICT_GROUNDING_DIRECTIVE}

CRITICAL RULES:
1. Ground your analysis strictly in the provided topic, notes, and creator context.
2. Clearly distinguish between verified facts/provided sources and conceptual strategic frameworks.
3. Highlight tangible content angles, competitor blindspots, and myths to debunk.
4. Output must strictly conform to the expected schema without meta-commentary or chain-of-thought leaks.
"""

def build_creator_research_prompt(
    topic: str,
    research_depth: str,
    target_audience: Optional[str] = None,
    creator_context: Optional[str] = None,
    provided_source_text: Optional[str] = None,
) -> str:
    prompt = f"""Conduct a {research_depth} research breakdown on the following topic/niche:

TOPIC / NICHE:
{topic}
"""
    if target_audience:
        prompt += f"\nTARGET AUDIENCE:\n{target_audience}"
    if creator_context:
        prompt += f"\nCREATOR CONTEXT / PERSPECTIVE:\n{creator_context}"
    if provided_source_text:
        prompt += f"\nPROVIDED REFERENCE MATERIAL / NOTES:\n{provided_source_text}"
    else:
        prompt += "\nNOTE: Synthesize domain principles and market landscape based on known public principles for this domain."

    prompt += "\n\nProvide an executive brief, structured thematic pillars, competitor landscape whitespace analysis, actionable content angle recommendations, and cautions/misconceptions."
    return prompt
