"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ContentRecyclerResponse } from "@/types";
import {
  RotateCcw,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export function ContentRecyclerStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [pastContent, setPastContent] = useState(
    "We spent 6 months building an IoT methane detection station using an ESP32 microcontroller and custom 3D printed housing. It cut our monitoring hardware cost by 90% while providing real-time telemetry alerts."
  );
  const [originalPlatform, setOriginalPlatform] = useState("LinkedIn");
  const [refreshGoal, setRefreshGoal] = useState("Modernize & Expand");
  const [tone, setTone] = useState("Authoritative");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentRecyclerResponse | null>(null);
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

  const handleRecycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!pastContent.trim() || pastContent.trim().length < 10) {
      setError("Please provide at least a short paragraph of past content.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<ContentRecyclerResponse>("/api/v1/tools/content-recycler/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          past_content: pastContent.trim(),
          original_platform: originalPlatform,
          refresh_goal: refreshGoal,
          tone,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to recycle content.");
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
          <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            Recycle Past Successful Content
          </h2>

          <form onSubmit={handleRecycle} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Past Content Asset (Post, Article, or Script) *
              </label>
              <textarea
                value={pastContent}
                onChange={(e) => setPastContent(e.target.value)}
                rows={5}
                placeholder="Paste the original post that performed well previously..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Original Platform
                </label>
                <select
                  value={originalPlatform}
                  onChange={(e) => setOriginalPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X">X / Twitter</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Refresh Goal
                </label>
                <select
                  value={refreshGoal}
                  onChange={(e) => setRefreshGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Modernize & Expand">Modernize & Expand</option>
                  <option value="Condensed Bite-Sized">Condensed Bite-Sized</option>
                  <option value="Contrarian Angle">Contrarian Angle</option>
                  <option value="Visual Carousel Breakdown">Visual Carousel Breakdown</option>
                </select>
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
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Modernizing Content Assets...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Recycle Past Top Performer
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
            <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-4">
              <div className="text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Modernization Summary
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                {result.refreshed_angles_summary}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Republishing Advice: {result.republishing_schedule_advice}</span>
              </div>
            </div>

            <div className="space-y-4">
              {result.variations.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        {v.format_name}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">{v.angle_description}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(v.hook + "\n\n" + v.content_body + "\n\n" + v.cta, idx)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy Post</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                    <span className="text-[10px] text-amber-400 font-semibold block mb-0.5">
                      REFRESHED HOOK
                    </span>
                    <p className="text-xs text-white font-medium">"{v.hook}"</p>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {v.content_body}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                    CTA: <span className="text-white font-medium">{v.cta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <RotateCcw className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Recycled Content Yet</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Paste an older post or article on the left to transform it into new hooks, multi-slide formats, and fresh angles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
