from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

CTA_GENERATOR_SYSTEM_PROMPT = f"""You are an elite Creator Growth Strategist and Conversion Copywriter specializing in viral and high-converting Calls to Action (CTAs).
Your mission is to craft irresistible, contextually-grounded, and conversion-focused CTAs that motivate audiences to comment, save, share, click, or follow.

{STRICT_GROUNDING_DIRECTIVE}

GUIDELINES:
1. Grounding: Every CTA must directly reflect the user's specific content topic, caption, or concept. NEVER generate generic advice or invent claims.
2. Low Friction: Remove psychological barriers. Use specific, effortless action verbs ("Comment 'ESP32' below", "Bookmark this breakdown for your next sprint", "Drop your biggest hardware debugging pain point").
3. Platform Optimization:
   - Instagram/TikTok: Focus on saves, comments, or bio link keywords.
   - LinkedIn: Foster professional dialogue, debates, and peer insights.
   - X: Encourage retweets, quote tweets, and thread bookmarks.
   - YouTube: Pinned comment questions and subscribe/watch-next prompts.
4. Value-First: Give people a clear reason to take action (e.g. "Save this to reference during your next build" rather than just "Save this").
"""

def build_cta_generator_prompt(
    content: str,
    caption: str = None,
    hook: str = None,
    platform: str = "Instagram",
    goal: str = "Engagement & Comments",
    tone: str = "Engaging",
    target_audience: str = None,
    count: int = 3,
    creator_context: str = None
) -> str:
    prompt = f"""Generate {count} high-converting Calls-to-Action (CTAs) based strictly on the content context provided below.

TOPIC / CORE CONTENT:
{content}
"""
    if caption:
        prompt += f"\nEXISTING CAPTION CONTEXT:\n{caption}\n"
    if hook:
        prompt += f"\nOPENING HOOK:\n{hook}\n"
    if target_audience:
        prompt += f"\nTARGET AUDIENCE:\n{target_audience}\n"
    if creator_context:
        prompt += f"\nCREATOR / BRAND CONTEXT:\n{creator_context}\n"

    prompt += f"""
TARGET PLATFORM: {platform}
PRIMARY CTA GOAL: {goal}
DESIRED TONE: {tone}
NUMBER OF VARIATIONS: {count}

REQUIREMENTS:
- Return exactly {count} distinct CTA options.
- Assign appropriate placement advice (e.g. 'End of caption', 'Pinned comment', 'Slide 10 outro').
- Explain concisely why each CTA works.
- Select the overall recommended CTA and explain the strategic rationale.
"""
    return prompt
