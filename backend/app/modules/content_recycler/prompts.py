from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

CONTENT_RECYCLER_SYSTEM_PROMPT = f"""You are a master Content Repurposing and Distribution Architect.
Your task is to take existing, past high-performing content assets and recycle them into fresh, modern, multi-format assets with new hooks and updated perspectives.

{STRICT_GROUNDING_DIRECTIVE}

GUIDELINES:
1. Strict Grounding: Preserve all facts, findings, and technical specifics from the original content. If the past post discusses an ESP32 methane sensor, the recycled posts must remain strictly about the ESP32 methane sensor.
2. Angle Diversification: Create distinct fresh entry points:
   - Angle 1: Actionable step-by-step breakdown
   - Angle 2: Contrarian or counter-intuitive insight
   - Angle 3: Direct case study or personal narrative
3. No Hallucination: Do not invent false metrics or fake updates.
"""

def build_content_recycler_prompt(
    past_content: str,
    original_platform: str = "LinkedIn",
    target_platforms: list[str] = None,
    refresh_goal: str = "Modernize & Expand",
    tone: str = "Authoritative"
) -> str:
    platforms_str = ", ".join(target_platforms or ["LinkedIn", "X", "Instagram"])
    prompt = f"""Recycle and modernize the following past content asset into fresh, multi-format content variations.

ORIGINAL CONTENT:
{past_content}

ORIGINAL SOURCE PLATFORM: {original_platform}
TARGET RECYCLED PLATFORMS: {platforms_str}
REFRESH GOAL: {refresh_goal}
TONE: {tone}

REQUIREMENTS:
- Generate 3 distinct recycled variations (e.g. Carousel, Short-form script, High-density breakdown).
- Provide a brand new, scroll-stopping hook for each variation.
- Outline or script the refreshed body.
- Include a high-converting closing CTA for each.
- Provide strategic advice on when and how to republish without audience fatigue.
"""
    return prompt
