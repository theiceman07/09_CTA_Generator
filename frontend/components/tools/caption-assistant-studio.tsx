"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { Project, CaptionGeneratorResponse, CaptionOutput, CaptionVariant } from "@/types";
import {
  MessageSquareQuote,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FolderKanban,
  FileCheck,
  Zap,
  Target,
  Clock,
  Hash,
  Smile,
  Search,
  CheckCircle2,
  TrendingUp,
  Bookmark,
  Share2,
  ThumbsUp,
} from "lucide-react";

interface CaptionAssistantStudioProps {
  initialProjectId?: string;
  onGenerationComplete?: (res: CaptionGeneratorResponse) => void;
}

const SAMPLE_CAPTION_INPUT = {
  topic: "Autonomous IoT Methane Monitoring System using ESP32 and Edge AI",
  hook: "Can a $5 microcontroller prevent an industrial methane catastrophe?",
  target_audience: "Embedded engineers, IoT builders, and hardware innovators",
  platform: "Instagram",
  format_type: "Photo post",
  tone: "Engaging",
  content_goal: "Saves",
  caption_length: "Medium",
};

const PLATFORMS = [
  { id: "Instagram", label: "Instagram" },
  { id: "LinkedIn", label: "LinkedIn" },
  { id: "X", label: "X / Twitter" },
  { id: "TikTok", label: "TikTok" },
  { id: "YouTube", label: "YouTube" },
];

const FORMAT_TYPES = [
  { id: "Photo post", label: "Photo post" },
  { id: "Reel", label: "Reel caption" },
  { id: "Carousel", label: "Carousel" },
  { id: "Story", label: "Story text" },
];

const TONES = [
  { id: "Engaging", label: "Engaging" },
  { id: "Professional", label: "Professional" },
  { id: "Educational", label: "Educational" },
  { id: "Storytelling", label: "Storytelling" },
  { id: "Witty", label: "Witty" },
  { id: "Bold", label: "Bold" },
  { id: "Casual", label: "Casual" },
];

const GOALS = [
  { id: "Saves", label: "Saves (High Value)", icon: Bookmark },
  { id: "Shares", label: "Shares (Virality)", icon: Share2 },
  { id: "Comments", label: "Comments (Discussion)", icon: MessageSquareQuote },
  { id: "Reach", label: "Reach (Discovery)", icon: TrendingUp },
  { id: "Follows", label: "Follows (Conversion)", icon: ThumbsUp },
];

const LENGTHS = [
  { id: "Short", label: "Short", desc: "< 200 chars" },
  { id: "Medium", label: "Medium", desc: "300 - 500 chars" },
  { id: "Long", label: "Long", desc: "700 - 1000 chars" },
];

export function CaptionAssistantStudio({
  initialProjectId,
  onGenerationComplete,
}: CaptionAssistantStudioProps) {
  const searchParams = useSearchParams();

  // Form State
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [targetAudience, setTargetAudience] = useState("General Audience");
  const [platform, setPlatform] = useState("Instagram");
  const [formatType, setFormatType] = useState("Photo post");
  const [tone, setTone] = useState("Engaging");
  const [contentGoal, setContentGoal] = useState("Saves");
  const [captionLength, setCaptionLength] = useState("Medium");
  const [cta, setCta] = useState("");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [hashtagCount, setHashtagCount] = useState(5);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeSeoKeywords, setIncludeSeoKeywords] = useState(true);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "");

  // Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CaptionGeneratorResponse | null>(null);
  const [chosenVariantIndex, setChosenVariantIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load URL query params from upstream tool handoff (e.g. from Reel Script Builder or Hook Generator)
  useEffect(() => {
    const topicParam = searchParams.get("topic");
    const hookParam = searchParams.get("hook");
    const platformParam = searchParams.get("platform");
    const toneParam = searchParams.get("tone");
    const projectParam = searchParams.get("project_id");

    if (topicParam) setTopic(topicParam);
    if (hookParam) setHook(hookParam);
    if (platformParam) {
      const match = PLATFORMS.find((p) => p.id.toLowerCase() === platformParam.toLowerCase());
      if (match) setPlatform(match.id);
    }
    if (toneParam) {
      const match = TONES.find((t) => t.id.toLowerCase() === toneParam.toLowerCase());
      if (match) setTone(match.id);
    }
    if (projectParam) setSelectedProjectId(projectParam);
  }, [searchParams]);

  // Load available projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const projs = await api.projects.list();
        setProjects(projs);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, []);

  // Timer for loading state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleLoadSample = () => {
    setTopic(SAMPLE_CAPTION_INPUT.topic);
    setHook(SAMPLE_CAPTION_INPUT.hook);
    setTargetAudience(SAMPLE_CAPTION_INPUT.target_audience);
    setPlatform(SAMPLE_CAPTION_INPUT.platform);
    setFormatType(SAMPLE_CAPTION_INPUT.format_type);
    setTone(SAMPLE_CAPTION_INPUT.tone);
    setContentGoal(SAMPLE_CAPTION_INPUT.content_goal);
    setCaptionLength(SAMPLE_CAPTION_INPUT.caption_length);
    setError(null);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() || topic.trim().length < 3) {
      setError("Please provide a topic or content description with at least 3 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.tools.generateCaption({
        topic: topic.trim(),
        platform,
        format_type: formatType,
        tone,
        target_audience: targetAudience.trim() || "General Audience",
        content_goal: contentGoal,
        caption_length: captionLength,
        hook: hook.trim() || undefined,
        cta: cta.trim() || undefined,
        include_hashtags: includeHashtags,
        hashtag_count: hashtagCount,
        include_emojis: includeEmojis,
        include_seo_keywords: includeSeoKeywords,
        project_id: selectedProjectId || undefined,
      });

      setResult(response);
      setChosenVariantIndex(response.caption.recommended_variant_index ?? 0);
      if (onGenerationComplete) {
        onGenerationComplete(response);
      }
    } catch (err: any) {
      console.error("Caption generation error:", err);
      setError(err?.message || "Failed to generate caption. Please check inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // Determine current active caption to display in bottom bar or highlight
  const currentVariant = result?.caption.variants[chosenVariantIndex] || result?.caption.variants[0];
  const formattedFullCurrentCaption = currentVariant
    ? [currentVariant.hook, currentVariant.body, currentVariant.cta].filter(Boolean).join("\n\n") +
      (includeHashtags && currentVariant.hashtags?.length
        ? "\n\n" + currentVariant.hashtags.map((h) => "#" + h.replace(/^#/, "")).join(" ")
        : "")
    : result?.caption.caption || "";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-slate-900 border border-pink-500/20 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Application 5 &middot; Active
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <MessageSquareQuote className="w-8 h-8 text-pink-400" />
              Caption Assistant
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Craft scroll-stopping, algorithm-optimized social media captions with grounded hooks,
              tailored call-to-actions, and precision SEO hashtags across Instagram, LinkedIn, X, TikTok, and YouTube.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Load Sample
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleGenerate}
            className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-400" />
                Caption Specifications
              </h2>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                gemini-3.1-flash-lite
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Content / Topic Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="topic" className="font-medium text-slate-300">
                  Topic or Content Summary <span className="text-pink-400">*</span>
                </label>
                <span className="text-slate-500 font-mono text-[11px]">{topic.length}/1000</span>
              </div>
              <textarea
                id="topic"
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Building an Autonomous IoT Methane Monitoring System using ESP32 and Edge AI..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Upstream Hook Handoff Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="hook" className="font-medium text-slate-300 flex items-center gap-1.5">
                  Opening Hook <span className="text-slate-500 text-[11px] font-normal">(Optional Handoff)</span>
                </label>
                {hook && (
                  <span className="text-pink-400 text-[10px] bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20">
                    Hook Preserved
                  </span>
                )}
              </div>
              <input
                id="hook"
                type="text"
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="e.g. Can a $5 microcontroller prevent an industrial disaster?"
                className="w-full px-3.5 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Platform Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Target Platform</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    disabled={isLoading}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
                      platform === p.id
                        ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-sm"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Post Format</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {FORMAT_TYPES.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormatType(fmt.id)}
                    disabled={isLoading}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
                      formatType === fmt.id
                        ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Tone Profile</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    disabled={isLoading}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                      tone === t.id
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm"
                        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Goal Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Primary Content Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {GOALS.map((g) => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setContentGoal(g.id)}
                      disabled={isLoading}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 ${
                        contentGoal === g.id
                          ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-sm"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption Length Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">Caption Length</label>
              <div className="grid grid-cols-3 gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setCaptionLength(l.id)}
                    disabled={isLoading}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      captionLength === l.id
                        ? "bg-pink-500/20 border-pink-500 text-white"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-semibold">{l.label}</div>
                    <div className="text-[10px] text-slate-500">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience Input */}
            <div className="space-y-1.5">
              <label htmlFor="audience" className="text-xs font-medium text-slate-300 block">
                Target Audience
              </label>
              <input
                id="audience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Embedded Engineers, Tech Creators..."
                className="w-full px-3.5 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Toggles Grid */}
            <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Publishing Options
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-pink-500 focus:ring-pink-500/50"
                  />
                  <span className="flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-pink-400" />
                    Hashtags (5 max)
                  </span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-pink-500 focus:ring-pink-500/50"
                  />
                  <span className="flex items-center gap-1">
                    <Smile className="w-3.5 h-3.5 text-amber-400" />
                    Emojis (Tasteful)
                  </span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSeoKeywords}
                    onChange={(e) => setIncludeSeoKeywords(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-pink-500 focus:ring-pink-500/50"
                  />
                  <span className="flex items-center gap-1">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    Hook SEO Keywords
                  </span>
                </label>
              </div>
            </div>

            {/* Project Selector for Asset Persistence */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor="project" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
                Assign to Project (Asset Persistence)
              </label>
              <select
                id="project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
              >
                <option value="">No Project (Standalone Generation)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Selecting a project automatically archives the generated caption document into project assets.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !topic.trim() || topic.trim().length < 3}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Crafting Captions... ({elapsedSeconds}s)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Craft Captions ✦</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output & Studio View */}
        <div className="lg:col-span-7 space-y-6">
          {/* Empty State */}
          {!isLoading && !result && (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto text-pink-400 shadow-inner">
                <MessageSquareQuote className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Your Captions Appear Here</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Enter your topic, pick your tone and target platform, and generate 4 algorithm-calibrated caption takes.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-xl transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Try With IoT Methane Monitoring Sample
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-slate-800 rounded-lg" />
                <div className="h-5 w-24 bg-slate-800 rounded-lg" />
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-800/80 rounded-xl" />
                <div className="h-32 bg-slate-800/60 rounded-xl" />
                <div className="h-28 bg-slate-800/40 rounded-xl" />
              </div>
              <div className="flex items-center justify-center text-xs text-slate-400 gap-2 pt-4">
                <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                <span>Running Gemini 3.1 Flash Lite structured generation &amp; reach scoring...</span>
              </div>
            </div>
          )}

          {/* Results View */}
          {!isLoading && result && (
            <div className="space-y-6">
              {/* Recommendation Callout */}
              {result.caption.recommend_reason && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 text-white flex items-start gap-3 shadow-md">
                  <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      ★ Recommended Take: Take {(result.caption.recommended_variant_index ?? 0) + 1}
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {result.caption.recommend_reason}
                    </p>
                  </div>
                </div>
              )}

              {/* Persistence Badge */}
              {result.project_id && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
                  <FileCheck className="w-4 h-4" />
                  <span>Persisted to project as Asset (type: caption) &middot; Generation ID: {result.generation_id.slice(0, 8)}...</span>
                </div>
              )}

              {/* Multi-Take Variant Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Creative Takes ({result.caption.variants.length} Angles)
                  </h3>
                  <span className="text-xs text-slate-400">Click any card to select</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {result.caption.variants.map((v: CaptionVariant, idx: number) => {
                    const isChosen = idx === chosenVariantIndex;
                    const isRecommended = idx === result.caption.recommended_variant_index;
                    const fullTakeText = [v.hook, v.body, v.cta].filter(Boolean).join("\n\n") +
                      (v.hashtags?.length ? "\n\n" + v.hashtags.map((h) => "#" + h.replace(/^#/, "")).join(" ") : "");

                    return (
                      <div
                        key={idx}
                        onClick={() => setChosenVariantIndex(idx)}
                        className={`rounded-2xl border p-5 transition-all cursor-pointer relative ${
                          isChosen
                            ? "bg-slate-900 border-pink-500/80 shadow-lg shadow-pink-500/10 ring-1 ring-pink-500/50"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {v.label || `Take ${idx + 1}`}
                            </span>
                            {isRecommended && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                ★ Recommended
                              </span>
                            )}
                          </div>

                          {/* Reach Score Bar */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400 text-[11px]">Reach Score:</span>
                            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full"
                                style={{ width: `${Math.min(Math.max(v.reach_score || 80, 0), 100)}%` }}
                              />
                            </div>
                            <span className="font-bold text-white text-[11px]">{v.reach_score || 85}%</span>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="space-y-3 py-3 text-sm">
                          {/* Hook Line */}
                          <div className="p-2.5 rounded-lg bg-pink-500/5 border border-pink-500/15">
                            <div className="text-[10px] uppercase font-bold text-pink-400 tracking-wider mb-0.5">
                              Opening Hook (Line 1)
                            </div>
                            <div className="font-semibold text-slate-100">{v.hook}</div>
                          </div>

                          {/* Body Text */}
                          <div className="text-slate-300 whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                            {v.body}
                          </div>

                          {/* CTA */}
                          {v.cta && (
                            <div className="text-xs font-medium text-pink-300 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/80">
                              <span className="text-slate-400 font-normal">CTA: </span>
                              {v.cta}
                            </div>
                          )}

                          {/* Hashtags */}
                          {v.hashtags && v.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {v.hashtags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[11px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
                                >
                                  #{tag.replace(/^#/, "")}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Why it works & Extra */}
                        <div className="pt-2 border-t border-slate-800/60 text-xs space-y-1 text-slate-400">
                          {v.why && (
                            <div>
                              <span className="text-slate-300 font-medium">Why it works:</span> {v.why}
                            </div>
                          )}
                          {v.extra && (
                            <div className="text-purple-300">
                              <span className="font-medium">Bonus tip:</span> {v.extra}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChosenVariantIndex(idx);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              isChosen
                                ? "bg-pink-500 text-white font-semibold shadow-sm"
                                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            }`}
                          >
                            {isChosen ? "✓ Chosen Take" : "Select Take"}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  v.hashtags?.map((h) => "#" + h.replace(/^#/, "")).join(" ") || "",
                                  `tags-${idx}`
                                );
                              }}
                              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
                            >
                              {copiedKey === `tags-${idx}` ? "Tags Copied!" : "Copy Tags"}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(fullTakeText, `cap-${idx}`);
                              }}
                              className="px-3 py-1 text-xs text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg transition-all flex items-center gap-1"
                            >
                              {copiedKey === `cap-${idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Caption</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Toolbar for Chosen Take */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Selected: Take {chosenVariantIndex + 1} ({currentVariant?.label || "Custom"})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formattedFullCurrentCaption.length} characters &middot; Ready to publish on {platform}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formattedFullCurrentCaption, "current-chosen")}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    {copiedKey === "current-chosen" ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Full Caption</span>
                      </>
                    )}
                  </button>

                  {/* Downstream Cross-App Workflow Link */}
                  <Link
                    href={`/tools/reel-script-builder?topic=${encodeURIComponent(topic)}&hook=${encodeURIComponent(
                      currentVariant?.hook || ""
                    )}`}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <span>Build Reel Script</span>
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
