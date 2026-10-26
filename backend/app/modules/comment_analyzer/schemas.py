from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SentimentDistribution(BaseModel):
    positive: int = Field(default=0, description="Percentage of positive sentiment (0-100)")
    neutral: int = Field(default=0, description="Percentage of neutral sentiment (0-100)")
    critical: int = Field(default=0, description="Percentage of critical or skeptical sentiment (0-100)")

class CommentTheme(BaseModel):
    theme: str = Field(description="Name or title of the recurring theme")
    description: str = Field(description="Explanation of what commenters are discussing")
    volume_level: str = Field(description="High, Medium, or Low interest frequency")

class CommentAnalysisLLMOutput(BaseModel):
    overall_sentiment: str = Field(description="Summary sentiment classification (e.g. Enthusiastic, Inquisitive, Skeptical, Divided)")
    sentiment_distribution: SentimentDistribution = Field(description="Estimated sentiment breakdown")
    key_themes: List[CommentTheme] = Field(description="Top recurring themes identified across comments")
    top_questions: List[str] = Field(description="Most frequent or insightful questions asked by commenters")
    objections_and_critiques: List[str] = Field(description="Key objections, doubts, or constructive criticisms voiced")
    audience_insights: List[str] = Field(description="Strategic psychological and behavioural observations about the audience")
    actionable_recommendations: List[str] = Field(description="Direct suggestions on how the creator should respond or follow up")
    notable_quotes: List[str] = Field(description="Representative quotes extracted verbatim or closely paraphrased")

class CommentAnalyzerRequest(BaseModel):
    project_id: str = Field(..., description="Target project ID")
    comments: List[str] = Field(..., min_length=1, description="List of raw audience comments to analyze")
    platform: str = Field(default="YouTube", description="Platform source (YouTube, Instagram, TikTok, LinkedIn, X)")
    content_context: Optional[str] = Field(default=None, description="Optional topic or video context for better analytical relevance")
    focus_area: Optional[str] = Field(default="Comprehensive", description="Analytical focus: Comprehensive, Questions Only, Objections & Skepticism, Content Requests")

class CommentAnalyzerResponse(BaseModel):
    generation_id: str
    project_id: str
    tool: str = "comment-analyzer"
    total_comments_analyzed: int
    platform: str
    focus_area: str
    overall_sentiment: str
    sentiment_distribution: SentimentDistribution
    key_themes: List[CommentTheme]
    top_questions: List[str]
    objections_and_critiques: List[str]
    audience_insights: List[str]
    actionable_recommendations: List[str]
    notable_quotes: List[str]
    latency_ms: int
    created_at: str
