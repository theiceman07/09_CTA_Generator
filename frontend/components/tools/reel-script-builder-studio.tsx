"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ReelScriptGeneratorResponse, ReelScriptOutput, ReelScene } from "@/types";
import {
  Film,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderKanban,
  FileCheck,
  Zap,
  Target,
  Clock,
  Video,
  Mic,
  Type,
  ChevronDown,
  ChevronUp,
  Share2,
  Terminal,
} from "lucide-react";

interface ReelScriptBuilderStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: ReelScriptGeneratorResponse) => void;
}

const SAMPLE_REEL_INPUT = {
  topic: "Building an Autonomous IoT Methane Monitoring System using ESP32 and Edge AI",
  hook: "Can a $5 microcontroller really detect industrial methane leaks faster than a cloud server?",
  audience: "Makers, Embedded Engineers, and Hardware Innovators",
  platform: "instagram",
  tone: "engaging",
  duration: "30-60",
  content_goal: "educate",
};

const PLATFORMS = [
  { id: "all", label: "All Platforms" },
  { id: "instagram", label: "Instagram Reels" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "tiktok", label: "TikTok" },
];

const TONES = [
  { id: "engaging", label: "Engaging" },
  { id: "educational", label: "Educational" },
  { id: "storytelling", label: "Storytelling" },
  { id: "funny", label: "Funny" },
  { id: "controversial", label: "Controversial" },
  { id: "bold", label: "Bold" },
];

const DURATIONS = [
  { id: "15-30", label: "15-30s" },
  { id: "30-60", label: "30-60s (Standard)" },
  { id: "60-90", label: "60-90s" },
];

const GOALS = [
  { id: "educate", label: "Educate" },
  { id: "entertain", label: "Entertain" },
  { id: "inspire", label: "Inspire" },
  { id: "promote", label: "Promote" },
  { id: "convert", label: "Convert" },
];

export function ReelScriptBuilderStudio({
  initialProjectId,
  onGenerationComplete,
}: ReelScriptBuilderStudioProps) {
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "");

  // Form State
  const [topic, setTopic] = useState<string>("");
  const [hook, setHook] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram");
  const [selectedTone, setSelectedTone] = useState<string>("engaging");
  const [selectedDuration, setSelectedDuration] = useState<string>("30-60");
  const [selectedGoal, setSelectedGoal] = useState<string>("educate");

  // Output & UI State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReelScriptGeneratorResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showTrace, setShowTrace] = useState<boolean>(true);
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);

  // Check URL query params for cross-application handoffs
  useEffect(() => {
    if (!searchParams) return;
    const queryTopic = searchParams.get("topic");
    const queryHook = searchParams.get("hook");
    const queryIdea = searchParams.get("idea");

    if (queryTopic || queryHook || queryIdea) {
      if (queryTopic) setTopic(queryTopic);
      else if (queryIdea) setTopic(queryIdea);

      if (queryHook) {
        setHook(queryHook);
        setHandoffNotice("Imported opening hook directly from Hook Generator.");
      } else {
        setHandoffNotice("Imported topic premise directly from Content Idea Generator.");
      }
    }
  }, [searchParams]);

  // Load Projects for optional project asset association
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
    setTopic(SAMPLE_REEL_INPUT.topic);
    setHook(SAMPLE_REEL_INPUT.hook);
    setAudience(SAMPLE_REEL_INPUT.audience);
    setSelectedPlatform(SAMPLE_REEL_INPUT.platform);
    setSelectedTone(SAMPLE_REEL_INPUT.tone);
    setSelectedDuration(SAMPLE_REEL_INPUT.duration);
    setSelectedGoal(SAMPLE_REEL_INPUT.content_goal);
    setHandoffNotice(null);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please provide a topic or concept premise to generate a reel script.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await api.tools.generateReelScript({
        topic: topic.trim(),
        hook: hook.trim() || undefined,
        audience: audience.trim() || undefined,
        platform: selectedPlatform,
        tone: selectedTone,
        duration: selectedDuration,
        content_goal: selectedGoal,
        project_id: selectedProjectId || undefined,
      });

      setResult(response);
      if (onGenerationComplete) {
        onGenerationComplete(response);
      }
    } catch (err: any) {
      console.error("Reel script generation error:", err);
      setError(err?.message || "Failed to generate reel script. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getFullScriptMarkdown = (script: ReelScriptOutput): string => {
    let md = `# ${script.title}\n\n`;
    md += `Target Duration: ${script.duration}\n\n`;
    md += `## Hook (0 - 5 s)\n"${script.hook}"\n\n`;
    md += `## Scene Breakdown\n`;
    script.scenes.forEach((sc) => {
      md += `\n### Scene ${sc.scene_number} (${sc.timestamp})\n`;
      md += `Visual: ${sc.visual_direction}\n`;
      md += `Dialogue: "${sc.dialogue}"\n`;
      if (sc.on_screen_text) md += `On-Screen Text: ${sc.on_screen_text}\n`;
    });
    md += `\n## Call to Action (50 - 60 s)\n"${script.cta}"\n\n`;
    if (script.caption_suggestion) {
      md += `## Suggested Caption\n${script.caption_suggestion}\n`;
    }
    return md;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration & Inputs Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Reel Script Builder</h2>
              <p className="text-xs text-slate-400">
                Craft structured short-form scripts with visual direction, pacing, and hooks
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

        {/* Project Selector */}
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
              <option value="">No Project (Ad-Hoc Script Generation)</option>
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
              Topic or Video Premise *
            </label>
            <span className="text-[11px] text-slate-500">{topic.length} chars</span>
          </div>
          <textarea
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Autonomous IoT Methane Monitoring System using ESP32 and Edge AI..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Pre-Existing Hook (Cross-app handoff input) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Opening Hook / Angle (Optional)
            </label>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Hook Generator Handoff
            </span>
          </div>
          <input
            type="text"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="e.g. Can a $5 microcontroller detect methane leaks faster than a cloud server?"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
            placeholder="e.g. Embedded Engineers, Makers, IoT Startups"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Platform & Duration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Platform */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {DURATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone Profile & Content Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tone Profile
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Content Goal
            </label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {GOALS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
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
              <span>Generating Reel Script with Gemini 3.1...</span>
            </>
          ) : (
            <>
              <Film className="w-4 h-4" />
              <span>Generate Reel Script</span>
            </>
          )}
        </button>
      </div>

      {/* Output Column */}
      <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[640px]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Generated Video Script</h3>
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
              <Film className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">Ready to Build Your Reel</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Provide your topic or premise, optionally paste a hook from Hook Generator,
              then click &quot;Generate Reel Script&quot; to build a scene-by-scene short-form script.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-5 pt-4 overflow-y-auto max-h-[720px] pr-1">
            {/* Title & Metadata Header */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {result.script.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 pt-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {result.script.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {result.platform.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {result.tone.toUpperCase()}
                    </span>
                    {result.script.estimated_word_count && (
                      <span className="text-slate-400">
                        ~{result.script.estimated_word_count} words
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(getFullScriptMarkdown(result.script), "full-script")}
                  className="shrink-0 text-xs text-indigo-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 transition-all cursor-pointer"
                  title="Copy Full Script (Markdown)"
                >
                  {copiedKey === "full-script" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Agent Planning Trace Accordion (Preserved from 05_Reel_Script_Builder) */}
            {result.script.thoughts && result.script.thoughts.length > 0 && (
              <div className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTrace(!showTrace)}
                  className="w-full px-3.5 py-2 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-mono">Agent Planning Trace ({result.script.thoughts.length} steps)</span>
                  </div>
                  {showTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showTrace && (
                  <div className="px-3.5 pb-3 font-mono text-[11px] text-slate-400 space-y-1.5 border-t border-slate-800/60 pt-2">
                    {result.script.thoughts.map((th, i) => (
                      <div key={i} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-indigo-400 select-none">▸</span>
                        <span>{th}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Block 1: Hook (0 - 5 s) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
                  Hook  0 - 5 s
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(result.script.hook, "hook-only")}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "hook-only" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKey === "hook-only" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                &ldquo;{result.script.hook}&rdquo;
              </p>
            </div>

            {/* Block 2: Scene-by-Scene Timeline Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Timeline & Scene Direction ({result.script.scenes.length} Scenes)
                </h5>
              </div>

              <div className="space-y-3">
                {result.script.scenes.map((scene, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    {/* Scene Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-400">
                          Scene {scene.scene_number}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                          {scene.timestamp}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            `Scene ${scene.scene_number} (${scene.timestamp})\nVisual: ${scene.visual_direction}\nDialogue: "${scene.dialogue}"`,
                            `scene-${idx}`
                          )
                        }
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `scene-${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedKey === `scene-${idx}` ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    {/* Visual Direction */}
                    <div className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-indigo-400 font-medium">Visual:</span>{" "}
                        {scene.visual_direction}
                      </div>
                    </div>

                    {/* Spoken Dialogue */}
                    <div className="flex items-start gap-2 text-xs text-white bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-emerald-400 font-medium">Audio:</span>{" "}
                        &ldquo;{scene.dialogue}&rdquo;
                      </div>
                    </div>

                    {/* On-Screen Text */}
                    {scene.on_screen_text && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Type className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>On-Screen Text: &quot;{scene.on_screen_text}&quot;</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Block 3: CTA (50 - 60 s) */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 to-slate-900 border border-violet-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-600 text-white">
                  CTA  50 - 60 s
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(result.script.cta, "cta-only")}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === "cta-only" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedKey === "cta-only" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                &ldquo;{result.script.cta}&rdquo;
              </p>
            </div>

            {/* Suggested Caption */}
            {result.script.caption_suggestion && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Suggested Caption & Hashtags
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.script.caption_suggestion || "", "caption-only")}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "caption-only" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === "caption-only" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {result.script.caption_suggestion}
                </p>
              </div>
            )}

            {/* Downstream Cross-App Workflow Handoff Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">Continue Workflow:</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/tools/caption-assistant?topic=${encodeURIComponent(
                    `Reel: ${result.script.title}`
                  )}&hook=${encodeURIComponent(result.script.hook)}&platform=Instagram`}
                  className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-white border border-pink-500/30 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Craft Social Captions</span>
                </Link>
                <Link
                  href={`/tools/content-repurposer?text=${encodeURIComponent(
                    `Reel Script: ${result.script.title}\n\nHook: ${result.script.hook}\n\nBody: ${result.script.body}\n\nCTA: ${result.script.cta}`
                  )}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Repurpose for Text Feeds</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
