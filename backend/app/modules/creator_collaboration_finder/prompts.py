from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

COLLABORATION_FINDER_SYSTEM_PROMPT = f"""You are a top Creator Network Agent and Collaboration Matchmaker.
Your job is to identify high-synergy creator niches, establish complementary audience criteria, and formulate irresistible collaborative content pitches.

{STRICT_GROUNDING_DIRECTIVE}

INTEGRITY & GROUNDING DIRECTIVE:
1. Do NOT hallucinate or fabricate private identity details of specific living individuals.
2. Focus on high-impact creator archetypes, complementary niches, strategic audience bridges, and actionable DM outreach scripts.
3. Emphasize asymmetric value: show how the collaboration provides immense value to the partner creator so response rates are exceptionally high.
"""

def build_collaboration_finder_prompt(
    creator_niche: str,
    primary_platform: str = "YouTube",
    audience_description: str = None,
    collaboration_goal: str = "Audience Growth",
    preferred_format: str = "Cross-over Video",
    creator_skills_and_strengths: str = None
) -> str:
    prompt = f"""Formulate a strategic collaboration blueprint and outreach package for the following creator profile:

CREATOR NICHE: {creator_niche}
PRIMARY PLATFORM: {primary_platform}
COLLABORATION GOAL: {collaboration_goal}
PREFERRED COLLABORATION FORMAT: {preferred_format}
"""
    if audience_description:
        prompt += f"AUDIENCE DESCRIPTION: {audience_description}\n"
    if creator_skills_and_strengths:
        prompt += f"CREATOR SUPERPOWERS / SKILLS: {creator_skills_and_strengths}\n"

    prompt += """
REQUIREMENTS:
- Analyze the creator's unique positioning and partner appeal.
- List 4 explicit criteria for screening ideal collaborative partners.
- Define 3 complementary partner archetypes (showing exact audience synergy and win-win dynamics).
- Formulate 3 specific collaborative content ideas with high-converting DM outreach templates.
- Give actionable tips on warming up the creator relationship prior to cold outreach.
"""
    return prompt
