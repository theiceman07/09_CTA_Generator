"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CreatorResearchResponse } from "@/types";
import {
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  FolderKanban,
  Compass,
  Layers,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from "lucide-react";

interface CreatorResearchAssistantStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: CreatorResearchResponse) => void;
}

const SAMPLE_INPUT = {
  topic: "Edge Computing & TinyML IoT Sensors for Remote Environmental Monitoring",
  research_depth: "Comprehensive Deep-Dive",
  target_audience: "Embedded engineers, hardware founders, and IoT makers",
  creator_context: "Hands-on builder channel focused on transparent failure post-mortems and open-source schematics",
  provided_source_text: "ESP32 dual core 240MHz, analog ADC noise mitigation, sleep duty cycles for solar cells.",
};

const DEPTH_OPTIONS = [
  "Comprehensive Deep-Dive",
  "Rapid Overview",
  "Competitor Whitespace",
  "Technical Teardown",
];

export function CreatorResearchAssistantStudio({
  initialProjectId,
  onGenerationComplete,
}: CreatorResearchAssistantStudioProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [researchDepth, setResearchDepth] = useState("Comprehensive Deep-Dive");
  const [targetAudience, setTargetAudience] = useState("");
  const [creatorContext, setCreatorContext] = useState("");
  const [providedSourceText, setProvidedSourceText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreatorResearchResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
        if (!selectedProjectId && data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err: any) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, [selectedProjectId]);

  const loadSample = () => {
    setTopic(SAMPLE_INPUT.topic);
    setResearchDepth(SAMPLE_INPUT.research_depth);
    setTargetAudience(SAMPLE_INPUT.target_audience);
    setCreatorContext(SAMPLE_INPUT.creator_context);
    setProvidedSourceText(SAMPLE_INPUT.provided_source_text);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!topic.trim()) {
      setError("Please provide a topic or technology to research.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<CreatorResearchResponse>(
        "/api/v1/tools/creator-research/generate",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            topic: topic.trim(),
            research_depth: researchDepth,
            target_audience: targetAudience.trim() || undefined,
            creator_context: creatorContext.trim() || undefined,
            provided_source_text: providedSourceText.trim() || undefined,
          }),
        }
      );

      setResult(data);
      if (onGenerationComplete) onGenerationComplete(data);
    } catch (err: any) {
      setError(err?.message || "Failed to generate creator research report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Creator Research Assistant</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Conduct in-depth domain breakdowns, audience sentiment mapping, and competitor whitespace teardowns.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-medium transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Hardware Sample
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Research Generation Failed</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Project Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-slate-400" /> Project Scope
                  </span>
                  <Link href="/projects" className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline">
                    + New
                  </Link>
                </span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-slate-400" /> Topic, Technology, or Competitor
                </span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Edge AI with TinyML on Microcontrollers..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            {/* Research Depth */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Research Depth
              </label>
              <select
                value={researchDepth}
                onChange={(e) => setResearchDepth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                {DEPTH_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Target Audience (Optional)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Embedded software developers, makers"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Raw Notes / Papers */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Reference Notes or Sources (Optional)
                </span>
              </label>
              <textarea
                value={providedSourceText}
                onChange={(e) => setProvidedSourceText(e.target.value)}
                placeholder="Paste raw documentation excerpts, research paper abstracts, or telemetry findings to ground the analysis..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim() || !selectedProjectId}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Conducting Intelligence Teardown...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Synthesize Research Intelligence
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Executive Brief */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Executive Research Brief
                  </h3>
                  <button
                    onClick={() => handleCopy(result.executive_brief, "exec-brief")}
                    className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "exec-brief" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Brief</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{result.executive_brief}</p>
              </div>

              {/* Thematic Pillars */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Technical & Domain Pillars
                </h3>
                {result.technical_pillars.map((sec, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                    <h4 className="font-semibold text-base text-white">{sec.heading}</h4>
                    <ul className="space-y-1.5 list-disc list-inside text-sm text-slate-400">
                      {sec.key_findings.map((f, fIdx) => (
                        <li key={fIdx} className="leading-snug">
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-slate-800 text-xs text-emerald-400 font-medium">
                      💡 Creator Implication: {sec.content_implications}
                    </div>
                  </div>
                ))}
              </div>

              {/* Competitor Whitespace */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Competitor Whitespace & Angles
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {result.competitor_landscape.map((c, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
                      <div className="text-sm font-semibold text-white">{c.angle_title}</div>
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-rose-400">Market Gap:</span> {c.critique_or_gap}
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">
                        ✨ Differentiation Strategy: {c.recommended_differentiation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Content Recommendations */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Recommended Content Angles
                </h3>
                <div className="space-y-2">
                  {result.content_angle_recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-sm flex items-center justify-between gap-3"
                    >
                      <span className="text-slate-300">{rec}</span>
                      <Link
                        href={`/tools/hook-generator?content=${encodeURIComponent(rec)}&projectId=${selectedProjectId}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
                      >
                        Hook It <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cautions and Misconceptions */}
              {result.cautions_and_misconceptions.length > 0 && (
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Grounding Cautions & Myths to Debunk
                  </h4>
                  <ul className="text-xs text-amber-200/90 space-y-1 list-disc list-inside">
                    {result.cautions_and_misconceptions.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No Research Synthesized Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Enter a topic, technology, or niche on the left to extract competitor white space, domain pillars, and actionable angles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
