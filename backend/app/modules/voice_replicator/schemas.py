from typing import List, Optional
from pydantic import BaseModel, Field

class VoiceStyleProfile(BaseModel):
    tone_signature: str = Field(description="Dominant stylistic attributes, e.g. Pragmatic, Direct, Technical")
    sentence_structure_style: str = Field(description="Sentence rhythm, length patterns, pacing, and formatting")
    vocabulary_and_jargon: List[str] = Field(description="Characteristic vocabulary, technical terms, or idiomatic phrases")
    signature_phrases: List[str] = Field(description="Opening or closing rhetorical formulas")

class VoiceReplicatorLLMOutput(BaseModel):
    style_profile: VoiceStyleProfile = Field(description="Extracted voice and style architecture")
    generated_content: str = Field(description="New content drafted strictly in the author's stylistic voice")
    style_alignment_score: int = Field(ge=0, le=100, description="Confidence score of stylistic replication (0-100)")
    reusable_voice_guidelines: List[str] = Field(description="Actionable rules to replicate this author style in future drafts")

class VoiceReplicatorRequest(BaseModel):
    project_id: str = Field(..., description="Project ID")
    sample_writings: str = Field(..., min_length=20, description="Representative past writing samples, scripts, or posts demonstrating creator voice")
    topic: str = Field(..., min_length=3, description="Topic or premise for the new content")
    platform: Optional[str] = Field(default="LinkedIn", description="Target platform")
    tone: Optional[str] = Field(default="Authoritative", description="Stylistic nuance")
    target_audience: Optional[str] = Field(default=None, description="Target demographic")

class VoiceReplicatorResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "voice-replicator"
    topic: str
    style_profile: VoiceStyleProfile
    generated_content: str
    style_alignment_score: int
    reusable_voice_guidelines: List[str]
    latency_ms: int
    created_at: str
