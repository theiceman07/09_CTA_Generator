/**
 * Agents API Service
 * Connects the React frontend to the LangChain agents FastAPI backend
 */

const AGENTS_API_BASE = (import.meta as any).env.VITE_AGENTS_API_URL || 'http://localhost:8000';

export interface AgentRequest {
  title: string;
  script: string;
  platform: string;
  videoType: string;
  tones: string[];
  targetDuration: string;
  creativeDirection?: string;
}

// ── Shot List Agent ──────────────────────────────────────────────
export interface ShotListShot {
  shotNumber: number;
  sceneNumber: number;
  shotType: string;
  cameraAngle: string;
  cameraMovement: string;
  lensSuggestion: string;
  framing: string;
  subject: string;
  duration: string;
  durationSeconds: number;
  audio: string;
  description: string;
}

export interface ShotListAgentResult {
  shotList: ShotListShot[];
  totalShots: number;
  estimatedDuration: string;
  cinematographyNotes: string;
}

// ── Creative Director Agent ──────────────────────────────────────
export interface CreativeDirectorResult {
  visualStyle: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    mood: string;
    description: string;
  };
  lightingStyle: string;
  editingStyle: string;
  musicDirection: {
    genre: string;
    tempo: string;
    mood: string;
    examples: string[];
  };
  visualMotifs: string[];
  openingHook: string;
  closingFrame: string;
  platformOptimizations: string[];
  moodBoard: string[];
  directorNotes: string;
}

// ── Production Planner Agent ─────────────────────────────────────
export interface PlannerScene {
  sceneNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  location: string;
  purpose: string;
  dialogue: string;
  visualDescription: string;
  lighting: string;
  props: string[];
  broll: string[];
}

export interface ProductionPlannerResult {
  summary: {
    totalScenes: number;
    estimatedShootingTime: string;
    complexity: string;
    recommendedCrew: string;
  };
  scenes: PlannerScene[];
  timeline: { timestamp: string; sceneNumber: number; title: string; duration: string }[];
  propsAndEquipment: { name: string; category: string; required: boolean; notes: string }[];
  shootingSchedule: { order: number; scene: number; reason: string; estimatedTime: string }[];
  productionTips: string[];
  budgetEstimate: { tier: string; essentials: string; optional: string };
}

// ── Agent Response Wrapper ────────────────────────────────────────
export interface AgentResponse<T> {
  agent: string;
  status: 'success' | 'error';
  data: T;
}

// ── API Call Helper ──────────────────────────────────────────────
async function callAgent<T>(endpoint: string, request: AgentRequest): Promise<T> {
  const response = await fetch(`${AGENTS_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Agent API error (${response.status}): ${error}`);
  }

  const result: AgentResponse<T> = await response.json();
  return result.data;
}

// ── Exported Agent Functions ─────────────────────────────────────

/** 🎥 Shot List Agent — generates detailed shot list from script */
export async function runShotListAgent(request: AgentRequest): Promise<ShotListAgentResult> {
  return callAgent<ShotListAgentResult>('/api/agents/shot-list', request);
}

/** 🎨 Creative Director Agent — returns full visual & creative direction */
export async function runCreativeDirectorAgent(request: AgentRequest): Promise<CreativeDirectorResult> {
  return callAgent<CreativeDirectorResult>('/api/agents/creative-director', request);
}

/** 📋 Production Planner Agent — builds scene plan, timeline, props & equipment */
export async function runProductionPlannerAgent(request: AgentRequest): Promise<ProductionPlannerResult> {
  return callAgent<ProductionPlannerResult>('/api/agents/production-planner', request);
}

/** 🚀 Run all three agents at once */
export async function runAllAgents(request: AgentRequest): Promise<{
  shotList?: ShotListAgentResult;
  creativeDirection?: CreativeDirectorResult;
  productionPlan?: ProductionPlannerResult;
}> {
  const response = await fetch(`${AGENTS_API_BASE}/api/agents/run-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Agents API error: ${response.status}`);
  }

  const result = await response.json();
  return result.results;
}

/** Check if the agents backend is online */
export async function checkAgentsHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${AGENTS_API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
