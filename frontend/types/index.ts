export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token?: string;
  token_type: string;
  user: User;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  project_id: string;
  user_id: string;
  type: string; // 'linkedin', 'instagram', 'x', 'youtube', etc.
  title: string;
  content?: string | null;
  storage_ref?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  project_id: string;
  user_id: string;
  tool: string;
  provider: string;
  model: string;
  input_metadata: Record<string, any>;
  output_metadata: Record<string, any>;
  token_usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
  };
  status: string;
  created_at: string;
}

export interface UsageSummary {
  total_generations: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  tool_breakdown: Record<string, number>;
}

export interface YouTubeRepurposeResult {
  title: string;
  description: string;
  tags: string[];
  outline: string;
}

export interface ContentRepurposerResults {
  linkedin?: string;
  instagram?: string;
  x?: string;
  youtube?: YouTubeRepurposeResult;
}

export interface ContentRepurposerRequest {
  project_id: string;
  content: string;
  platforms: string[];
  tone?: string;
}

export interface ContentRepurposerResponse {
  generation_id: string;
  project_id: string;
  results: ContentRepurposerResults;
  usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
  };
  analysis?: Record<string, any> | null;
}

export interface IdeaOutput {
  title: string;
  idea: string;
  hook: string;
  description: string;
  target_audience: string;
  platform: string;
  rationale: string;
}

export interface ContentIdeaRequest {
  topic: string;
  niche?: string;
  target_audience?: string;
  content_goal?: string;
  platform?: string;
  tone?: string;
  number_of_ideas?: number;
  project_id?: string;
}

export interface ContentIdeaResponse {
  generation_id?: string | null;
  project_id?: string | null;
  ideas: IdeaOutput[];
  summary?: string | null;
  usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
    latency_ms?: number | null;
  };
  metadata?: Record<string, any>;
}

export interface HookOutput {
  id?: number | null;
  style: string;
  hook: string;
  platform?: string | null;
  rationale?: string | null;
}

export interface HookGeneratorRequest {
  topic: string;
  source_content?: string;
  audience?: string;
  platform?: string;
  tone?: string;
  hook_style?: string;
  number_of_hooks?: number;
  project_id?: string;
}

export interface HookGeneratorResponse {
  generation_id?: string | null;
  project_id?: string | null;
  hooks: HookOutput[];
  topic: string;
  platform: string;
  tone: string;
  usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
    latency_ms?: number | null;
  };
  metadata?: Record<string, any>;
}

export interface ReelScene {
  scene_number: number;
  timestamp: string;
  dialogue: string;
  visual_direction: string;
  on_screen_text?: string | null;
}

export interface ReelScriptOutput {
  title: string;
  hook: string;
  body: string;
  cta: string;
  duration: string;
  scenes: ReelScene[];
  caption_suggestion?: string | null;
  estimated_word_count?: number | null;
  thoughts?: string[] | null;
}

export interface ReelScriptGeneratorRequest {
  topic: string;
  hook?: string;
  audience?: string;
  platform?: string;
  tone?: string;
  duration?: string;
  content_goal?: string;
  creator_context?: string;
  project_id?: string;
}

export interface ReelScriptGeneratorResponse {
  generation_id: string;
  project_id?: string | null;
  topic: string;
  platform: string;
  tone: string;
  duration: string;
  script: ReelScriptOutput;
  usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
    latency_ms?: number | null;
  };
  metadata?: Record<string, any>;
}

// -------------------------------------------------------------------------
// Caption Assistant Types
// -------------------------------------------------------------------------
export interface CaptionVariant {
  label: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
  reach_score: number;
  why: string;
  extra?: string | null;
}

export interface CaptionOutput {
  caption: string;
  hook: string;
  body: string;
  call_to_action: string;
  hashtags: string[];
  platform: string;
  tone: string;
  content_goal: string;
  caption_length: string;
  character_count: number;
  variants: CaptionVariant[];
  recommended_variant_index: number;
  recommend_reason: string;
  planning_trace?: string | null;
}

export interface CaptionGeneratorRequest {
  topic: string;
  platform?: string;
  tone?: string;
  target_audience?: string;
  content_goal?: string;
  caption_length?: string;
  hook?: string;
  cta?: string;
  include_hashtags?: boolean;
  hashtag_count?: number;
  include_emojis?: boolean;
  include_seo_keywords?: boolean;
  format_type?: string;
  creator_context?: string;
  project_id?: string;
}

export interface CaptionGeneratorResponse {
  generation_id: string;
  project_id?: string | null;
  topic: string;
  platform: string;
  tone: string;
  caption_length: string;
  caption: CaptionOutput;
  usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    total_tokens?: number | null;
    latency_ms?: number | null;
  };
  metadata?: Record<string, any>;
}

// ----------------------------------------------------
// BATCH 1 TOOLS INTERFACES
// ----------------------------------------------------

export interface CTAItem {
  text: string;
  placement: string;
  category: string;
  why_it_works: string;
  character_count?: number;
}

export interface CTAGeneratorRequest {
  project_id: string;
  content: string;
  caption?: string;
  hook?: string;
  platform?: string;
  goal?: string;
  tone?: string;
  target_audience?: string;
  count?: number;
  creator_context?: string;
}

export interface CTAGeneratorResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  platform: string;
  goal: string;
  tone: string;
  ctas: CTAItem[];
  recommended_cta: string;
  recommended_reason: string;
  placement_strategy: string;
  latency_ms: number;
  created_at: string;
}

export interface SentimentDistribution {
  positive: number;
  neutral: number;
  critical: number;
}

export interface CommentTheme {
  theme: string;
  description: string;
  volume_level: string;
}

export interface CommentAnalyzerRequest {
  project_id: string;
  comments: string[];
  platform?: string;
  content_context?: string;
  focus_area?: string;
}

export interface CommentAnalyzerResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  total_comments_analyzed: number;
  platform: string;
  focus_area: string;
  overall_sentiment: string;
  sentiment_distribution: SentimentDistribution;
  key_themes: CommentTheme[];
  top_questions: string[];
  objections_and_critiques: string[];
  audience_insights: string[];
  actionable_recommendations: string[];
  notable_quotes: string[];
  latency_ms: number;
  created_at: string;
}

export interface FollowupContentIdea {
  title: string;
  angle: string;
  format: string;
  hook: string;
  key_talking_points: string[];
  caption_draft: string;
  call_to_action: string;
  why_it_converts: string;
}

export interface CommentToContentRequest {
  project_id: string;
  comment: string;
  additional_comments?: string[];
  platform?: string;
  format_type?: string;
  tone?: string;
  creator_context?: string;
}

export interface CommentToContentResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  source_comment: string;
  platform: string;
  ideas: FollowupContentIdea[];
  recommended_idea: FollowupContentIdea;
  strategic_summary: string;
  latency_ms: number;
  created_at: string;
}

export interface RecycledVariation {
  format_name: string;
  angle_description: string;
  hook: string;
  content_body: string;
  cta: string;
}

export interface ContentRecyclerRequest {
  project_id: string;
  past_content: string;
  original_platform?: string;
  target_platforms?: string[];
  refresh_goal?: string;
  tone?: string;
}

export interface ContentRecyclerResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  refreshed_angles_summary: string;
  variations: RecycledVariation[];
  recommended_variation: RecycledVariation;
  republishing_schedule_advice: string;
  latency_ms: number;
  created_at: string;
}

export interface CampaignConcept {
  title: string;
  concept_summary: string;
  suggested_platform: string;
  why_it_fits: string;
}

export interface DeliverableItem {
  format: string;
  scope: string;
  estimated_timeline: string;
}

export interface BrandPitchBuilderRequest {
  project_id: string;
  creator_name: string;
  creator_niche: string;
  primary_platform?: string;
  brand_name: string;
  brand_product: string;
  target_audience?: string;
  metrics_summary?: string;
  deliverables_requested?: string;
  tone?: string;
  custom_notes?: string;
}

export interface BrandPitchBuilderResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  creator_name: string;
  brand_name: string;
  email_subject_lines: string[];
  outreach_email_body: string;
  executive_summary: string;
  campaign_concepts: CampaignConcept[];
  recommended_deliverables: DeliverableItem[];
  pricing_and_roi_framing: string;
  followup_timeline_advice: string;
  latency_ms: number;
  created_at: string;
}

export interface CollaborationArchetype {
  partner_niche: string;
  audience_synergy_reason: string;
  suggested_format: string;
  win_win_value_proposition: string;
}

export interface CollaborationPitchIdea {
  title: string;
  pitch_angle: string;
  outreach_dm_template: string;
}

export interface CollaborationFinderRequest {
  project_id: string;
  creator_niche: string;
  primary_platform?: string;
  audience_description?: string;
  collaboration_goal?: string;
  preferred_format?: string;
  creator_skills_and_strengths?: string;
}

export interface CollaborationFinderResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  creator_niche: string;
  primary_platform: string;
  creator_positioning_analysis: string;
  ideal_partner_criteria: string[];
  partner_archetypes: CollaborationArchetype[];
  collaboration_ideas: CollaborationPitchIdea[];
  outreach_strategy_tips: string[];
  latency_ms: number;
  created_at: string;
}

export interface PlannedSlot {
  day: string;
  time_window: string;
  platform: string;
  content_pillar: string;
  post_title_concept: string;
  format: string;
  primary_objective: string;
}

export interface DailyContentPlannerRequest {
  project_id: string;
  core_topics: string;
  platforms?: string[];
  days_count?: number;
  posts_per_day?: number;
  creator_context?: string;
}

export interface DailyContentPlannerResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  days_count: number;
  platforms: string[];
  strategic_overview: string;
  schedule: PlannedSlot[];
  production_milestones: string[];
  consistency_tip: string;
  latency_ms: number;
  created_at: string;
}

export interface ThumbnailConcept {
  title: string;
  visual_focal_point: string;
  background_and_lighting: string;
  text_overlay?: string;
  creator_expression?: string;
  color_palette: string[];
  ctr_psychology_rationale: string;
  image_generation_prompt: string;
}

export interface ThumbnailIdeatorRequest {
  project_id: string;
  video_title_or_concept: string;
  platform?: string;
  target_audience?: string;
  include_creator_face?: boolean;
  style_preference?: string;
}

export interface ThumbnailIdeatorResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  video_title_or_concept: string;
  platform: string;
  concepts: ThumbnailConcept[];
  recommended_concept: ThumbnailConcept;
  a_b_testing_hypothesis: string;
  title_thumbnail_synergy_tip: string;
  latency_ms: number;
  created_at: string;
}

// BATCH 2: RESEARCH, SECOND BRAIN & WORKSPACE
export interface CompetitorAngle {
  angle_title: string;
  critique_or_gap: string;
  recommended_differentiation: string;
}

export interface ResearchSection {
  heading: string;
  key_findings: string[];
  content_implications: string;
}

export interface CreatorResearchRequest {
  project_id: string;
  topic: string;
  research_depth?: string;
  target_audience?: string;
  creator_context?: string;
  provided_source_text?: string;
}

export interface CreatorResearchResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  topic: string;
  research_depth: string;
  executive_brief: string;
  technical_pillars: ResearchSection[];
  competitor_landscape: CompetitorAngle[];
  content_angle_recommendations: string[];
  cautions_and_misconceptions: string[];
  latency_ms: number;
  created_at: string;
}

export interface WorkspaceAssetItem {
  id: string;
  title: string;
  type: string;
  created_at: string;
  content_snippet: string;
  meta_info?: Record<string, any>;
}

export interface WorkspaceProjectOverview {
  project_id: string;
  project_name: string;
  description?: string;
  target_audience?: string;
  tone?: string;
  total_assets: number;
  asset_types_breakdown: Record<string, number>;
  recent_assets: WorkspaceAssetItem[];
  recent_generations_count: number;
}

export interface WorkspaceHandoffRequest {
  source_asset_id: string;
  target_tool: string;
}

export interface WorkspaceHandoffResponse {
  source_asset_id: string;
  source_type: string;
  target_tool: string;
  prefill_content: string;
  suggested_params?: Record<string, any>;
}

export interface SecondBrainItemCreate {
  project_id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  source_ref?: string;
}

export interface SecondBrainItemResponse {
  id: string;
  project_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  source_ref?: string;
  created_at: string;
}

export interface SecondBrainQueryRequest {
  project_id: string;
  query: string;
  category_filter?: string;
}

export interface SecondBrainQueryResponse {
  generation_id: string;
  project_id: string;
  query: string;
  direct_answer: string;
  connected_themes: string[];
  suggested_content_hooks: string[];
  referenced_item_titles: string[];
  matched_items: SecondBrainItemResponse[];
  latency_ms: number;
  created_at: string;
}

// BATCH 3: MEDIA & AUDIO ASSISTANTS
export interface VoiceStyleProfile {
  tone_signature: string;
  sentence_structure_style: string;
  vocabulary_and_jargon: string[];
  signature_phrases: string[];
}

export interface VoiceReplicatorRequest {
  project_id: string;
  sample_writings: string;
  topic: string;
  platform?: string;
  tone?: string;
  target_audience?: string;
}

export interface VoiceReplicatorResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  topic: string;
  style_profile: VoiceStyleProfile;
  generated_content: string;
  style_alignment_score: number;
  reusable_voice_guidelines: string[];
  latency_ms: number;
  created_at: string;
}

export interface PodcastSegment {
  timestamp_range: string;
  segment_title: string;
  summary_and_questions: string;
}

export interface PodcastPlanningRequest {
  project_id: string;
  episode_concept: string;
  target_duration_minutes?: number;
  guest_name_or_archetype?: string;
  tone?: string;
  creator_notes?: string;
}

export interface PodcastPlanningResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  episode_title_options: string[];
  recommended_title: string;
  episode_description: string;
  host_guest_talking_points: string[];
  timed_segments: PodcastSegment[];
  show_notes_markdown: string;
  social_promotional_snippets: string[];
  latency_ms: number;
  created_at: string;
}

export interface ViralClip {
  start_timestamp: string;
  end_timestamp: string;
  duration_seconds: number;
  viral_potential_score: number;
  suggested_title: string;
  hook_quote: string;
  reasoning: string;
  recommended_aspect_ratio: string;
  suggested_caption: string;
}

export interface ClipFinderRequest {
  project_id: string;
  transcript_text: string;
  video_topic?: string;
  target_platform?: string;
}

export interface ClipFinderResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  analysis_summary: string;
  clips: ViralClip[];
  recommended_clip: ViralClip;
  latency_ms: number;
  created_at: string;
}

// BATCH 4: STATEFUL CREATIVE WORKFLOWS
export interface ContentDirectorRequest {
  project_id: string;
  topic: string;
  target_platform?: string;
  target_audience?: string;
  campaign_goal?: string;
}

export interface ContentDirectorResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  campaign_title: string;
  strategic_thesis: string;
  workflow_steps_executed: string[];
  directed_package: {
    concept: string;
    hook: string;
    script_summary: string;
    caption_summary: string;
    primary_cta: string;
  };
  production_readiness_score: number;
  guruvelah_principles?: string[];
  latency_ms: number;
  created_at: string;
}

export interface ScreenplayCharacter {
  name: string;
  role: string;
  motivation: string;
  arc_description: string;
}

export interface ScreenplayWorkspaceRequest {
  project_id: string;
  premise: string;
  genre?: string;
  target_format?: string;
  tone?: string;
}

export interface ScreenplayWorkspaceResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  title: string;
  logline: string;
  genre: string;
  character_profiles: ScreenplayCharacter[];
  beat_sheet: string[];
  scene_script: string;
  director_notes: string;
  latency_ms: number;
  created_at: string;
}

export interface AutonomousPipelineRequest {
  project_id: string;
  source_input: string;
  target_platforms?: string[];
  automation_depth?: string;
}

export interface AutonomousPipelineResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  pipeline_id: string;
  status: string;
  stages_completed: string[];
  output_bundle: {
    topic: string;
    title: string;
    primary_script: string;
    caption: string;
    hashtags: string[];
  };
  audit_verdict: string;
  latency_ms: number;
  created_at: string;
}

export interface ProductionShot {
  shot_number: number;
  shot_type: string;
  description: string;
  equipment_recommendation: string;
}

export interface CreativeProducerRequest {
  project_id: string;
  creative_concept: string;
  aesthetic_vibe?: string;
  primary_deliverable?: string;
}

export interface CreativeProducerResponse {
  generation_id: string;
  project_id: string;
  tool: string;
  production_package_title: string;
  creative_vision: string;
  visual_style_guide: {
    color_grading: string;
    camera_movement: string;
    audio_design: string;
  };
  shot_list: ProductionShot[];
  distribution_strategy: string;
  latency_ms: number;
  created_at: string;
}



