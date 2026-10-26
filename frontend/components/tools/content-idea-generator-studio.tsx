"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Project, ContentIdeaResponse, IdeaOutput } from "@/types";
import {
  Lightbulb,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderKanban,
  FileCheck,
  Target,
  ArrowRight,
  TrendingUp,
  Flame,
  Bookmark,
  Send,
  Zap,
} from "lucide-react";

interface ContentIdeaGeneratorStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: ContentIdeaResponse) => void;
}

const SAMPLE_IDEA_INPUT = {
  topic: "Building an Autonomous IoT Methane Monitoring System using ESP32 and Edge AI",
  niche: "Hardware Engineering & IoT",
  target_audience: "Makers, Embedded Developers, and Tech Enthusiasts",
  content_goal: "Authority & Growth",
  platform: "all",
  tone: "engaging",
  number_of_ideas: 5,
};

const NICHES = [
  "Hardware Engineering & IoT",
  "AI & Software Engineering",
  "SaaS & Tech Startups",
  "Creator Economy & Growth",
  "Personal Finance & Investing",
  "Productivity & Systems",
];

const PLATFORMS = [
  { id: "all", label: "All Platforms" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X (Twitter)" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
];

const TONES = [
  { id: "engaging", label: "Engaging" },
  { id: "professional", label: "Professional" },
  { id: "educational", label: "Educational" },
  { id: "storytelling", label: "Storytelling" },
  { id: "casual", label: "Casual" },
];

const GOALS = [
  "Engagement",
  "Authority & Growth",
  "Conversion & Sales",
  "Thought Leadership",
  "Education",
];

const IDEA_COUNTS = [3, 5, 8];

export function ContentIdeaGeneratorStudio({
  initialProjectId,
  onGenerationComplete,
}: ContentIdeaGeneratorStudioProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Hardware Engineering & IoT");
  const [targetAudience, setTargetAudience] = useState("Makers, Embedded Developers, and Tech Enthusiasts");
  const [contentGoal, setContentGoal] = useState("Authority & Growth");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedTone, setSelectedTone] = useState("engaging");
  const [numberOfIdeas, setNumberOfIdeas] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentIdeaResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const list = await api.projects.list();
        setProjects(list);
        if (!selectedProjectId && list.length > 0) {
          setSelectedProjectId(list[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, [selectedProjectId]);

  const handleLoadSample = () => {
    setTopic(SAMPLE_IDEA_INPUT.topic);
    setNiche(SAMPLE_IDEA_INPUT.niche);
    setTargetAudience(SAMPLE_IDEA_INPUT.target_audience);
    setContentGoal(SAMPLE_IDEA_INPUT.content_goal);
    setSelectedPlatform(SAMPLE_IDEA_INPUT.platform);
    setSelectedTone(SAMPLE_IDEA_INPUT.tone);
    setNumberOfIdeas(SAMPLE_IDEA_INPUT.number_of_ideas);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please provide a topic or concept seed to brainstorm ideas.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.tools.generateContentIdeas({
        topic: topic.trim(),
        niche: niche.trim(),
        target_audience: targetAudience.trim(),
        content_goal: contentGoal,
        platform: selectedPlatform,
        tone: selectedTone,
        number_of_ideas: numberOfIdeas,
        project_id: selectedProjectId || undefined,
      });

      setResult(response);
      if (onGenerationComplete) {
        onGenerationComplete(response);
      }
    } catch (err: any) {
      setError(err.message || "Idea generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const triggerHandoff = (destination: string, idea: IdeaOutput) => {
    setHandoffNotice(`Prepared idea "${idea.title.slice(0, 30)}..." for ${destination}. Cross-tool workflow handoff ready.`);
    setTimeout(() => setHandoffNotice(null), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration & Inputs Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Content Idea Generator</h2>
              <p className="text-xs text-slate-400">
                Brainstorm viral concepts, scroll-stopping hooks, and video angles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {handoffNotice && (
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-fade-in">
            <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{handoffNotice}</span>
          </div>
        )}

        {/* Project Selector (Optional Association) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Project (Optional)
          </label>
          <div className="relative">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">No Project (Ad-Hoc Ideation)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <FolderKanban className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Topic / Seed Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Topic or Seed Concept *
            </label>
            <span className="text-[11px] text-slate-500">
              {topic.length} chars
            </span>
          </div>
          <textarea
            rows={4}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Building an Autonomous IoT Methane Monitoring System using ESP32, or How Postgres row-level security works..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Niche & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Creator Niche
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Hardware & IoT"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {NICHES.slice(0, 3).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiche(n)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {n.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Builders and Developers"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Target Platform */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPlatform === p.id
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone and Number of Ideas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Creator Tone
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTone(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedTone === t.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Number of Concepts
            </label>
            <div className="flex gap-2">
              {IDEA_COUNTS.map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setNumberOfIdeas(cnt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    numberOfIdeas === cnt
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cnt} Ideas
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Goal */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Primary Content Objective
          </label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setContentGoal(g)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  contentGoal === g
                    ? "bg-slate-800 text-indigo-300 border border-indigo-500/40"
                    : "bg-slate-900/60 border border-slate-800/80 text-slate-500 hover:text-slate-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-600 via-indigo-600 to-violet-600 hover:from-amber-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Grounded Concepts with Gemini 3.1...</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              <span>Generate Content Ideas</span>
            </>
          )}
        </button>
      </div>

      {/* Output / Concepts Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[580px]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Generated Concepts & Hooks</h3>
          </div>
          {result?.project_id && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Saved to Project</span>
            </div>
          )}
        </div>

        {!result ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">Ready to Ideate</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Provide your topic or seed concept, select your target audience and voice,
              then click &quot;Generate Content Ideas&quot; to receive structured angles and hooks.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4 pt-4">
            {result.summary && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{result.summary}</span>
              </div>
            )}

            {/* Ideas List */}
            <div className="space-y-4 overflow-y-auto max-h-[640px] pr-1">
              {result.ideas.map((idea, index) => {
                const copyAllKey = `idea-${index}-all`;
                const copyHookKey = `idea-${index}-hook`;

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    {/* Header: Concept # and Platform */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {idea.platform}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            `Title: ${idea.title}\n\nHook: ${idea.hook}\n\nIdea: ${idea.idea}\n\nExecution: ${idea.description}\n\nRationale: ${idea.rationale}`,
                            copyAllKey
                          )
                        }
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded transition-colors"
                        title="Copy Entire Idea"
                      >
                        {copiedKey === copyAllKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Concept</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {idea.title}
                    </h4>

                    {/* Hook Callout Box */}
                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-400">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>Opening Hook</span>
                        </span>
                        <button
                          onClick={() => handleCopy(idea.hook, copyHookKey)}
                          className="text-[10px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === copyHookKey ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy Hook</span>
                        </button>
                      </div>
                      <p className="text-xs font-medium text-indigo-100 italic leading-relaxed">
                        &quot;{idea.hook}&quot;
                      </p>
                    </div>

                    {/* Description & Core Angle */}
                    <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
                      <p className="text-slate-400">
                        <strong className="text-slate-200">Execution Plan:</strong> {idea.description}
                      </p>
                    </div>

                    {/* Metadata: Audience & Rationale */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 font-medium">Audience:</span> {idea.target_audience}
                      </span>
                      <span className="text-indigo-400/90 font-medium italic">
                        {idea.rationale}
                      </span>
                    </div>

                    {/* Workflow Handoff Action Bar */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => triggerHandoff("Hook Generator", idea)}
                        className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Send to Hook Gen</span>
                      </button>
                      <Link
                        href={`/tools/content-repurposer`}
                        className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Repurpose Content</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Usage Metadata Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-4">
                <span>
                  Tokens:{" "}
                  <strong className="text-slate-400">
                    {result.usage?.total_tokens ?? "Recorded"}
                  </strong>
                </span>
                {result.usage?.latency_ms && (
                  <span>
                    Latency:{" "}
                    <strong className="text-slate-400">
                      {result.usage.latency_ms}ms
                    </strong>
                  </span>
                )}
                {result.generation_id && (
                  <span>
                    Gen ID:{" "}
                    <code className="text-slate-400">
                      {result.generation_id.slice(0, 8)}...
                    </code>
                  </span>
                )}
              </div>
              <span className="text-indigo-400 font-medium">Standardized Tracing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
