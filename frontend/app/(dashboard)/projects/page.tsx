"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Project } from "@/types";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Clock,
  Trash2,
  ExternalLink,
  Layers,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const list = await api.projects.list();
      setProjects(list);
    } catch (err: any) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project and all its assets?")) return;
    setDeletingId(id);
    try {
      await api.projects.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Projects" }]}
      action={{
        label: "Create Project",
        onClick: () => setCreateModalOpen(true),
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
            <p className="text-xs text-slate-400 mt-1">
              Organize your creative workspaces, campaign assets, and repurposed content
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center bg-[#0f172a] border border-slate-800 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div className="max-w-sm mx-auto">
              <h3 className="text-base font-bold text-white">No projects yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Create a project to start repurposing articles, managing assets, and
                organizing multi-platform campaigns.
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              + Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0f172a] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      disabled={deletingId === project.id}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {project.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.description || "No description provided"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(project.created_at)}</span>
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newProj) => setProjects([newProj, ...projects])}
      />
    </DashboardLayout>
  );
}
