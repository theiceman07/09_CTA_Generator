"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, DailyContentPlannerResponse } from "@/types";
import {
  CalendarDays,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  Flame,
} from "lucide-react";

export function DailyContentPlannerStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [coreTopics, setCoreTopics] = useState(
    "ESP32 IoT Methane Monitoring, Edge AI sensor calibration, 3D printing custom enclosures, Wireless telemetry dashboards"
  );
  const [daysCount, setDaysCount] = useState(7);
  const [postsPerDay, setPostsPerDay] = useState(1);
  const [creatorContext, setCreatorContext] = useState("Weekly hardware build creator posting across YouTube, LinkedIn, and Instagram");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DailyContentPlannerResponse | null>(null);

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

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!coreTopics.trim()) {
      setError("Please specify your core content topics.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<DailyContentPlannerResponse>("/api/v1/tools/daily-content-planner/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          core_topics: coreTopics.trim(),
          platforms: ["LinkedIn", "Instagram", "X", "YouTube"],
          days_count: daysCount,
          posts_per_day: postsPerDay,
          creator_context: creatorContext.trim() || undefined,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to generate daily content plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-teal-400" />
            Calendar Planning Setup
          </h2>

          <form onSubmit={handlePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
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
                Core Content Topics / Themes *
              </label>
              <textarea
                value={coreTopics}
                onChange={(e) => setCoreTopics(e.target.value)}
                rows={3}
                placeholder="What topics or projects will you publish about?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Days ({daysCount} days)
                </label>
                <select
                  value={daysCount}
                  onChange={(e) => setDaysCount(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value={7}>7 Days (Weekly Sprint)</option>
                  <option value={14}>14 Days (Bi-weekly Sprint)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Velocity
                </label>
                <select
                  value={postsPerDay}
                  onChange={(e) => setPostsPerDay(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value={1}>1 Post / Day</option>
                  <option value={2}>2 Posts / Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Schedule Constraints / Creator Context
              </label>
              <input
                type="text"
                value={creatorContext}
                onChange={(e) => setCreatorContext(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
              />
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
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating Publishing Matrix...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate {daysCount}-Day Content Calendar
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
            {/* Overview & Burnout Prevention */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Strategic Distribution Architecture
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.strategic_overview}
              </p>
              <div className="p-3 bg-teal-950/30 border border-teal-800/40 rounded-lg text-[11px] text-teal-300 flex items-start gap-2">
                <Flame className="w-4 h-4 shrink-0 text-teal-400 mt-0.5" />
                <span>
                  <strong>Consistency Rule:</strong> {result.consistency_tip}
                </span>
              </div>
            </div>

            {/* Schedule Slots */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-teal-400" />
                Publishing Timeline & Slots ({result.schedule.length} Total)
              </span>

              <div className="space-y-2.5">
                {result.schedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{slot.day}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {slot.time_window}
                        </span>
                        <span className="text-[10px] bg-teal-950 text-teal-400 px-2 py-0.5 rounded border border-teal-800/40 font-medium">
                          {slot.platform}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-200">
                        {slot.post_title_concept}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-3">
                        <span>Pillar: {slot.content_pillar}</span>
                        <span>Format: {slot.format}</span>
                        <span>Goal: {slot.primary_objective}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Production Milestones */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Batch Production Milestones
              </span>
              <div className="space-y-2">
                {result.production_milestones.map((ms, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{ms}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <CalendarDays className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Calendar Scheduled</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Set your core topics and target days on the left to structure an automated multi-platform publishing cadence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
