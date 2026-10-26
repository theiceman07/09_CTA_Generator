import React, { useState, useEffect } from 'react';
import {
  Bot, Clapperboard, Palette, ClipboardList,
  Play, Loader2, CheckCircle2, AlertCircle,
  ChevronDown, ChevronRight, Zap, Clock,
  Camera, Music, Lightbulb, Package
} from 'lucide-react';
import {
  runShotListAgent, runCreativeDirectorAgent,
  runProductionPlannerAgent, runAllAgents,
  checkAgentsHealth,
  type AgentRequest,
  type ShotListAgentResult,
  type CreativeDirectorResult,
  type ProductionPlannerResult,
} from '../../services/agentsService';
import { type Project } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

// ── Types ────────────────────────────────────────────────────────
type AgentStatus = 'idle' | 'running' | 'done' | 'error';

interface AgentState<T> {
  status: AgentStatus;
  result: T | null;
  error: string | null;
}

interface AgentsPanelProps {
  project: Project;
}

// ── Agent Card Config ─────────────────────────────────────────────
const AGENTS = [
  {
    id: 'shot-list',
    name: 'Shot List Agent',
    emoji: '🎥',
    icon: Clapperboard,
    description: 'Generates a cinematic, shot-by-shot breakdown from your script.',
    color: 'blue',
    bgClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-600',
    badgeColor: 'blue' as const,
  },
  {
    id: 'creative-director',
    name: 'Creative Director Agent',
    emoji: '🎨',
    icon: Palette,
    description: 'Defines visual style, color palette, music direction & mood.',
    color: 'purple',
    bgClass: 'bg-purple-50 border-purple-200',
    iconClass: 'text-purple-600',
    badgeColor: 'purple' as const,
  },
  {
    id: 'production-planner',
    name: 'Production Planner Agent',
    emoji: '📋',
    icon: ClipboardList,
    description: 'Builds a full production plan with scenes, timeline, props & equipment.',
    color: 'green',
    bgClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-600',
    badgeColor: 'green' as const,
  },
];

// ─────────────────────────────────────────────────────────────────
// MAIN AGENTS PANEL
// ─────────────────────────────────────────────────────────────────
export default function AgentsPanel({ project }: AgentsPanelProps) {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [runningAll, setRunningAll] = useState(false);

  const [shotListState, setShotListState] = useState<AgentState<ShotListAgentResult>>({ status: 'idle', result: null, error: null });
  const [creativeDirState, setCreativeDirState] = useState<AgentState<CreativeDirectorResult>>({ status: 'idle', result: null, error: null });
  const [plannerState, setPlannerState] = useState<AgentState<ProductionPlannerResult>>({ status: 'idle', result: null, error: null });

  // ── Check backend health on mount ─────────────────────────────
  useEffect(() => {
    checkAgentsHealth().then(setBackendOnline);
  }, []);

  const buildRequest = (): AgentRequest => ({
    title: project.title,
    script: project.script,
    platform: project.platform,
    videoType: project.videoType,
    tones: project.tones,
    targetDuration: project.targetDuration,
    creativeDirection: project.creativeDirection,
  });

  // ── Individual Agent Runners ──────────────────────────────────
  const runShotList = async () => {
    setShotListState({ status: 'running', result: null, error: null });
    try {
      const result = await runShotListAgent(buildRequest());
      setShotListState({ status: 'done', result, error: null });
    } catch (e) {
      setShotListState({ status: 'error', result: null, error: String(e) });
    }
  };

  const runCreativeDirector = async () => {
    setCreativeDirState({ status: 'running', result: null, error: null });
    try {
      const result = await runCreativeDirectorAgent(buildRequest());
      setCreativeDirState({ status: 'done', result, error: null });
    } catch (e) {
      setCreativeDirState({ status: 'error', result: null, error: String(e) });
    }
  };

  const runProductionPlanner = async () => {
    setPlannerState({ status: 'running', result: null, error: null });
    try {
      const result = await runProductionPlannerAgent(buildRequest());
      setPlannerState({ status: 'done', result, error: null });
    } catch (e) {
      setPlannerState({ status: 'error', result: null, error: String(e) });
    }
  };

  const runAll = async () => {
    setRunningAll(true);
    setShotListState({ status: 'running', result: null, error: null });
    setCreativeDirState({ status: 'running', result: null, error: null });
    setPlannerState({ status: 'running', result: null, error: null });
    try {
      const results = await runAllAgents(buildRequest());
      setShotListState({ status: results.shotList ? 'done' : 'error', result: results.shotList || null, error: null });
      setCreativeDirState({ status: results.creativeDirection ? 'done' : 'error', result: results.creativeDirection || null, error: null });
      setPlannerState({ status: results.productionPlan ? 'done' : 'error', result: results.productionPlan || null, error: null });
    } catch (e) {
      const err = String(e);
      setShotListState(s => s.status === 'running' ? { status: 'error', result: null, error: err } : s);
      setCreativeDirState(s => s.status === 'running' ? { status: 'error', result: null, error: err } : s);
      setPlannerState(s => s.status === 'running' ? { status: 'error', result: null, error: err } : s);
    } finally {
      setRunningAll(false);
    }
  };

  // ── Status Icon ───────────────────────────────────────────────
  const StatusIcon = ({ status }: { status: AgentStatus }) => {
    if (status === 'running') return <Loader2 className="w-4 h-4 animate-spin text-brand-500" />;
    if (status === 'done') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Bot className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-studio-dark flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-500" />
            LangChain AI Agents
          </h2>
          <p className="text-sm text-studio-muted mt-1">
            Three specialized agents powered by Gemini — Shot List · Creative Director · Production Planner
          </p>
        </div>

        {/* Backend status pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
          backendOnline === null ? 'bg-gray-50 text-gray-500 border-gray-200' :
          backendOnline ? 'bg-green-50 text-green-700 border-green-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            backendOnline === null ? 'bg-gray-400' :
            backendOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          {backendOnline === null ? 'Checking...' : backendOnline ? 'Backend Online' : 'Backend Offline'}
        </div>
      </div>

      {/* ── Offline Warning ── */}
      {backendOnline === false && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Agents backend is not running</p>
            <p className="text-xs text-amber-700 mt-1">
              Start the FastAPI server:{' '}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                cd agents && python main.py
              </code>
            </p>
          </div>
        </div>
      )}

      {/* ── Run All Button ── */}
      <Button
        onClick={runAll}
        disabled={runningAll || backendOnline === false}
        className="w-full"
        size="lg"
      >
        {runningAll ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Running All 3 Agents...</>
        ) : (
          <><Zap className="w-5 h-5" /> Run All 3 Agents at Once</>
        )}
      </Button>

      {/* ── Individual Agent Cards ── */}
      <div className="space-y-4">
        {/* AGENT 1: Shot List */}
        <AgentCard
          config={AGENTS[0]}
          state={shotListState}
          onRun={runShotList}
          disabled={backendOnline === false}
        >
          {shotListState.result && <ShotListResult data={shotListState.result} />}
        </AgentCard>

        {/* AGENT 2: Creative Director */}
        <AgentCard
          config={AGENTS[1]}
          state={creativeDirState}
          onRun={runCreativeDirector}
          disabled={backendOnline === false}
        >
          {creativeDirState.result && <CreativeDirectorResult data={creativeDirState.result} />}
        </AgentCard>

        {/* AGENT 3: Production Planner */}
        <AgentCard
          config={AGENTS[2]}
          state={plannerState}
          onRun={runProductionPlanner}
          disabled={backendOnline === false}
        >
          {plannerState.result && <ProductionPlannerResult data={plannerState.result} />}
        </AgentCard>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AGENT CARD WRAPPER
// ─────────────────────────────────────────────────────────────────
function AgentCard({
  config, state, onRun, disabled, children
}: {
  config: typeof AGENTS[0];
  state: AgentState<unknown>;
  onRun: () => void;
  disabled: boolean;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = config.icon;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${config.bgClass}`}>
      {/* Card Header */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg bg-white border flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className={`w-5 h-5 ${config.iconClass}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-studio-dark text-sm">{config.name}</h3>
              {state.status !== 'idle' && (
                <Badge variant={
                  state.status === 'done' ? 'success' :
                  state.status === 'error' ? 'danger' :
                  'slate'
                } size="sm">
                  {state.status === 'running' ? 'Running...' : state.status === 'done' ? 'Done' : 'Error'}
                </Badge>
              )}
            </div>
            <p className="text-xs text-studio-muted mt-0.5 truncate">{config.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onRun}
            disabled={state.status === 'running' || disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${state.status === 'running' || disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-brand-50 text-brand-600 border border-brand-200 hover:border-brand-400 shadow-sm'
              }`}
          >
            {state.status === 'running' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run
          </button>

          {state.status === 'done' && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-studio-muted" />
              ) : (
                <ChevronRight className="w-4 h-4 text-studio-muted" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {state.status === 'error' && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">{(state as AgentState<unknown> & { error: string }).error}</p>
        </div>
      )}

      {/* Results (collapsible) */}
      {state.status === 'done' && expanded && (
        <div className="border-t border-white/60 bg-white/60 p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RESULT: Shot List Agent
// ─────────────────────────────────────────────────────────────────
function ShotListResult({ data }: { data: ShotListAgentResult }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm text-studio-muted">
        <span className="flex items-center gap-1"><Camera className="w-3.5 h-3.5" />{data.totalShots} shots</span>
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{data.estimatedDuration}</span>
      </div>

      {data.cinematographyNotes && (
        <p className="text-xs text-studio-muted italic border-l-2 border-blue-300 pl-3">
          {data.cinematographyNotes}
        </p>
      )}

      <div className="space-y-2">
        {data.shotList?.map((shot) => (
          <div key={shot.shotNumber} className="bg-white rounded-lg border border-blue-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-700 text-xs font-bold rounded flex items-center justify-center">
                  {shot.shotNumber}
                </span>
                <span className="text-sm font-medium text-studio-dark">{shot.shotType}</span>
              </div>
              <span className="text-xs text-studio-muted bg-gray-100 px-2 py-0.5 rounded">{shot.duration}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-studio-muted">
              <span>📐 {shot.cameraAngle}</span>
              <span>🎬 {shot.cameraMovement}</span>
              <span>🔭 {shot.lensSuggestion}</span>
              <span>🎵 {shot.audio?.slice(0, 30)}...</span>
            </div>
            {shot.subject && (
              <p className="text-xs text-studio-dark mt-2 border-t border-gray-100 pt-2">{shot.subject}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RESULT: Creative Director Agent
// ─────────────────────────────────────────────────────────────────
function CreativeDirectorResult({ data }: { data: CreativeDirectorResult }) {
  return (
    <div className="space-y-4">
      {/* Color Palette */}
      {data.colorPalette && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-2">Color Palette</p>
          <div className="flex gap-3 items-center">
            {['primary', 'secondary', 'accent'].map(key => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-white shadow-sm"
                  style={{ backgroundColor: (data.colorPalette as Record<string, string>)[key] || '#ccc' }}
                />
                <span className="text-xs text-studio-muted capitalize">{key}</span>
              </div>
            ))}
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              {data.colorPalette.mood}
            </span>
          </div>
        </div>
      )}

      {/* Visual Style */}
      {data.visualStyle && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-1">Visual Style</p>
          <p className="text-sm text-studio-dark">{data.visualStyle}</p>
        </div>
      )}

      {/* Music Direction */}
      {data.musicDirection && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1">
            <Music className="w-3.5 h-3.5" /> Music Direction
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-studio-dark">
            <div><span className="text-studio-muted">Genre: </span>{data.musicDirection.genre}</div>
            <div><span className="text-studio-muted">Tempo: </span>{data.musicDirection.tempo}</div>
          </div>
        </div>
      )}

      {/* Opening Hook */}
      {data.openingHook && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-1">Opening Hook</p>
          <p className="text-xs text-studio-dark border-l-2 border-purple-300 pl-3">{data.openingHook}</p>
        </div>
      )}

      {/* Platform Optimizations */}
      {data.platformOptimizations?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-2">Platform Tips</p>
          <ul className="space-y-1">
            {data.platformOptimizations.map((tip, i) => (
              <li key={i} className="text-xs text-studio-dark flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Director Notes */}
      {data.directorNotes && (
        <div className="bg-white border border-purple-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-studio-muted mb-1">Director's Notes</p>
          <p className="text-xs text-studio-dark italic">{data.directorNotes}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RESULT: Production Planner Agent
// ─────────────────────────────────────────────────────────────────
function ProductionPlannerResult({ data }: { data: ProductionPlannerResult }) {
  return (
    <div className="space-y-4">
      {/* Summary Pills */}
      {data.summary && (
        <div className="flex flex-wrap gap-2">
          {[
            { label: data.summary.totalScenes + ' Scenes', icon: '🎬' },
            { label: data.summary.estimatedShootingTime, icon: '⏱️' },
            { label: data.summary.complexity, icon: '⚙️' },
            { label: data.summary.recommendedCrew, icon: '👥' },
          ].map(({ label, icon }) => (
            <span key={label} className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {icon} {label}
            </span>
          ))}
        </div>
      )}

      {/* Scenes */}
      {data.scenes?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-2">Scenes</p>
          <div className="space-y-2">
            {data.scenes.map(scene => (
              <div key={scene.sceneNumber} className="bg-white border border-green-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-studio-dark">
                    Scene {scene.sceneNumber}: {scene.title}
                  </span>
                  <span className="text-xs text-studio-muted">{scene.duration}</span>
                </div>
                <p className="text-xs text-studio-muted">📍 {scene.location}</p>
                {scene.purpose && <p className="text-xs text-studio-dark mt-1">{scene.purpose}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Props & Equipment */}
      {data.propsAndEquipment?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-2 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Props & Equipment
          </p>
          <div className="grid grid-cols-1 gap-1">
            {data.propsAndEquipment.slice(0, 8).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                <span className="text-studio-dark">{item.name}</span>
                <span className="text-studio-muted bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Production Tips */}
      {data.productionTips?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-studio-muted uppercase tracking-wide mb-2">Production Tips</p>
          <ul className="space-y-1">
            {data.productionTips.map((tip, i) => (
              <li key={i} className="text-xs text-studio-dark flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5">✓</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
