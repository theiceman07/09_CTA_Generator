"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, AutonomousPipelineResponse } from "@/types";
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Copy,
  Check,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const SAMPLE_SEED = {
  source_notes: "Research indicates industrial methane leaks in grain silos cause $40M annually in preventable inventory loss. Standard wired telemetry costs $15,000 per silo. A mesh of ESP32 edge microcontrollers with low-power LoRaWAN nodes brings the deployment cost down by 85%.",
  automation_depth: "Full Production Pass",
};

export function AutonomousContentPipelineStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [sourceInput, setSourceInput] = useState(searchParams.get("seed") || "");
  const [automationDepth, setAutomationDepth] = useState("Full Production Pass");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AutonomousPipelineResponse | null>(null);
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
    setSourceInput(SAMPLE_SEED.source_notes);
    setAutomationDepth(SAMPLE_SEED.automation_depth);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !sourceInput.trim()) {
      setError("Please select a project and provide source research/seed notes.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<AutonomousPipelineResponse>(
        "/api/v1/tools/autonomous-content-pipeline/run",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            source_input: sourceInput.trim(),
            automation_depth: automationDepth,
          }),
        }
      );

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to execute autonomous pipeline.");
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
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Autonomous Pipeline</h2>
              <p className="text-xs text-slate-400">
                End-to-end multi-stage content synthesis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Seed</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRun} className="space-y-4">
          {/* Project Scope */}
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

          {/* Source Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Source Notes / Research / Thesis *
              </label>
              <span className="text-[11px] text-slate-500">
                {sourceInput.length} chars
              </span>
            </div>
            <textarea
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              placeholder="Enter core thesis, technical takeaways, or video transcript..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed font-mono text-xs"
              required
            />
          </div>

          {/* Automation Depth */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Automation Depth
            </label>
            <div className="relative">
              <select
                value={automationDepth}
                onChange={(e) => setAutomationDepth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="Full Production Pass">Full Production Pass (All Stages)</option>
                <option value="Express Draft">Express Draft</option>
                <option value="Heavy Research Focus">Heavy Research Focus</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !sourceInput.trim() || !selectedProjectId}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing Autonomous Pipeline...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" /> Run Autonomous Pipeline
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
            <h4 className="text-sm font-semibold text-white">Running Autonomous Pipeline Stages</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Synthesizing research, generating hooks, constructing production script, and verifying quality...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Pipeline Status Banner */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Pipeline: {result.pipeline_id}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Status: {result.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{result.output_bundle.title}</h3>

              {/* Audit Verdict */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{result.audit_verdict}</span>
              </div>

              {/* Stages list */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Stages Executed:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.stages_completed.map((st, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Script */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Autonomous Script Output
                </span>
                <button
                  onClick={() => handleCopy(result.output_bundle.primary_script, "script")}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === "script" ? (
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
              <pre className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs whitespace-pre-wrap leading-relaxed text-slate-300 font-mono">
                {result.output_bundle.primary_script}
              </pre>
            </div>

            {/* Caption & Hashtags */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Autonomous Caption & Hashtags
                </span>
                <button
                  onClick={() => handleCopy(result.output_bundle.caption, "caption")}
                  className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === "caption" ? (
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
                {result.output_bundle.caption}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.output_bundle.hashtags.map((h, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700/60"
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No Pipeline Run Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Provide research or source inputs on the left to trigger autonomous production through research, ideation, scripting, and auditing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
