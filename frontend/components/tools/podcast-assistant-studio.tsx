"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, PodcastPlanningResponse } from "@/types";
import {
  Radio,
  Sparkles,
  Copy,
  Check,
  FolderKanban,
  AlertCircle,
  Clock,
  Share2,
  FileText,
  ListOrdered,
  Mic,
} from "lucide-react";

interface PodcastAssistantStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: PodcastPlanningResponse) => void;
}

const SAMPLE_INPUT = {
  episode_concept:
    "Demystifying Edge AI hardware prototyping: Building battery-operated environmental sensor mesh nodes with ESP32 microcontrollers and local anomaly detection models.",
  target_duration_minutes: 45,
  guest_name_or_archetype: "Hardware Architecture Lead / Lead Systems Engineer",
  tone: "In-depth & Conversational",
  creator_notes:
    "Discuss power brownout issues, antenna impedance tuning, sensor calibration drift, and lessons from real-world field trials.",
};

export function PodcastAssistantStudio({
  initialProjectId,
  onGenerationComplete,
}: PodcastAssistantStudioProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [concept, setConcept] = useState(searchParams.get("concept") || "");
  const [duration, setDuration] = useState(45);
  const [guest, setGuest] = useState("");
  const [tone, setTone] = useState("In-depth & Conversational");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PodcastPlanningResponse | null>(null);
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
    setConcept(SAMPLE_INPUT.episode_concept);
    setDuration(SAMPLE_INPUT.target_duration_minutes);
    setGuest(SAMPLE_INPUT.guest_name_or_archetype);
    setTone(SAMPLE_INPUT.tone);
    setNotes(SAMPLE_INPUT.creator_notes);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !concept.trim()) {
      setError("Please select a project and enter an episode concept.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<PodcastPlanningResponse>(
        "/api/v1/tools/podcast-assistant/plan",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            episode_concept: concept.trim(),
            target_duration_minutes: duration,
            guest_name_or_archetype: guest.trim() || undefined,
            tone,
            creator_notes: notes.trim() || undefined,
          }),
        }
      );

      setResult(data);
      if (onGenerationComplete) onGenerationComplete(data);
    } catch (err: any) {
      setError(err?.message || "Failed to plan podcast episode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Radio className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Podcast Assistant</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Complete episode production planning: high-converting titles, timed segments, host-guest interview questions, and markdown show notes.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-medium transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Hardware Episode
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Planning Failed</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handlePlan} className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Project Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-slate-400" /> Project Scope
                  </span>
                  <Link href="/projects" className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline">
                    + New
                  </Link>
                </span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Episode Concept */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-slate-400" /> Episode Theme / Concept / Raw Notes
                </span>
              </label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="What is this episode about? Who is speaking, and what is the central thesis?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  min={10}
                  max={180}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="In-depth, Casual..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Guest / Co-Host Archetype (Optional)
              </label>
              <input
                type="text"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                placeholder="e.g. Senior Firmware Architect at IoT Startup"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Specific Talking Points or Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Must-ask questions, sponsors, or controversial topics..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !concept.trim() || !selectedProjectId}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Architecting Podcast Episode...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" /> Generate Episode Architecture
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Recommended Title & Description */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    Recommended Episode Title
                  </span>
                  <button
                    onClick={() => handleCopy(result.recommended_title, "rec-title")}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "rec-title" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Title
                      </>
                    )}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white">{result.recommended_title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {result.episode_description}
                </p>

                {/* Alternative Titles */}
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Alternative Titles:
                  </span>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {result.episode_title_options.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timed Segments */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" /> Timed Segments & Questions
                </span>
                <div className="space-y-3">
                  {result.timed_segments.map((seg, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-white">
                          {seg.segment_title}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {seg.timestamp_range}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {seg.summary_and_questions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show Notes */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" /> Markdown Show Notes
                  </span>
                  <button
                    onClick={() => handleCopy(result.show_notes_markdown, "notes")}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "notes" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Notes
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {result.show_notes_markdown}
                </pre>
              </div>

              {/* Promotional Social Snippets */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-purple-400" /> Promotional Social Snippets
                </span>
                <div className="space-y-2">
                  {result.social_promotional_snippets.map((snip, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950 text-xs flex items-center justify-between gap-3"
                    >
                      <span className="text-slate-300">{snip}</span>
                      <button
                        onClick={() => handleCopy(snip, `snip-${idx}`)}
                        className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                      >
                        {copiedKey === `snip-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No Episode Planned Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Enter your episode topic, target runtime, and guest details on the left to generate complete show notes, titles, and timed segment questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
