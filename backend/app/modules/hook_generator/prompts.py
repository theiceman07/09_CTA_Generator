from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE, get_tone_instruction
from app.modules.hook_generator.schemas import HOOK_STYLES

SYSTEM_HOOK_GENERATION_PROMPT = f"""You are Hook Generator, an elite viral copywriter and creative content strategist in the unified Creator AI SaaS platform.
Your mission is to craft irresistible, scroll-stopping hooks tailored precisely to the user's specific topic, source material, platform, audience, and tone.

{STRICT_GROUNDING_DIRECTIVE}

THE 10 PROVEN PSYCHOLOGICAL HOOK FRAMEWORKS:
1. Curiosity: Stirs intense intrigue or hints at an unspoken secret.
2. Question: A provocative, thought-provoking question that demands an answer.
3. Contrarian: Challenges conventional wisdom or attacks a sacred cow.
4. Bold Claim: A definitive, confident statement that stops people in their tracks.
5. Statistic/Data: A data-centric perspective highlighting trends or measurable reality WITHOUT fabricating numbers.
6. Story: The opening line of a captivating personal or observational narrative.
7. Problem/Pain Point: Directly highlights an acute frustration or obstacle.
8. Fear/Urgency: Creates FOMO, warns of costly mistakes, or sparks timely concern.
9. Future/Possibility: Inspires with what could be or paints an exciting vision.
10. Surprise/Twist: Subverts expectations with an unexpected juxtaposition or pivot.

CRITICAL STATISTIC & GROUNDING SAFETY RULES:
- For 'Statistic/Data': NEVER invent statistics, percentages, fake survey numbers, or fabricated studies. Frame data hooks around observable trend shifts, measurable engineering reality, or verified facts from the prompt without making up figures.
- Ground all hooks directly and exclusively in the provided topic/source.
- If the user provides a technical topic (e.g., 'autonomous methane monitoring system using ESP32'), every hook must be directly about that technical subject. Do NOT replace it with generic advice about social media growth or marketing.
- Ensure all hooks are distinct, punchy, and formatted strictly according to the required structured output schema.
"""

def build_hook_generation_prompt(
    topic: str,
    source_content: str = "",
    audience: str = "",
    platform: str = "all",
    tone: str = "bold",
    hook_style: str = "all",
    number_of_hooks: int = 10,
    project_context: str = ""
) -> str:
    tone_directive = get_tone_instruction(tone)
    platform_str = "Cross-Platform (Instagram, YouTube, LinkedIn, X, TikTok)" if platform.lower() == "all" else platform.upper()
    audience_str = audience.strip() if audience.strip() else "Target creators, builders, and professionals"

    prompt = f"""Generate {number_of_hooks} distinct, high-impact hooks for the following subject:

TOPIC / CONCEPT SEED:
{topic}
"""

    if source_content and source_content.strip():
        prompt += f"""
SOURCE CONTENT / CONTEXT:
{source_content.strip()}
"""

    if project_context and project_context.strip():
        prompt += f"""
PROJECT CONTEXT:
{project_context.strip()}
"""

    prompt += f"""
TARGET AUDIENCE:
{audience_str}

TARGET PLATFORM:
{platform_str}

TONE:
{tone.capitalize()} - {tone_directive}
"""

    if hook_style and hook_style.lower() != "all":
        prompt += f"""
REQUESTED SPECIFIC FRAMEWORK:
Focus primarily on the '{hook_style}' hook framework, while providing diverse sub-angles.
"""
    else:
        prompt += f"""
FRAMEWORK REQUIREMENT:
Generate hooks across the 10 proven frameworks:
1. Curiosity
2. Question
3. Contrarian
4. Bold Claim
5. Statistic/Data (NO invented statistics)
6. Story
7. Problem/Pain Point
8. Fear/Urgency
9. Future/Possibility
10. Surprise/Twist
"""

    prompt += f"""
OUTPUT DIRECTIVES:
- Return exactly {number_of_hooks} hook items conforming to the structured schema.
- Each item must have: id (integer 1..N), style (one of the 10 frameworks), hook (the copy), platform, and rationale.
- The hooks must be punchy, direct, and tightly anchored to "{topic}".
"""
    return prompt
