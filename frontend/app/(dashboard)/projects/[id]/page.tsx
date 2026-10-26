"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Project, Asset, AIGeneration } from "@/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ContentRepurposerStudio } from "@/components/tools/content-repurposer-studio";
import {
  FolderKanban,
  Wand2,
  FileText,
  History,
  Copy,
  Check,
  Clock,
  Sparkles,
  Layers,
  Share2,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generations, setGenerations] = useState<AIGeneration[]>([]);
  const [activeTab, setActiveTab] = useState<"repurpose" | "assets" | "generations" | "tools">("repurpose");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [projData, assetsData, gensData] = await Promise.all([
        api.projects.get(projectId),
        api.projects.getAssets(projectId),
        api.projects.getGenerations(projectId),
      ]);
      setProject(projData);
      setAssets(assetsData);
      setGenerations(gensData);
    } catch (err: any) {
      console.error("Failed to load workspace data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Workspace" }]}>
        <div className="py-24 text-center text-slate-500 text-xs">
          <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          Loading workspace...
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout breadcrumbs={[{ label: "Projects", href: "/projects" }, { label: "Workspace" }]}>
        <div className="py-20 text-center text-slate-400">
          <p>Project not found or you do not have permission to view it.</p>
          <Link href="/projects" className="text-indigo-400 text-sm mt-3 inline-block font-semibold">
            &larr; Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: project.name },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Workspace Banner */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Project Workspace
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(project.created_at)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              {project.description && (
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Assets Saved</span>
                <span className="text-lg font-bold text-white">{assets.length}</span>
              </div>
              <div className="h-8 w-px bg-slate-800 mx-1" />
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Generations</span>
                <span className="text-lg font-bold text-white">{generations.length}</span>
              </div>
            </div>
          </div>

          {/* Workspace Tabs Navigation */}
          <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-800/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab("repurpose")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "repurpose"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Content Repurposer</span>
            </button>

            <button
              onClick={() => setActiveTab("assets")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "assets"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Project Assets ({assets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("generations")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "generations"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Generations History ({generations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("tools")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "tools"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>AI Modules</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Content Repurposer Studio */}
        {activeTab === "repurpose" && (
          <ContentRepurposerStudio
            initialProjectId={project.id}
            onGenerationComplete={() => loadData()}
          />
        )}

        {/* Tab 2: Project Assets */}
        {activeTab === "assets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Project Assets</h2>
              <span className="text-xs text-slate-500">
                {assets.length} platform outputs generated for this project
              </span>
            </div>

            {assets.length === 0 ? (
              <div className="p-12 text-center bg-[#0f172a] border border-slate-800 rounded-2xl space-y-3">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  No assets saved yet. Use the Content Repurposer tab to generate platform-specific
                  content.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            {asset.type}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                            {asset.title}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(asset.content || "", asset.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedId === asset.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-xs text-slate-300 whitespace-pre-wrap line-clamp-6 pt-2 font-sans leading-relaxed">
                        {asset.content}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Saved {formatDate(asset.created_at)}</span>
                      <span>Asset ID: {asset.id.slice(0, 8)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Generations History */}
        {activeTab === "generations" && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Generations Audit Log</h2>
            {generations.length === 0 ? (
              <div className="p-12 text-center bg-[#0f172a] border border-slate-800 rounded-2xl text-xs text-slate-500">
                No generations recorded yet for this project.
              </div>
            ) : (
              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-xl">
                {generations.map((gen) => (
                  <div key={gen.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white capitalize">
                          {gen.tool.replace("-", " ")}
                        </span>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                          {gen.provider} / {gen.model}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Input length: {gen.input_metadata?.content_length || "N/A"} chars ·
                        Platforms: {(gen.input_metadata?.platforms || []).join(", ")}
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-slate-300 font-semibold">
                        Tokens: {gen.token_usage?.total_tokens ?? "Recorded"}
                      </div>
                      <div className="text-[10px] text-slate-500">{formatDate(gen.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: All AI Modules */}
        {activeTab === "tools" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Creator AI Suite Modules</h2>
              <span className="text-xs text-slate-400">Roadmap to Unified Creator Suite</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0f172a] border border-indigo-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    Live (Phase 1)
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Content Repurposer</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-platform asset generator for LinkedIn, X, Instagram, and YouTube.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("repurpose")}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  Use Tool
                </button>
              </div>

              {[
                { title: "Content Idea Generator", desc: "Generate viral niche topics, trends, and content calendars." },
                { title: "Hook Generator", desc: "High-retention video and post hooks based on proven viral patterns." },
                { title: "Reel Script Builder", desc: "Structured video scripts with camera cues and B-roll guidance." },
                { title: "Creator Research Assistant", desc: "Trend scraping and competitor analysis intelligence." },
                { title: "Caption Assistant", desc: "Hashtag clusters, call-to-actions, and platform formatting." },
                { title: "CTA Generator", desc: "High-converting bio, lead magnet, and conversion links." },
              ].map((mod, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#0f172a]/60 border border-slate-800 shadow-md space-y-3 opacity-70"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                      Phase 2 / Coming Soon
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">{mod.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{mod.desc}</p>
                  </div>
                  <button
                    disabled
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800/80 text-slate-500 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
