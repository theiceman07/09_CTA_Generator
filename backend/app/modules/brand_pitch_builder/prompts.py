from app.ai.shared.prompts import STRICT_GROUNDING_DIRECTIVE

BRAND_PITCH_SYSTEM_PROMPT = f"""You are a premier Creator Business Manager and Brand Partnerships Strategist.
Your job is to craft persuasive, high-converting sponsorship pitches and partnership proposals that creators can send to brands.

{STRICT_GROUNDING_DIRECTIVE}

ABSOLUTE GROUNDING & INTEGRITY RULES:
1. NEVER INVENT CREATOR METRICS: If the user provides follower counts or engagement rates, incorporate them accurately. If NO metrics are supplied, DO NOT make up fake subscriber counts or fake engagement percentages. Use clear brackets such as '[Insert Your Monthly Impressions / Audience Size]' or focus purely on organic creative alignment.
2. Product Relevance: Connect the creator's technical niche directly to the brand's product value proposition.
3. Win-Win Framing: Brands care about ROI, brand safety, authentic audience trust, and conversions. Frame the creator as an authoritative voice their customers already trust.
"""

def build_brand_pitch_prompt(
    creator_name: str,
    creator_niche: str,
    brand_name: str,
    brand_product: str,
    primary_platform: str = "YouTube",
    target_audience: str = None,
    metrics_summary: str = None,
    deliverables_requested: str = None,
    tone: str = "Professional & Collaborative",
    custom_notes: str = None
) -> str:
    prompt = f"""Construct a comprehensive brand sponsorship pitch for the following creator and target brand:

CREATOR NAME: {creator_name}
CREATOR NICHE: {creator_niche}
PRIMARY PLATFORM: {primary_platform}
TARGET BRAND: {brand_name}
BRAND PRODUCT / TOOL: {brand_product}
"""
    if target_audience:
        prompt += f"TARGET AUDIENCE DEMOGRAPHICS: {target_audience}\n"
    if metrics_summary:
        prompt += f"SUPPLIED CREATOR METRICS: {metrics_summary}\n"
    else:
        prompt += "SUPPLIED CREATOR METRICS: None provided (DO NOT invent fake metrics; use bracketed placeholders if needed).\n"
    if deliverables_requested:
        prompt += f"REQUESTED DELIVERABLES: {deliverables_requested}\n"
    if custom_notes:
        prompt += f"CUSTOM NOTES / BACKGROUND: {custom_notes}\n"

    prompt += f"""
DESIRED TONE: {tone}

PITCH REQUIREMENTS:
- Provide 3 compelling cold pitch email subject lines.
- Write a complete, professional outreach email ready to personalize and send.
- Write a 1-paragraph executive summary suitable for LinkedIn messaging or Instagram DM outreach.
- Propose 2 creative campaign concepts directly tying the brand's product to the creator's niche.
- Specify recommended deliverables with realistic turnaround times.
- Frame the pricing and ROI value proposition clearly.
- Provide tactical follow-up advice if no reply is received within 5 business days.
"""
    return prompt
