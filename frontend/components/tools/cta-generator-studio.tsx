"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CTAGeneratorResponse, CTAItem } from "@/types";
import {
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  FolderKanban,
  Target,
  Share2,
  Bookmark,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

interface CTAGeneratorStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: CTAGeneratorResponse) => void;
}

const SAMPLE_INPUT = {
  content: "Autonomous IoT Methane Monitoring System built using ESP32 with edge ML inference and real-time telemetry",
  caption: "Preventing industrial gas leaks with a $5 microcontroller. Here is the full wiring and sensor calibration breakdown.",
  hook: "Can an ESP32 microcontroller detect industrial methane before an alarm triggers?",
  platform: "Instagram",
  goal: "Engagement & Comments",
  tone: "Engaging",
  target_audience: "Embedded developers, IoT engineers, and hardware builders",
  count: 3,
};

const PLATFORMS = ["Instagram", "LinkedIn", "X", "YouTube", "TikTok", "Newsletter"];
const GOALS = [
  "Engagement & Comments",
  "Saves & Bookmarks",
  "Profile Follow",
  "Link in Bio / Website Click",
  "Direct Message",
  "Lead Magnet Download",
];
const TONES = ["Engaging", "Direct", "Professional", "Urgent", "Casual", "Provocative"];

export function CTAGeneratorStudio({
  initialProjectId,
  onGenerationComplete,
}: CTAGeneratorStudioProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [content, setContent] = useState(searchParams.get("content") || "");
  const [caption, setCaption] = useState(searchParams.get("caption") || "");
  const [hook, setHook] = useState(searchParams.get("hook") || "");
  const [platform, setPlatform] = useState(searchParams.get("platform") || "Instagram");
  const [goal, setGoal] = useState("Engagement & Comments");
  const [tone, setTone] = useState("Engaging");
  const [targetAudience, setTargetAudience] = useState("");
  const [count, setCount] = useState(3);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CTAGeneratorResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data);
        if (!selectedProjectId && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, []);

  const handleLoadSample = () => {
    setContent(SAMPLE_INPUT.content);
    setCaption(SAMPLE_INPUT.caption);
    setHook(SAMPLE_INPUT.hook);
    setPlatform(SAMPLE_INPUT.platform);
    setGoal(SAMPLE_INPUT.goal);
    setTone(SAMPLE_INPUT.tone);
    setTargetAudience(SAMPLE_INPUT.target_audience);
    setCount(SAMPLE_INPUT.count);
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!content.trim()) {
      setError("Please provide core content or topic.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<CTAGeneratorResponse>("/api/v1/tools/ctas/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          content: content.trim(),
          caption: caption.trim() || undefined,
          hook: hook.trim() || undefined,
          platform,
          goal,
          tone,
          target_audience: targetAudience.trim() || undefined,
          count,
        }),
      });

      setResult(resp);
      if (onGenerationComplete) onGenerationComplete(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to generate calls to action.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Configure CTA Parameters
            </h2>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Load Sample
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Project Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Core Content */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Core Topic / Post Context *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="What is your post or video about? (e.g. ESP32 Methane Sensor Build)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Platform & Goal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Primary Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tone & Count */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Count ({count})
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 mt-2"
                />
              </div>
            </div>

            {/* Optional Hook / Caption */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Optional Workflow Handoff
              </span>
              <div>
                <input
                  type="text"
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  placeholder="Existing Hook (optional)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Synthesizing CTAs...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate High-Converting CTAs
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Output Panel */}
      <div className="lg:col-span-7 space-y-4">
        {result ? (
          <div className="space-y-4">
            {/* Strategy Banner */}
            <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Placement & Conversion Strategy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.placement_strategy}
              </p>
            </div>

            {/* CTA Cards */}
            <div className="space-y-3">
              {result.ctas.map((item, idx) => {
                const isRecommended = item.text === result.recommended_cta;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      isRecommended
                        ? "bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-950/30"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">
                          Option {idx + 1}
                        </span>
                        {isRecommended && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                            Recommended
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          {item.placement}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.text, idx)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs font-medium text-white mb-2 leading-relaxed">
                      "{item.text}"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.why_it_works}</span>
                      <span className="text-slate-500 shrink-0 ml-2">
                        {item.character_count || item.text.length} chars
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <Target className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No CTAs Generated Yet</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Configure your topic, target platform, and conversion goal on the left to generate psychological call-to-actions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
