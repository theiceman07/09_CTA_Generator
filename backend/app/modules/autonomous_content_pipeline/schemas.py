from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PipelineOutputBundle(BaseModel):
    topic: str = Field(description="Normalized campaign topic")
    title: str = Field(description="Master package title")
    primary_script: str = Field(description="Vertical video or master script")
    caption: str = Field(description="Platform optimized caption")
    hashtags: List[str] = Field(description="Clustered hashtags")

class AutonomousPipelineLLMOutput(BaseModel):
    pipeline_id: str = Field(description="Unique pipeline run execution identifier")
    status: str = Field(description="Pipeline status: completed, failed, needs_review")
    stages_completed: List[str] = Field(description="Ordered list of autonomous production stages completed")
    output_bundle: PipelineOutputBundle = Field(description="Synthesized multi-stage production bundle")
    audit_verdict: str = Field(description="Automated grounding audit result")

class AutonomousPipelineRequest(BaseModel):
    project_id: str = Field(..., description="Project ID")
    source_input: str = Field(..., min_length=5, description="Core thesis, research document, or transcript to run through the autonomous pipeline")
    target_platforms: Optional[List[str]] = Field(default=["Instagram", "LinkedIn", "YouTube"], description="Distribution channels")
    automation_depth: Optional[str] = Field(default="Full Production Pass", description="Depth: Full Production Pass, Express Draft, Heavy Research")

class AutonomousPipelineResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "autonomous-content-pipeline"
    pipeline_id: str
    status: str
    stages_completed: List[str]
    output_bundle: PipelineOutputBundle
    audit_verdict: str
    latency_ms: int
    created_at: str
