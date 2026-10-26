"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, WorkspaceProjectOverview, WorkspaceAssetItem } from "@/types";
import {
  FolderKanban,
  FileText,
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Check,
  Zap,
  ExternalLink,
  Brain,
  Video,
  MessageSquare,
  Compass,
} from "lucide-react";

export function CreatorWorkspaceStudio({ initialProjectId }: { initialProjectId?: string }) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [overview, setOverview] = useState<WorkspaceProjectOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!selectedProjectId) return;
    async function fetchOverview() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.request<WorkspaceProjectOverview>(
          `/api/v1/tools/workspace/projects/${selectedProjectId}/overview`
        );
        setOverview(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load project workspace overview.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOverview();
  }, [selectedProjectId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FolderKanban className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Creator Workspace</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Unified production hub connecting your project assets, saved memories, scripts, and multi-tool pipelines.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl border border-slate-700/80 bg-slate-900 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.name}
              </option>
            ))}
          </select>
          <Link
            href="/projects"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
          >
            Manage Projects
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {overview && (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-sm">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Total Assets
              </span>
              <div className="text-2xl font-bold mt-1 text-indigo-400">{overview.total_assets}</div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-sm">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Generations
              </span>
              <div className="text-2xl font-bold mt-1 text-white">
                {overview.recent_generations_count}
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-sm">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Target Audience
              </span>
              <div className="text-sm font-medium mt-1 truncate text-slate-300">
                {overview.target_audience || "General Audience"}
              </div>
            </div>
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-sm">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Project Tone
              </span>
              <div className="text-sm font-medium mt-1 truncate text-slate-300">
                {overview.tone || "Default Engaging"}
              </div>
            </div>
          </div>

          {/* Quick Production Launchpad */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Quick Workflow Launchpad
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <Link
                href={`/tools/hook-generator?projectId=${selectedProjectId}`}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">Hook Studio</span>
              </Link>
              <Link
                href={`/tools/reel-script-builder?projectId=${selectedProjectId}`}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <Video className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">Reel Script</span>
              </Link>
              <Link
                href={`/tools/caption-assistant?projectId=${selectedProjectId}`}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">Captions</span>
              </Link>
              <Link
                href={`/tools/cta-generator?projectId=${selectedProjectId}`}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">CTAs</span>
              </Link>
              <Link
                href={`/tools/creator-research-assistant?projectId=${selectedProjectId}`}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <Compass className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">Research</span>
              </Link>
              <Link
                href={`/tools/creator-second-brain?projectId=${selectedProjectId}`}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-700 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <Brain className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">Second Brain</span>
              </Link>
            </div>
          </div>

          {/* Project Assets Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" /> Project Assets & Generations
              </h2>
              <span className="text-xs text-slate-400">
                Showing {overview.recent_assets.length} items
              </span>
            </div>

            {overview.recent_assets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overview.recent_assets.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-slate-800 bg-[#0f172a] space-y-3 flex flex-col justify-between hover:border-slate-700/80 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                          {item.type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mt-2 text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {item.content_snippet}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopy(item.content_snippet, item.id)}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </>
                        )}
                      </button>

                      {/* Tool Handoff Shortcuts */}
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/tools/caption-assistant?content=${encodeURIComponent(item.content_snippet)}&projectId=${selectedProjectId}`}
                          className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-0.5"
                        >
                          To Caption <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link
                          href={`/tools/cta-generator?content=${encodeURIComponent(item.content_snippet)}&projectId=${selectedProjectId}`}
                          className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-0.5"
                        >
                          To CTA <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center bg-slate-900/30 space-y-2">
                <p className="text-sm font-medium text-white">No assets generated in this project yet.</p>
                <p className="text-xs text-slate-400">
                  Use any tool from the launchpad above to begin generating grounded content.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
