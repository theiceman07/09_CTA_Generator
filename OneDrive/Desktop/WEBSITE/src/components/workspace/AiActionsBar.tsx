import React from 'react';
import {
  Sparkles,
  Wand2,
  Film,
  Smartphone,
  Clapperboard,
  RotateCcw,
  Sliders,
  Zap,
} from 'lucide-react';
import { ProductionPlan } from '../../types';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import {
  makePlanMoreCinematic,
  simplifyPlanProduction,
  adaptPlanForShorts,
} from '../../services/aiGenerator';

export interface AiActionsBarProps {
  plan: ProductionPlan;
  onUpdatePlan: (updatedPlan: ProductionPlan) => void;
  onOpenRegenerate: () => void;
}

export const AiActionsBar: React.FC<AiActionsBarProps> = ({
  plan,
  onUpdatePlan,
  onOpenRegenerate,
}) => {
  const toast = useToast();

  const handleMakeCinematic = () => {
    const updated = makePlanMoreCinematic(plan);
    onUpdatePlan(updated);
    toast.success('Cinematic Mode Applied', 'Upgraded camera movements to slow tracking, 35mm primes, and 3-point lighting.');
  };

  const handleSimplify = () => {
    const updated = simplifyPlanProduction(plan);
    onUpdatePlan(updated);
    toast.info('Production Simplified', 'Adjusted gear checklist for solo smartphone creators with natural lighting.');
  };

  const handleAdaptForShorts = () => {
    const updated = adaptPlanForShorts(plan);
    onUpdatePlan(updated);
    toast.success('Adapted for Shorts / Reels', 'Pacing accelerated with vertical 9:16 framing and punchy 2-3s shots.');
  };

  return (
    <div className="p-3.5 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl border border-purple-500/30 text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in-50 duration-200">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-glow">
          <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
              AI Creative Copilot
            </span>
            <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded font-mono font-semibold">
              Instant Transforms
            </span>
          </div>
          <p className="text-xs text-slate-300">
            One-click AI actions to re-orchestrate your shot list, equipment, and camera pacing.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleMakeCinematic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-95"
          title="Upgrade shots to filmic primes, anamorphic lenses, and moody rim lighting"
        >
          <Film className="w-3.5 h-3.5 text-indigo-300" />
          <span>Make More Cinematic</span>
        </button>

        <button
          onClick={handleSimplify}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-95"
          title="Reduce equipment to solo smartphone and natural window light"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Simplify Production</span>
        </button>

        <button
          onClick={handleAdaptForShorts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all hover:scale-[1.02] active:scale-95"
          title="Optimize for 9:16 vertical video with snappy kinetic transitions"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
          <span>Adapt for Shorts</span>
        </button>
      </div>
    </div>
  );
};
