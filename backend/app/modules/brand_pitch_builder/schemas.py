from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CampaignConcept(BaseModel):
    title: str = Field(description="Campaign concept title")
    concept_summary: str = Field(description="Creative narrative connecting creator audience with brand product")
    suggested_platform: str = Field(description="Platform for this concept (e.g. YouTube, Instagram Reel, LinkedIn)")
    why_it_fits: str = Field(description="Rationale for audience alignment and high organic interest")

class DeliverableItem(BaseModel):
    format: str = Field(description="Deliverable asset format (e.g. 60-second Dedicated Reel, Sponsored Newsletter Feature, 30s Mid-roll)")
    scope: str = Field(description="Details on what is included (usage rights, link in bio, revisions)")
    estimated_timeline: str = Field(description="Turnaround time (e.g. 7 business days from product receipt)")

class BrandPitchLLMOutput(BaseModel):
    email_subject_lines: List[str] = Field(description="3 high-open-rate cold pitch subject lines")
    outreach_email_body: str = Field(description="Polished, customized pitch email ready to send")
    executive_summary: str = Field(description="One-paragraph pitch statement for LinkedIn/DM outreach")
    campaign_concepts: List[CampaignConcept] = Field(description="Creative concepts tailored to the brand")
    recommended_deliverables: List[DeliverableItem] = Field(description="Structured deliverables package")
    pricing_and_roi_framing: str = Field(description="Strategic framing on pricing and expected sponsor value")
    followup_timeline_advice: str = Field(description="When and how to follow up if no response within 5 days")

class BrandPitchBuilderRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    creator_name: str = Field(..., min_length=2, description="Creator or channel name")
    creator_niche: str = Field(..., min_length=2, description="Creator content niche (e.g. Hardware Engineering & IoT)")
    primary_platform: str = Field(default="YouTube", description="Primary social platform")
    brand_name: str = Field(..., min_length=2, description="Target brand or company name")
    brand_product: str = Field(..., min_length=2, description="Specific product, tool, or service being pitched")
    target_audience: Optional[str] = Field(default=None, description="Audience demographic & interest breakdown")
    metrics_summary: Optional[str] = Field(default=None, description="Creator audience metrics if supplied (e.g. '25K subs, 12% engagement')")
    deliverables_requested: Optional[str] = Field(default=None, description="Preferred package (e.g. '1 dedicated review + 2 social cutdowns')")
    tone: str = Field(default="Professional & Collaborative", description="Tone (Professional & Collaborative, Direct & ROI-Focused, Bold & Creative)")
    custom_notes: Optional[str] = Field(default=None, description="Optional extra requirements or past brand wins")

class BrandPitchBuilderResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "brand-pitch-builder"
    creator_name: str
    brand_name: str
    email_subject_lines: List[str]
    outreach_email_body: str
    executive_summary: str
    campaign_concepts: List[CampaignConcept]
    recommended_deliverables: List[DeliverableItem]
    pricing_and_roi_framing: str
    followup_timeline_advice: str
    latency_ms: int
    created_at: str
