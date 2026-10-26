"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Project, HookGeneratorResponse, HookOutput } from "@/types";
import {
  Anchor,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderKanban,
  FileCheck,
  Zap,
  Target,
  ArrowRight,
  HelpCircle,
  Flame,
  BrainCircuit,
  Filter,
} from "lucide-react";

interface HookGeneratorStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: HookGeneratorResponse) => void;
}

const SAMPLE_HOOK_INPUT = {
  topic: "Building an Autonomous IoT Methane Monitoring System using ESP32 and Edge AI",
  source_content: "Engineered an autonomous low-cost edge sensing node utilizing ESP32, MQ-4 sensor, and local anomaly detection to alert on industrial gas leaks without relying on continuous cloud connectivity.",
  audience: "Makers, Embedded Engineers, and Hardware Innovators",
  platform: "all",
  tone: "bold",
  hook_style: "all",
  number_of_hooks: 10,
};

const PLATFORMS = [
  { id: "all", label: "All Platforms" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X/Twitter" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
];

const TONES = [
  { id: "bold", label: "Bold" },
  { id: "professional", label: "Professional" },
  { id: "educational", label: "Educational" },
  { id: "engaging", label: "Engaging" },
  { id: "storytelling", label: "Storytelling" },
  { id: "funny", label: "Funny" },
  { id: "emotional", label: "Emotional" },
  { id: "casual", label: "Casual" },
];

const HOOK_FRAMEWORKS = [
  { id: "all", label: "All 10 Frameworks" },
  { id: "Curiosity", label: "Curiosity" },
  { id: "Question", label: "Question" },
  { id: "Contrarian", label: "Contrarian" },
  { id: "Bold Claim", label: "Bold Claim" },
  { id: "Statistic/Data", label: "Statistic/Data" },
  { id: "Story", label: "Story" },
  { id: "Problem/Pain Point", label: "Problem/Pain Point" },
  { id: "Fear/Urgency", label: "Fear/Urgency" },
  { id: "Future/Possibility", label: "Future/Possibility" },
  { id: "Surprise/Twist", label: "Surprise/Twist" },
];

export function HookGeneratorStudio({
  initialProjectId,
  onGenerationComplete,
}: HookGeneratorStudioProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "");
  const [topic, setTopic] = useState("");
  const [sourceContent, setSourceContent] = useState("");
  const [audience, setAudience] = useState("Makers and Embedded Engineers");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedTone, setSelectedTone] = useState("bold");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [numberOfHooks, setNumberOfHooks] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HookGeneratorResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);

  // Check URL query parameters for cross-tool workflow handoff (e.g. from Content Idea Generator)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const passedTopic = params.get("topic");
      const passedIdea = params.get("idea");
      const passedAudience = params.get("audience");

      if (passedTopic) setTopic(passedTopic);
      if (passedIdea) setSourceContent(passedIdea);
      if (passedAudience) setAudience(passedAudience);
    }
  }, []);

  // Load user projects
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
    setTopic(SAMPLE_HOOK_INPUT.topic);
    setSourceContent(SAMPLE_HOOK_INPUT.source_content);
    setAudience(SAMPLE_HOOK_INPUT.audience);
    setSelectedPlatform(SAMPLE_HOOK_INPUT.platform);
    setSelectedTone(SAMPLE_HOOK_INPUT.tone);
    setSelectedStyle(SAMPLE_HOOK_INPUT.hook_style);
    setNumberOfHooks(SAMPLE_HOOK_INPUT.number_of_hooks);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please provide a topic or concept seed to generate hooks.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.tools.generateHooks({
        topic: topic.trim(),
        source_content: sourceContent.trim() || undefined,
        audience: audience.trim() || undefined,
        platform: selectedPlatform,
        tone: selectedTone,
        hook_style: selectedStyle,
        number_of_hooks: numberOfHooks,
        project_id: selectedProjectId || undefined,
      });

      setResult(response);
      setActiveFilter("all");
      if (onGenerationComplete) {
        onGenerationComplete(response);
      }
    } catch (err: any) {
      setError(err.message || "Hook generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const triggerHandoff = (destination: string, hook: HookOutput) => {
    setHandoffNotice(`Prepared hook "${hook.hook.slice(0, 35)}..." for ${destination}. Cross-tool workflow ready.`);
    setTimeout(() => setHandoffNotice(null), 3500);
  };

  // Filter generated hooks based on the active UI framework tab
  const displayedHooks = result?.hooks ? (
    activeFilter === "all"
      ? result.hooks
      : result.hooks.filter((h) => h.style.toLowerCase() === activeFilter.toLowerCase())
  ) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration & Inputs Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hook Generator</h2>
              <p className="text-xs text-slate-400">
                10 proven psychological frameworks for high-converting opening hooks
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
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2">
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
              <option value="">No Project (Ad-Hoc Hook Generation)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <FolderKanban className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Topic or Premise *
            </label>
            <span className="text-[11px] text-slate-500">
              {topic.length} chars
            </span>
          </div>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Building an Autonomous IoT Methane Monitoring System using ESP32..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Optional Source Content / Draft Context */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Source Content / Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={sourceContent}
            onChange={(e) => setSourceContent(e.target.value)}
            placeholder="Optional context, build notes, or article excerpt to ground hooks deeper..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Audience
          </label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g. Founders, embedded engineers, students, creators"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Platform Selector */}
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

        {/* Tone and Number of Hooks */}
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
              Hook Quantity
            </label>
            <div className="flex gap-2">
              {[5, 10].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setNumberOfHooks(cnt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    numberOfHooks === cnt
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cnt} Hooks
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Framework Focus */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Framework Focus
          </label>
          <div className="flex flex-wrap gap-1.5">
            {HOOK_FRAMEWORKS.slice(0, 6).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedStyle(f.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedStyle === f.id
                    ? "bg-slate-800 text-indigo-300 border border-indigo-500/40"
                    : "bg-slate-900/60 border border-slate-800/80 text-slate-500 hover:text-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating 10 Framework Hooks with Gemini 3.1...</span>
            </>
          ) : (
            <>
              <Anchor className="w-4 h-4" />
              <span>Generate {numberOfHooks} Hooks</span>
            </>
          )}
        </button>
      </div>

      {/* Output Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[580px]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Generated Framework Hooks</h3>
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
              <Anchor className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">Ready to Hook Your Audience</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Provide your topic or premise, choose your target platform and tone,
              then click &quot;Generate Hooks&quot; to produce high-retention angles across 10 frameworks.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4 pt-4">
            {/* Quick Framework Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`text-[11px] px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                All ({result.hooks.length})
              </button>
              {Array.from(new Set(result.hooks.map((h) => h.style))).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setActiveFilter(style)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter.toLowerCase() === style.toLowerCase()
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Hooks List */}
            <div className="space-y-3.5 overflow-y-auto max-h-[620px] pr-1">
              {displayedHooks.map((hook, index) => {
                const formattedNumber = String(index + 1).padStart(2, "0");
                const copyKey = `hook-${index}`;

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    {/* Header: Number, Style & Copy Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          {formattedNumber}
                        </span>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                          {hook.style}
                        </span>
                        {hook.platform && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {hook.platform}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(hook.hook, copyKey)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Copy Hook"
                      >
                        {copiedKey === copyKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Hook Body */}
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      &ldquo;{hook.hook}&rdquo;
                    </p>

                    {/* Rationale & Psychological Breakdown */}
                    {hook.rationale && (
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-snug">
                        <span className="text-indigo-400/90 font-medium">Why it works:</span>{" "}
                        {hook.rationale}
                      </div>
                    )}

                    {/* Downstream Workflow Actions */}
                    <div className="pt-1.5 flex items-center justify-end gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => triggerHandoff("Reel Script Builder", hook)}
                        className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Send to Script Builder</span>
                      </button>
                      <Link
                        href={`/tools/content-repurposer`}
                        className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-indigo-600/30 text-slate-400 hover:text-indigo-300 border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
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
