"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { api } from "@/lib/api/client";
import { Project, UsageSummary, AIGeneration } from "@/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import {
  FolderKanban,
  Wand2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

import { APPLICATION_REGISTRY, getApplicationsByCategory } from "@/lib/registry";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<AIGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(APPLICATION_REGISTRY.map((a) => a.category)))];

  const filteredApps = selectedCategory === "All"
    ? APPLICATION_REGISTRY
    : APPLICATION_REGISTRY.filter((a) => a.category === selectedCategory);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projs, usageData] = await Promise.all([
          api.projects.list(),
          api.usage.getSummary(),
        ]);
        setProjects(projs);
        setUsage(usageData);

        // Fetch recent generations from projects if available
        if (projs.length > 0) {
          const gensPromises = projs.slice(0, 3).map((p) => api.projects.getGenerations(p.id));
          const allGens = await Promise.all(gensPromises);
          const flat = allGens.flat().sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setRecentGenerations(flat.slice(0, 5));
        }
      } catch (err: any) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Overview" }]}
      action={{
        label: "New Project",
        onClick: () => setCreateModalOpen(true),
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#13192f] via-[#161c36] to-[#0f172a] border border-slate-800 p-8 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Creator AI Platform — 24 Capabilities</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Welcome back, {user?.name || "Creator"}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Standardized creator workspace powered exclusively by Google Gemini (gemini-3.1-flash-lite)
              and LangChain. Repurpose, ideate, script, and distribute across all your channels.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/tools/content-repurposer"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Launch Content Repurposer (Live)</span>
              </Link>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FolderKanban className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
              <FolderKanban className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active creator workspaces</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">AI Generations</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{usage?.total_generations || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Repurposed campaigns</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Tokens Processed</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {usage?.total_tokens ? usage.total_tokens.toLocaleString() : 0}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Total model tokens used</p>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Platform Capabilities</span>
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">24 / 24</div>
            <p className="text-[11px] text-slate-500 mt-1">Full audit registry mapped</p>
          </div>
        </div>

        {/* 24 Capabilities Registry Section */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Creator AI Application Registry</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All 24 standardized application capabilities across the unified SaaS suite
              </p>
            </div>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 24 Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {app.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        app.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {app.status === "active" ? "● Live" : "Phase 2 Integration"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {app.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-800/60 mt-4 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span>{app.isAiPowered ? "⚡ Gemini" : "🛠️ Utility"}</span>
                    <span>•</span>
                    <span>{app.requiresBackgroundWorker ? "Async Worker" : "Realtime"}</span>
                  </div>
                  {app.status === "active" ? (
                    <Link
                      href={app.route}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">Registry Mapped</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Grid: Projects & Recent Generations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Recent Projects</h2>
              </div>
              <Link
                href="/projects"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 px-4 space-y-3">
                <p className="text-xs text-slate-400">
                  You haven&apos;t created any projects yet. Start by creating one to house your assets.
                </p>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-all cursor-pointer"
                >
                  + Create Your First Project
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-800/30 rounded-xl transition-all group"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {project.description || "No description provided"}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Generations */}
          <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Recent Generations</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Activity</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading activity...</div>
            ) : recentGenerations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No AI generations yet. Repurpose your first piece of content to view history here.
              </div>
            ) : (
              <div className="space-y-3">
                {recentGenerations.map((gen) => (
                  <div
                    key={gen.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-300 capitalize">
                        {gen.tool.replace("-", " ")}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatDate(gen.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Provider: <strong className="text-slate-300">{gen.provider}</strong></span>
                      <span>Status: <strong className="text-emerald-400 capitalize">{gen.status}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newProj) => setProjects([newProj, ...projects])}
      />
    </DashboardLayout>
  );
}
