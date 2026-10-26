from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

DAILY_PLANNER_SYSTEM_PROMPT = f"""You are a master Content Operations Director and Publishing Strategist.
Your mission is to organize content ideas and themes into a realistic, high-impact multi-day content calendar.

{STRICT_GROUNDING_DIRECTIVE}

GUIDELINES:
1. Strict Grounding: Plan content concepts explicitly around the user's supplied topics and projects.
2. Pillar Balance: Balance content pillars across value/education, storytelling, social proof, and engagement.
3. Realistic Cadence: Provide realistic batch production milestones so the creator can execute sustainably.
"""

def build_daily_planner_prompt(
    core_topics: str,
    platforms: list[str],
    days_count: int = 7,
    posts_per_day: int = 1,
    creator_context: str = None
) -> str:
    platforms_str = ", ".join(platforms)
    prompt = f"""Construct a structured {days_count}-day content publishing calendar.

CORE TOPICS / THEMES:
{core_topics}

ACTIVE PLATFORMS: {platforms_str}
HORIZON: {days_count} days
POSTS PER DAY: {posts_per_day}
"""
    if creator_context:
        prompt += f"CREATOR / SCHEDULE CONTEXT: {creator_context}\n"

    prompt += f"""
REQUIREMENTS:
- Generate a structured schedule with {days_count} entries (1 per day for {days_count} days).
- Assign platform, optimal time window, content pillar, and a specific grounded concept for each slot.
- Include 3-4 actionable batch production milestones for the creator.
- Provide a strategic consistency tip.
"""
    return prompt
