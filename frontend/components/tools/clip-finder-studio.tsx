"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, ClipFinderResponse } from "@/types";
import {
  Scissors,
  Sparkles,
  Copy,
  Check,
  FolderKanban,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";

interface ClipFinderStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: ClipFinderResponse) => void;
}

const SAMPLE_TRANSCRIPT = `[00:01] Welcome back everyone. Today we are talking about sensor reliability.
[02:15] I watched ten different teams try to deploy methane monitoring networks, and nine of them made the exact same fatal mistake.
[02:35] They assumed their analog ADC pins would stay calibrated over varying ambient temperatures. Within forty-eight hours, false alerts spiked by 800 percent.
[03:05] If you don't implement local temperature compensation curves in firmware, your sensors are practically useless.
[10:00] Now let's look at the battery sleep current measurements.
[14:20] Most people think sensor calibration takes days in a laboratory. Here is the 10-second firmware shortcut using a simple piecewise linear curve.
[15:05] That one equation saves you from buying a $2,000 calibration chamber.`;

export function ClipFinderStudio({
  initialProjectId,
  onGenerationComplete,
}: ClipFinderStudioProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [transcriptText, setTranscriptText] = useState("");
  const [videoTopic, setVideoTopic] = useState(searchParams.get("topic") || "");
  const [targetPlatform, setTargetPlatform] = useState("TikTok / Reels / Shorts");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClipFinderResponse | null>(null);
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
    setTranscriptText(SAMPLE_TRANSCRIPT);
    setVideoTopic("Embedded Sensor Calibration & Telemetry Failures");
    setTargetPlatform("TikTok / Reels / Shorts");
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !transcriptText.trim()) {
      setError("Please select a project and provide transcript text.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<ClipFinderResponse>(
        "/api/v1/tools/clip-finder/extract",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            transcript_text: transcriptText.trim(),
            video_topic: videoTopic.trim() || undefined,
            target_platform: targetPlatform,
          }),
        }
      );

      setResult(data);
      if (onGenerationComplete) onGenerationComplete(data);
    } catch (err: any) {
      setError(err?.message || "Failed to extract clips from transcript.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Scissors className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Clip Finder</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Detect viral, high-retention 30-60s vertical clip opportunities from long-form video transcripts.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-medium transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Transcript
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Clip Extraction Failed</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleExtract} className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Transcript Text
                </span>
              </label>
              <textarea
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste video or podcast transcript with or without timestamps..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Original Video Topic / Title (Optional)
              </label>
              <input
                type="text"
                value={videoTopic}
                onChange={(e) => setVideoTopic(e.target.value)}
                placeholder="e.g. Methane Sensor Post-Mortem"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !transcriptText.trim() || !selectedProjectId}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning Transcript for Viral Spikes...
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" /> Extract High-Retention Clips
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Summary */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                  Transcript Analysis Summary
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">{result.analysis_summary}</p>
              </div>

              {/* Clips List */}
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Identified Vertical Clips ({result.clips.length})
                </span>
                {result.clips.map((clip, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3 hover:border-slate-700/80 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {clip.suggested_title}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                          Score: {clip.viral_potential_score}%
                        </span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {clip.start_timestamp} - {clip.end_timestamp} ({clip.duration_seconds}s)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-400 font-semibold">Hook Quote: </span>
                      <span className="italic text-slate-200">"{clip.hook_quote}"</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{clip.reasoning}</p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500">
                        Aspect: {clip.recommended_aspect_ratio}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(clip.suggested_caption, `cap-${idx}`)}
                          className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedKey === `cap-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Caption
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Caption
                            </>
                          )}
                        </button>
                        <Link
                          href={`/tools/reel-script-builder?hook=${encodeURIComponent(clip.hook_quote)}&projectId=${selectedProjectId}`}
                          className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-0.5"
                        >
                          Build Script <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No Clips Extracted Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Paste long-form audio or video transcripts on the left to extract 30-60 second viral hooks, timestamps, and captions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
