import React from 'react';
import {
  Film,
  Sparkles,
  ArrowRight,
  Layers,
  Camera,
  Package,
  Clapperboard,
  Clock,
  Sliders,
  CheckCircle2,
  Play,
  Share2,
  SlidersHorizontal,
  ChevronRight,
  FileText,
  Video,
} from 'lucide-react';
import { NavigationPage } from '../types';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export interface LandingPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenSampleDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenSampleDemo }) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg selection:bg-brand-500 selection:text-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-indigo-50/20 to-studio-bg">
        {/* Subtle background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 shadow-sm animate-in fade-in slide-in-from-top-3 duration-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-900 tracking-wide">
                AI-Powered Video Pre-Production Studio
              </span>
              <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                New
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              From Script to <br className="hidden sm:inline" />
              <span className="text-gradient">Shoot-Ready Plan.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              FrameFlow AI transforms your script into scenes, shots, camera directions, props and B-roll requirements in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onNavigate('create')}
                className="w-full sm:w-auto shadow-glow hover:shadow-indigo-500/40 text-base py-3.5 px-7"
              >
                Create Production Plan
              </Button>
              <Button
                size="lg"
                variant="secondary"
                leftIcon={<Play className="w-4 h-4 text-indigo-600 fill-indigo-100" />}
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto text-base py-3.5 px-6"
              >
                See How It Works
              </Button>
            </div>

            {/* Creator trust markers */}
            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free instant demo
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No API key required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Export to PDF & CSV
              </span>
            </div>
          </div>

          {/* 2. Hero Visual: Interactive Mock Production-Plan Dashboard */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            {/* Ambient framing glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-75" />

            <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden">
              {/* Mock Window Top Bar */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400">
                    frameflow.studio/project/my-morning-routine
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="xs">Live Studio Preview</Badge>
                  <button
                    onClick={onOpenSampleDemo}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    Open Live Blueprint <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Mock Workspace Content */}
              <div className="p-6 bg-slate-50/50 space-y-6">
                {/* Mock Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                        YouTube Shorts
                      </span>
                      <span className="text-xs text-slate-400 font-mono">60 seconds · Energetic</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">My Morning Routine — Production Blueprint</h3>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 font-medium">Scenes</div>
                      <div className="text-sm font-extrabold text-slate-800">6</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 font-medium">Shots</div>
                      <div className="text-sm font-extrabold text-indigo-600">18</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 font-medium">Props</div>
                      <div className="text-sm font-extrabold text-slate-800">7</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 font-medium">B-Roll</div>
                      <div className="text-sm font-extrabold text-purple-600">10</div>
                    </div>
                  </div>
                </div>

                {/* Timeline Bar Mock */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" /> Video Timeline (00:00 - 01:00)
                    </span>
                    <span className="font-mono text-indigo-600">6 Scenes Planned</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-left">
                      <div className="text-[10px] font-mono font-bold text-indigo-600">00:00</div>
                      <div className="text-[11px] font-semibold text-slate-800 truncate">Wake-Up</div>
                      <div className="text-[10px] text-slate-400">8s</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-left">
                      <div className="text-[10px] font-mono font-bold text-indigo-600">00:08</div>
                      <div className="text-[11px] font-semibold text-slate-800 truncate">Make Bed</div>
                      <div className="text-[10px] text-slate-400">7s</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-left">
                      <div className="text-[10px] font-mono font-bold text-indigo-600">00:15</div>
                      <div className="text-[11px] font-semibold text-slate-800 truncate">Plan Day</div>
                      <div className="text-[10px] text-slate-400">12s</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-left">
                      <div className="text-[10px] font-mono font-bold text-indigo-600">00:27</div>
                      <div className="text-[11px] font-semibold text-slate-800 truncate">Coffee Pour</div>
                      <div className="text-[10px] text-slate-400">11s</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-left">
                      <div className="text-[10px] font-mono font-bold text-indigo-600">00:38</div>
                      <div className="text-[11px] font-semibold text-slate-800 truncate">Pack Bag</div>
                      <div className="text-[10px] text-slate-400">12s</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-left">
                      <div className="text-[10px] font-mono font-bold text-indigo-600">00:50</div>
                      <div className="text-[11px] font-semibold text-slate-800 truncate">Step Out</div>
                      <div className="text-[10px] text-slate-400">10s</div>
                    </div>
                  </div>
                </div>

                {/* 2-Column Mock View: Scene Card + Shot List Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Detailed Scene Card */}
                  <div className="rounded-xl border border-indigo-200 bg-white p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          1
                        </span>
                        <span className="text-xs font-bold text-slate-800">Scene 1 — Morning Wake-Up</span>
                      </div>
                      <Badge variant="cyan" size="xs">8 sec</Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "Every morning starts with one simple decision..."
                    </p>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-semibold">Camera Direction:</span>
                        <span className="text-slate-600">Slow pan to bedside alarm, cut to curtains.</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">Props:</span>
                        <span className="text-slate-600">Alarm clock, Linen bed, Curtains.</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clapperboard className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold">B-Roll:</span>
                        <span className="text-slate-600">Clock macro 06:30 AM · Floor sunlight flare</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Shot List Rows */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-indigo-600" /> Generated Shot List
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Shots 01 - 03</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">Shot 01</span>
                          <span className="font-semibold text-slate-800">Extreme Close-up</span>
                          <span className="text-slate-400">Alarm tap</span>
                        </div>
                        <span className="font-mono text-slate-500 font-bold">2s</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">Shot 02</span>
                          <span className="font-semibold text-slate-800">Medium Pan</span>
                          <span className="text-slate-500">Sitting up</span>
                        </div>
                        <span className="font-mono text-indigo-600 font-bold">3s</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">Shot 03</span>
                          <span className="font-semibold text-slate-800">Wide Push-in</span>
                          <span className="text-slate-400">Curtains open</span>
                        </div>
                        <span className="font-mono text-slate-500 font-bold">3s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section (Section 8 of prompt) */}
      <section className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="purple" size="sm">Everything You Need To Shoot</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Complete Production Blueprint in Seconds
            </h2>
            <p className="text-base text-slate-600">
              Never get stuck wondering how to shoot your script. FrameFlow AI generates every technical and creative element.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 — Scene Breakdown */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-studio-bg hover:bg-white hover:shadow-soft-lg hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Scene Breakdown</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Turn a script into organized scenes automatically with location, duration, and narrative purpose.
              </p>
            </div>

            {/* Feature 2 — Smart Shot List */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-studio-bg hover:bg-white hover:shadow-soft-lg hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Shot List</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate shot types, lens choices, angles, framing, and camera movements for every single scene.
              </p>
            </div>

            {/* Feature 3 — Props & Equipment */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-studio-bg hover:bg-white hover:shadow-soft-lg hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Props & Equipment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identify props, lighting, and audio equipment needed for production with interactive checklists.
              </p>
            </div>

            {/* Feature 4 — B-Roll Suggestions */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-studio-bg hover:bg-white hover:shadow-soft-lg hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <Clapperboard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">B-Roll Suggestions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate relevant B-roll ideas, macro cutaways, and atmospheric clips to make videos dynamic and engaging.
              </p>
            </div>

            {/* Feature 5 — Production Timeline */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-studio-bg hover:bg-white hover:shadow-soft-lg hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Production Timeline</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Estimate scene and shot durations accurately to hit your exact platform target (30s, 60s, 2m, etc.).
              </p>
            </div>

            {/* Feature 6 — Editable AI Plan */}
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-studio-bg hover:bg-white hover:shadow-soft-lg hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Editable AI Plan</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Allow creators to edit, reorder, delete, regenerate, and customize every scene and shot in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section (Section 9 of prompt) */}
      <section id="how-it-works-section" className="py-20 bg-studio-bg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="brand" size="sm">Simple 4-Step Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How FrameFlow AI Works
            </h2>
            <p className="text-base text-slate-600">
              Move effortlessly from raw ideas to a structured, executable video shoot blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold font-mono text-indigo-100 block mb-3">01</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Add Your Script</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Paste or write your script into the intuitive editor with real-time word counting.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Raw text or bullet points
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold font-mono text-indigo-100 block mb-3">02</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Customize</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose platform, format, tone, and target duration to match your creative vision.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Shorts, Reels, YouTube
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold font-mono text-indigo-100 block mb-3">03</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Generate</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  FrameFlow AI analyzes the script and creates the complete production plan in seconds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-purple-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 7-step AI synthesis
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="text-4xl font-extrabold font-mono text-indigo-100 block mb-3">04</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Shoot</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use the generated scenes, shots, props, and B-roll as your production guide on set.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Shoot-ready on set
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to turn your script into a production plan?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Join thousands of creators who plan faster, shoot smarter, and make higher-quality videos with FrameFlow AI.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              variant="ai"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('create')}
              className="w-full sm:w-auto px-8 py-3.5 text-base"
            >
              Start Your Free Plan
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 text-base"
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
