"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CollaborationFinderResponse } from "@/types";
import {
  Users2,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  UserCheck,
  Send,
  TrendingUp,
} from "lucide-react";

export function CollaborationFinderStudio() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    searchParams.get("projectId") || ""
  );

  const [creatorNiche, setCreatorNiche] = useState("Hardware Engineering & Embedded IoT");
  const [primaryPlatform, setPrimaryPlatform] = useState("YouTube");
  const [collaborationGoal, setCollaborationGoal] = useState("Audience Growth");
  const [preferredFormat, setPreferredFormat] = useState("Cross-over Challenge Video");
  const [skills, setSkills] = useState("Circuit design, ESP32 firmware, C++, edge AI inference");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CollaborationFinderResponse | null>(null);
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

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!creatorNiche.trim()) {
      setError("Please specify your creator niche.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await api.request<CollaborationFinderResponse>("/api/v1/tools/collaboration-finder/generate", {
        method: "POST",
        body: JSON.stringify({
          project_id: selectedProjectId,
          creator_niche: creatorNiche.trim(),
          primary_platform: primaryPlatform,
          collaboration_goal: collaborationGoal,
          preferred_format: preferredFormat,
          creator_skills_and_strengths: skills.trim() || undefined,
        }),
      });

      setResult(resp);
    } catch (err: any) {
      setError(err?.message || "Failed to find collaboration opportunities.");
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
            <Users2 className="w-4 h-4 text-rose-400" />
            Collaboration Profile Setup
          </h2>

          <form onSubmit={handleFind} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Workspace
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Your Primary Niche *
                </label>
                <input
                  type="text"
                  value={creatorNiche}
                  onChange={(e) => setCreatorNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Main Platform
                </label>
                <select
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="X">X / Twitter</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Collaboration Goal
                </label>
                <select
                  value={collaborationGoal}
                  onChange={(e) => setCollaborationGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Audience Growth">Audience Growth</option>
                  <option value="Complementary Skill Exchange">Skill Exchange</option>
                  <option value="Joint Product / Launch">Joint Product Launch</option>
                  <option value="Co-hosted Series">Co-hosted Series</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Format
                </label>
                <input
                  type="text"
                  value={preferredFormat}
                  onChange={(e) => setPreferredFormat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Your Superpowers / Specific Skills
              </label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={3}
                placeholder="e.g. 3D printing, electronics CAD, Python backend, video editing"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
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
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs transition-all duration-200 shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Synthesizing Match Archetypes...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Find Creator Collaboration Opportunities
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
            {/* Positioning Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Your Unique Partner Appeal
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.creator_positioning_analysis}
              </p>
            </div>

            {/* Screening Criteria */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Ideal Partner Screening Criteria
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.ideal_partner_criteria.map((crit, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Archetypes */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-rose-400" />
                Complementary Creator Archetypes
              </span>
              <div className="space-y-3">
                {result.partner_archetypes.map((arch, i) => (
                  <div key={i} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{arch.partner_niche}</span>
                      <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800/40 px-2 py-0.5 rounded">
                        {arch.suggested_format}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{arch.audience_synergy_reason}</p>
                    <div className="text-[10px] text-emerald-400 font-medium">Win-Win: {arch.win_win_value_proposition}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready-to-send pitches */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Send className="w-4 h-4 text-purple-400" />
                Collaborative Concepts & DM Outreach Scripts
              </span>
              <div className="space-y-3">
                {result.collaboration_ideas.map((idea, i) => (
                  <div key={i} className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{idea.title}</span>
                      <button
                        onClick={() => handleCopy(idea.outreach_dm_template, i)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedIndex === i ? (
                          <span className="text-emerald-400">Copied</span>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy DM</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">{idea.pitch_angle}</p>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-200 font-mono leading-relaxed">
                      "{idea.outreach_dm_template}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <Users2 className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-400">No Collaborations Analyzed</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Provide your creator niche and skills on the left to synthesize complementary creator archetypes and outreach pitch templates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
