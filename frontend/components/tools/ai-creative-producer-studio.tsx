"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CreativeProducerResponse } from "@/types";
import {
  Clapperboard,
  Sparkles,
  Copy,
  Check,
  FolderKanban,
  AlertCircle,
  Camera,
  Sliders,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const SAMPLE_INPUT = {
  creative_concept:
    "Documentary-style investigation into how open-source hardware prototyping is replacing multi-million-dollar industrial telemetry systems. Following the real-world deployment of edge methane sensor nodes across rural farms.",
  aesthetic_vibe: "Cinematic Industrial Documentary",
  primary_deliverable: "12-min YouTube Feature Documentary + 4 Vertical Shorts",
};

const VIBES = [
  "Cinematic Industrial Documentary",
  "Moody Cyberpunk Laboratory",
  "Clean Apple-Style Minimalist Tech",
  "Gritty DIY Maker Garage",
  "High-Pace Kinetic Vlog",
];

export function AICreativeProducerStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [concept, setConcept] = useState(searchParams.get("concept") || "");
  const [vibe, setVibe] = useState("Cinematic Industrial Documentary");
  const [deliverables, setDeliverables] = useState("12-min YouTube Feature Documentary + 4 Vertical Shorts");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreativeProducerResponse | null>(null);
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
    setConcept(SAMPLE_INPUT.creative_concept);
    setVibe(SAMPLE_INPUT.aesthetic_vibe);
    setDeliverables(SAMPLE_INPUT.primary_deliverable);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !concept.trim()) {
      setError("Please select a project and provide a creative concept.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<CreativeProducerResponse>(
        "/api/v1/tools/ai-creative-producer/produce",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            creative_concept: concept.trim(),
            aesthetic_vibe: vibe,
            primary_deliverable: deliverables,
          }),
        }
      );

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to produce creative direction.");
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
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Creative Producer</h2>
              <p className="text-xs text-slate-400">
                Executive creative direction & production planning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadSample}
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

        <form onSubmit={handleProduce} className="space-y-4">
          {/* Project Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Project Workspace
              </label>
              <Link href="/projects" className="text-[11px] text-indigo-400 hover:underline">
                + New
              </Link>
            </div>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
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

          {/* Creative Concept */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Creative Concept / Project Scope *
              </label>
              <span className="text-[11px] text-slate-500">
                {concept.length} chars
              </span>
            </div>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Describe your video narrative, series ambition, or production concept..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
              required
            />
          </div>

          {/* Aesthetic Vibe */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Aesthetic Vibe & Visual Direction
            </label>
            <div className="relative">
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {VIBES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <Sliders className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Primary Deliverables */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Deliverables
            </label>
            <input
              type="text"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="e.g. 12-min YouTube Feature Documentary + 4 Vertical Shorts"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !concept.trim() || !selectedProjectId}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Directing Production Package...
              </>
            ) : (
              <>
                <Clapperboard className="w-4 h-4" /> Produce Creative Package
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Output Panel */}
      <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <h4 className="text-sm font-semibold text-white">Synthesizing Creative Direction</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Directing camera kinematics, lighting color grades, and shot blueprints via Gemini and LangChain...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Header / Package Overview */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Executive Creative Direction
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Project
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {result.production_package_title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.creative_vision}
              </p>
            </div>

            {/* Visual & Audio Style Guide */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Visual & Audio Style Guide
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="font-semibold text-slate-400 block mb-1">
                    Color Grading:
                  </span>
                  <p className="text-slate-200">{result.visual_style_guide.color_grading}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="font-semibold text-slate-400 block mb-1">
                    Camera Movement:
                  </span>
                  <p className="text-slate-200">
                    {result.visual_style_guide.camera_movement}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60">
                  <span className="font-semibold text-slate-400 block mb-1">
                    Audio Design:
                  </span>
                  <p className="text-slate-200">{result.visual_style_guide.audio_design}</p>
                </div>
              </div>
            </div>

            {/* Production Shot List */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" /> Production Shot List ({result.shot_list.length} shots)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(result.shot_list, null, 2), "shots")}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === "shots" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Shot List
                    </>
                  )}
                </button>
              </div>
              <div className="space-y-2.5">
                {result.shot_list.map((shot) => (
                  <div
                    key={shot.shot_number}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs space-y-1 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white">
                        Shot #{shot.shot_number}: {shot.shot_type}
                      </span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                        {shot.equipment_recommendation}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{shot.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Release Distribution Strategy */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs space-y-1">
              <span className="font-semibold uppercase tracking-wider text-indigo-400">
                🚀 Release Distribution Sequencing:
              </span>
              <p className="text-slate-300 leading-relaxed">{result.distribution_strategy}</p>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Clapperboard className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No Production Package Planned</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Enter your video concept on the left to design a comprehensive visual style guide, cinematography shot list, and equipment plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
