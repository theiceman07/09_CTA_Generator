from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE, get_tone_instruction

SYSTEM_IDEA_GENERATION_PROMPT = f"""You are a world-class creator content strategist and creative director in the unified Creator AI SaaS platform.
Your mission is to brainstorm viral, niche-targeted, high-converting content concepts, topics, and video angles.

{STRICT_GROUNDING_DIRECTIVE}

CRITICAL EXECUTION REQUIREMENTS:
1. Every generated idea MUST directly and substantively center on the user's provided topic and niche.
2. DO NOT fabricate facts, false statistics, fake technical claims, or unrelated products.
3. NEVER replace the user's domain topic with generic advice about social media marketing, personal branding, or content repurposing unless the topic itself is about that.
4. Craft an authentic, scroll-stopping opening hook for every concept.
5. Provide a realistic execution breakdown and strategic rationale explaining why the angle will succeed algorithmically and psychologically.
6. Tailor each idea for the creator's requested platform and tone.
7. Return strictly validated structured output conforming to the required schema.
"""

def build_idea_generation_prompt(
    topic: str,
    niche: str,
    target_audience: str,
    content_goal: str,
    platform: str,
    tone: str,
    number_of_ideas: int,
    project_context: str = ""
) -> str:
    tone_directive = get_tone_instruction(tone)
    target_platform_str = "Cross-Platform (YouTube, LinkedIn, X, Instagram, TikTok)" if platform.lower() == "all" else platform.upper()

    prompt = f"""Generate exactly {number_of_ideas} distinct, high-impact content concepts based strictly on the following parameters:

TOPIC / CONCEPT SEED:
{topic}

NICHE / INDUSTRY VERTICAL:
{niche}

TARGET AUDIENCE:
{target_audience}

CONTENT OBJECTIVE / GOAL:
{content_goal}

TARGET PLATFORM:
{target_platform_str}

CREATOR VOICE & TONE:
{tone.capitalize()} ({tone_directive})
"""

    if project_context:
        prompt += f"""
EXISTING PROJECT CONTEXT:
{project_context}
"""

    prompt += f"""
GROUNDING & QUALITY DIRECTIVES:
- Every concept must be grounded directly in: "{topic}".
- Generate exactly {number_of_ideas} distinct, non-repetitive ideas.
- Ensure each idea provides:
  * title: Clear, catchy title or working headline
  * idea: Core angle, premise, or key insight
  * hook: Scroll-stopping first sentence or opening line
  * description: Step-by-step overview of how to produce or explain the content
  * target_audience: Specific sub-audience segment this appeals to
  * platform: Best platform for this specific concept
  * rationale: Algorithmic, viral, or psychological reason why this works
"""
    return prompt
