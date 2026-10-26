import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Film,
  Camera,
  Layers,
  Package,
  Clapperboard,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { StepProgress, StepItem } from '../components/common/ProgressBar';
import { GenerationInput, ProductionPlan } from '../types';

export interface ProcessingPageProps {
  input: GenerationInput;
  plan: ProductionPlan | null;
  onOpenPlan: () => void;
}

const AI_STEPS: StepItem[] = [
  { id: '1', label: 'Script analyzed', description: 'Examining narrative cadence, tone, and pacing' },
  { id: '2', label: 'Scenes identified', description: 'Partitioning script into core visual beats' },
  { id: '3', label: 'Planning shots', description: 'Calculating framing, shot sizes, and transitions' },
  { id: '4', label: 'Adding camera directions', description: 'Assigning lenses, movements, and angles' },
  { id: '5', label: 'Identifying props', description: 'Cataloging physical items and gear checklist' },
  { id: '6', label: 'Generating B-roll', description: 'Creating tactile cutaways and aesthetic inserts' },
  { id: '7', label: 'Finalizing production plan', description: 'Packaging timeline, durations, and audio cues' },
];

export const ProcessingPage: React.FC<ProcessingPageProps> = ({
  input,
  plan,
  onOpenPlan,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Progress through the 7 steps smoothly
    const stepDurations = [400, 500, 500, 450, 450, 450, 400]; // total ~3.15s
    let accumulatedTime = 0;

    const timers: ReturnType<typeof setTimeout>[] = [];

    stepDurations.forEach((duration, index) => {
      accumulatedTime += duration;
      const t = setTimeout(() => {
        setCurrentStepIndex(index + 1);
        const pct = Math.min(100, Math.round(((index + 1) / stepDurations.length) * 100));
        setProgressPercent(pct);

        if (index === stepDurations.length - 1) {
          setIsCompleted(true);
        }
      }, accumulatedTime);
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in-50 duration-300">
      <Card className="p-8 sm:p-10 shadow-soft-lg border-indigo-100 text-center relative overflow-hidden">
        {/* Top ambient glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-pink-500/10 blur-3xl pointer-events-none" />

        {/* AI Icon Orb */}
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-in zoom-in-75 duration-300 stroke-[2.5]" />
            ) : (
              <Sparkles className="w-8 h-8 animate-pulse text-purple-200" />
            )}
          </div>
          {!isCompleted && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            </div>
          )}
        </div>

        {/* Heading & Subheading */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isCompleted ? 'Your production plan is ready!' : 'Creating your production plan...'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            {isCompleted
              ? `Generated ${plan?.summary.sceneCount || 6} scenes with ${plan?.summary.shotCount || 18} shots for "${input.title}".`
              : 'FrameFlow AI is turning your script into a shoot-ready blueprint.'}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 font-mono">
            <span>Synthesis Progress</span>
            <span className="text-indigo-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 7-Step Progress List */}
        <div className="text-left mb-8 max-w-lg mx-auto">
          <StepProgress steps={AI_STEPS} currentStepIndex={currentStepIndex} />
        </div>

        {/* Call To Action once completed */}
        {isCompleted && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="ai"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onOpenPlan}
              className="w-full sm:w-auto px-8 py-3.5 shadow-glow hover:shadow-indigo-500/50"
            >
              Open Production Plan
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
