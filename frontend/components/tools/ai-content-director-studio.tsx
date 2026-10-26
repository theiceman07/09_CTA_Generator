"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ContentDirectorResponse } from "@/types";
import {
  Sparkles,
  GitFork,
  Video,
  Copy,
  Check,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const SAMPLE_CAMPAIGN = {
  campaign_focus: "Autonomous IoT Methane Monitoring Network for Agricultural Storage Facilities",
  primary_platform: "LinkedIn",
  campaign_goal: "Lead Generation",
  target_audience: "Industrial Safety Directors and Agritech Hardware Engineers",
};

const PLATFORMS = ["LinkedIn", "Instagram", "X (Twitter)", "YouTube"];
const GOALS = ["Lead Generation", "Brand Awareness", "Audience Engagement", "Newsletter Growth"];

export function AIContentDirectorStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [platform, setPlatform] = useState("LinkedIn");
  const [goal, setGoal] = useState("Lead Generation");
  const [targetAudience, setTargetAudience] = useState("");

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
    setTopic(SAMPLE_CAMPAIGN.campaign_focus);
    setPlatform(SAMPLE_CAMPAIGN.primary_platform);
    setGoal(SAMPLE_CAMPAIGN.campaign_goal);
    setTargetAudience(SAMPLE_CAMPAIGN.target_audience);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !topic.trim()) {
      setError("Please select a project and provide a campaign topic.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<ContentDirectorResponse>(
        "/api/v1/tools/ai-content-director/direct",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            campaign_focus: topic.trim(),
            primary_platform: platform,
            campaign_goal: goal,
            target_audience: targetAudience.trim() || undefined,
          }),
        }
      );

      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to direct campaign orchestration.");
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
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Content Director</h2>
              <p className="text-xs text-slate-400">
                Autonomous LangGraph campaign orchestration
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

        <form onSubmit={handleDirect} className="space-y-4">
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

          {/* Campaign Focus */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Campaign Focus / Thesis *
              </label>
              <span className="text-[11px] text-slate-500">
                {topic.length} chars
              </span>
            </div>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Edge Anomaly Detection in IoT Hardware for industrial silo facilities..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
              required
            />
          </div>

          {/* Platform & Goal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Primary Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Campaign Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Audience (Optional)
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Embedded developers, technical founders"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || !selectedProjectId}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Directing Multi-Stage LangGraph...
              </>
            ) : (
              <>
                <GitFork className="w-4 h-4" /> Orchestrate Full Campaign
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
            <h4 className="text-sm font-semibold text-white">Directing Multi-Stage Pipeline</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Synthesizing concepts, hooks, vertical short scripts, platform captions, and conversion CTAs...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Campaign Header */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Directed Campaign Package
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Readiness: {result.production_readiness_score}%
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

              {/* Workflow execution path */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  LangGraph Workflow Execution Trace:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.workflow_steps_executed.map((st, idx) => (
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

            {/* Asset Package Breakdown */}
            <div className="grid grid-cols-1 gap-4">
              {/* 1. Core Concept & Hook */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  1. Core Concept & Hook
                </span>
                <div className="text-sm font-semibold text-white">
                  {result.directed_package.concept}
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 italic">
                  &ldquo;{result.directed_package.hook}&rdquo;
                </div>
              </div>

              {/* 2. Short Video Script */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" /> 2. Vertical Reel Script Summary
                  </span>
                  <button
                    onClick={() => handleCopy(result.directed_package.script_summary, "script")}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "script" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Script
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.directed_package.script_summary}
                </p>
              </div>

              {/* 3. Caption & CTA */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    3. Caption & Conversion CTA
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
                        <Copy className="w-3.5 h-3.5" /> Copy Caption
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.directed_package.caption_summary}
                </p>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
                  🎯 Primary CTA: {result.directed_package.primary_cta}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No Campaign Directed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Enter your campaign premise on the left to trigger the multi-step LangGraph workflow across ideation, hooks, scripts, captions, and CTAs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
