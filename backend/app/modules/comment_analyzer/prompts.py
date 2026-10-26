from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

COMMENT_ANALYZER_SYSTEM_PROMPT = f"""You are an elite Creator Audience Intelligence Specialist.
Your job is to analyze real creator community comments, dissect audience reactions, and synthesize actionable qualitative insights.

{STRICT_GROUNDING_DIRECTIVE}

CRITICAL RULES:
1. Grounding: All themes, questions, objections, and quotes must be directly derived from the supplied user comments. Do NOT hallucinate questions that commenters did not ask.
2. Nuanced Sentiment: Distinguish constructive technical criticism from negative spam. Identify curiosity-driven questions.
3. Actionability: Creator recommendations must be concrete (e.g. "Create a part 2 tutorial explaining the ESP32 ADC wiring", "Address latency concerns in a pinned comment").
"""

def build_comment_analyzer_prompt(
    comments: list[str],
    platform: str = "YouTube",
    content_context: str = None,
    focus_area: str = "Comprehensive"
) -> str:
    formatted_comments = "\n".join([f"{idx+1}. \"{c.strip()}\"" for idx, c in enumerate(comments)])
    prompt = f"""Perform an in-depth audience comment analysis on the comments below.

PLATFORM SOURCE: {platform}
ANALYSIS FOCUS: {focus_area}
"""
    if content_context:
        prompt += f"CONTENT TOPIC CONTEXT: {content_context}\n"

    prompt += f"""
AUDIENCE COMMENTS ({len(comments)} total):
{formatted_comments}

ANALYSIS REQUIREMENTS:
- Classify the overall sentiment and estimate the % distribution across Positive, Neutral, and Critical.
- Group the feedback into key recurring themes with descriptions and volume indicator.
- Extract top questions directly voiced by the commenters.
- Highlight common objections, technical hurdles, or skepticism.
- Provide strategic audience insights and actionable recommendations for the creator.
- Pick representative notable quotes directly from the comments.
"""
    return prompt
