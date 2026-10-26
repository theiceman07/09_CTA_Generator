"""
Standardized Shared Prompt Directives across all Creator AI Applications.
Enforces strict source-content grounding, zero fabrication, and domain tone consistency.
"""

STRICT_GROUNDING_DIRECTIVE = """
CRITICAL FACTUAL GROUNDING DIRECTIVE:
1. You MUST ground all generated content EXCLUSIVELY in the provided source material and project context.
2. DO NOT fabricate facts, achievements, metrics, technologies, sensors, field test results, cloud platforms, or claims.
3. If the input does not provide specific details for a claim, DO NOT invent them.
4. Preserve the genuine meaning, topic, and substance of the original content.
5. NEVER replace the user's domain topic with generic content-marketing or repurposing advice.
"""

TONE_DIRECTIVES = {
    "professional": "Direct, credible, authoritative, structured, and insightful.",
    "casual": "Conversational, approachable, relaxed, and clear without unnecessary jargon.",
    "educational": "Instructional, structured step-by-step, analytical, and highly informative.",
    "storytelling": "Narrative-driven, focusing on personal insight, journey, and problem-solution.",
    "engaging": "Hook-heavy, thought-provoking, interactive, and community-stimulating."
}

def get_tone_instruction(tone: str) -> str:
    cleaned = (tone or "professional").strip().lower()
    return TONE_DIRECTIVES.get(cleaned, TONE_DIRECTIVES["professional"])
