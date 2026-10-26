"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, VoiceReplicatorResponse } from "@/types";
import {
  Mic,
  Sparkles,
  Copy,
  Check,
  FolderKanban,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sliders,
  FileText,
} from "lucide-react";

interface VoiceReplicatorStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: VoiceReplicatorResponse) => void;
}

const SAMPLE_INPUT = {
  sample_writings: `Most engineers overcomplicate hardware telemetry. They spend weeks tuning fragile cloud APIs when all they needed was a robust local watchdog loop and proper ADC grounding.
Here is the honest truth from 5 years of hardware builds:
- If your power rail drops below 3.1V during Wi-Fi transmit, your microcontroller will silently brownout.
- Never calibrate analog sensors without baseline temperature compensation curves.
Let's look at the schematics before making any more excuses.`,
  topic: "Deploying Ultra-Low Power LoRa Sensors for Wildlife Tracking",
  platform: "LinkedIn",
  tone: "Pragmatic & Authoritative",
  target_audience: "Embedded developers, IoT engineers, and hardware architects",
};

const PLATFORMS = ["LinkedIn", "X", "YouTube Community", "Substack", "Instagram"];
const TONES = ["Pragmatic & Authoritative", "Direct & Provocative", "Candid Storytelling", "High-Density Technical"];

export function VoiceReplicatorStudio({
  initialProjectId,
  onGenerationComplete,
}: VoiceReplicatorStudioProps) {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || searchParams.get("projectId") || ""
  );

  const [sampleWritings, setSampleWritings] = useState("");
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [platform, setPlatform] = useState("LinkedIn");
  const [tone, setTone] = useState("Pragmatic & Authoritative");
  const [targetAudience, setTargetAudience] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VoiceReplicatorResponse | null>(null);
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
    setSampleWritings(SAMPLE_INPUT.sample_writings);
    setTopic(SAMPLE_INPUT.topic);
    setPlatform(SAMPLE_INPUT.platform);
    setTone(SAMPLE_INPUT.tone);
    setTargetAudience(SAMPLE_INPUT.target_audience);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select or create a project first.");
      return;
    }
    if (!sampleWritings.trim() || !topic.trim()) {
      setError("Please provide sample writings and a topic to draft.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.request<VoiceReplicatorResponse>(
        "/api/v1/tools/voice-replicator/generate",
        {
          method: "POST",
          body: JSON.stringify({
            project_id: selectedProjectId,
            sample_writings: sampleWritings.trim(),
            topic: topic.trim(),
            platform,
            tone,
            target_audience: targetAudience.trim() || undefined,
          }),
        }
      );

      setResult(data);
      if (onGenerationComplete) onGenerationComplete(data);
    } catch (err: any) {
      setError(err?.message || "Failed to replicate voice style.");
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
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Mic className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Voice Replicator</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Extract linguistic rhythm, syntax patterns, and rhetorical frameworks from your past writings to draft new content in your authentic voice.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-medium transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Voice Sample
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Voice Generation Failed</p>
            <p className="text-xs opacity-90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-6">
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sample Writings */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Past Writing Samples / Excerpts
                </span>
              </label>
              <textarea
                value={sampleWritings}
                onChange={(e) => setSampleWritings(e.target.value)}
                placeholder="Paste representative posts, scripts, or newsletter paragraphs demonstrating your natural sentence flow and tone..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                required
              />
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                New Topic to Write In This Voice
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Designing ultra-low power LoRa telemetry boards"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Platform & Tone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tone Nuance
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !sampleWritings.trim() || !topic.trim() || !selectedProjectId}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Syntax & Drafting...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Replicate Voice & Draft
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Output */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Drafted Content */}
              <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Drafted in Your Voice
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Alignment: {result.style_alignment_score}%
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(result.generated_content, "draft")}
                    className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === "draft" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Draft
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm whitespace-pre-wrap leading-relaxed text-slate-200">
                  {result.generated_content}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Link
                    href={`/tools/cta-generator?content=${encodeURIComponent(result.generated_content)}&projectId=${selectedProjectId}`}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1"
                  >
                    Add CTA <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Style Profile Breakdown */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Extracted Style Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                    <span className="font-semibold text-slate-400">Tone Signature:</span>
                    <p className="mt-1 text-slate-200">{result.style_profile.tone_signature}</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                    <span className="font-semibold text-slate-400">Syntax & Pacing:</span>
                    <p className="mt-1 text-slate-200">
                      {result.style_profile.sentence_structure_style}
                    </p>
                  </div>
                </div>
                {result.style_profile.signature_phrases.length > 0 && (
                  <div className="text-xs text-slate-400">
                    <span className="font-medium text-white">Signature Rhetoric: </span>
                    {result.style_profile.signature_phrases.join(" • ")}
                  </div>
                )}
              </div>

              {/* Reusable Voice Guidelines */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Reusable Voice Guidelines
                </span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                  {result.reusable_voice_guidelines.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">No Voice Replicated Yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                Provide past writing samples on the left to extract stylistic patterns and draft content strictly in your voice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
