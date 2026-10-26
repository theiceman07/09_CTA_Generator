"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ContentDirectorResponse } from "@/types";
import {
  Sparkles,
  Compass,
  Copy,
  Check,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const SAMPLE_GURUVELAH = {
  thesis: "The commoditization of AI-generated content makes authentic engineering provenance and verifiable real-world telemetry the only defensible creator moat.",
  platform: "Substack & LinkedIn",
  philosophical_angle: "First-Principles Technical Authority",
};

const PHILOSOPHIES = [
  "First-Principles Technical Authority",
  "Contrarian Pragmatism",
  "Stoic Craftsmanship",
  "Epistemic Rigor & Provenance",
];

export function AIContentDirectorGuruvelahStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [topic, setTopic] = useState(searchParams.get("thesis") || "");
  const [philosophicalAngle, setPhilosophicalAngle] = useState("First-Principles Technical Authority");
  const [platform, setPlatform] = useState("Substack & LinkedIn");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentDirectorResponse | null>(null);
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
    setTopic(SAMPLE_GURUVELAH.thesis);
    setPlatform(SAMPLE_GURUVELAH.platform);
    setPhilosophicalAngle(SAMPLE_GURUVELAH.philosophical_angle);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !topic.trim()) {
      setError("Please select a project and provide a philosophical thesis.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<ContentDirectorResponse>(
        "/api/v1/tools/ai-content-director-guruvelah/direct",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            campaign_focus: topic.trim(),
            primary_platform: platform,
            campaign_goal: `Guruvelah: ${philosophicalAngle}`,
          }),
        }
      );

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to direct Guruvelah strategy.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Panel */}
      <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Guruvelah Strategy Engine</h2>
              <p className="text-xs text-slate-400">
                First-principles authority & philosophical direction
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
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

        <form onSubmit={handleDirect} className="space-y-4">
          {/* Project Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Project Workspace
              </label>
              <Link href="/projects" className="text-[11px] text-amber-400 hover:underline">
                + New
              </Link>
            </div>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <FolderKanban className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Central Philosophical Thesis */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Central Philosophical Thesis *
              </label>
              <span className="text-[11px] text-slate-500">
                {topic.length} chars
              </span>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What core truth or contrarian insight should this piece investigate?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none leading-relaxed"
              required
            />
          </div>

          {/* Philosophical Strategy Lens */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Philosophical Strategy Lens
            </label>
            <div className="relative">
              <select
                value={philosophicalAngle}
                onChange={(e) => setPhilosophicalAngle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
              >
                {PHILOSOPHIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <Compass className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Target Platform */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Platform
            </label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g. Substack & LinkedIn"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || !selectedProjectId}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Philosophical Strategy...
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" /> Direct Guruvelah Campaign
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 space-y-3">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <h4 className="text-sm font-semibold text-white">Synthesizing Narrative Authority</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Filtering out superficial hooks and aligning foundational principles via Gemini and LangChain...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Guruvelah Strategic Output
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Authority: {result.production_readiness_score}%
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Saved to Project
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{result.campaign_title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.strategic_thesis}
              </p>

              {/* Principles */}
              {result.guruvelah_principles && result.guruvelah_principles.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Applied Editorial Principles:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.guruvelah_principles.map((pr, idx) => (
                      <li key={idx}>{pr}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Package Details */}
            <div className="space-y-3">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Core Thesis & Contrarian Hook
                </span>
                <div className="text-sm font-semibold text-white">{result.directed_package.concept}</div>
                <p className="text-xs italic text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  &ldquo;{result.directed_package.hook}&rdquo;
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Substack / Long-form Caption
                  </span>
                  <button
                    onClick={() => handleCopy(result.directed_package.caption_summary, "cap")}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "cap" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.directed_package.caption_summary}
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">
                  💬 Dialogue Prompt: {result.directed_package.primary_cta}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No Philosophical Strategy Run Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Enter your thesis on the left to synthesize high-authority, grounded narrative direction using the Guruvelah strategy engine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
