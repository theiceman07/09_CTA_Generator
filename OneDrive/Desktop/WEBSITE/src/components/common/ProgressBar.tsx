import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  showPercentage?: boolean;
  className?: string;
  variant?: 'brand' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = false,
  className,
  variant = 'gradient',
  size = 'md',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variants = {
    brand: 'bg-indigo-600',
    success: 'bg-emerald-600',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs font-medium text-slate-600">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepProgressProps {
  steps: StepItem[];
  currentStepIndex: number;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStepIndex,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-3.5', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isPending = index > currentStepIndex;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 border',
              isCurrent && 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-medium shadow-sm translate-x-1',
              isCompleted && 'bg-slate-50/70 border-slate-200/80 text-slate-700',
              isPending && 'border-transparent text-slate-400 opacity-60'
            )}
          >
            <div className="flex-shrink-0 flex items-center justify-center">
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : isCurrent ? (
                <div className="relative flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-glow">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </div>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-slate-400">
                  <Circle className="w-3 h-3 stroke-[2]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={cn('text-sm tracking-tight', isCurrent && 'font-semibold text-indigo-900')}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-slate-500 truncate">{step.description}</p>
              )}
            </div>

            {isCurrent && (
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                Processing
              </span>
            )}
            {isCompleted && (
              <span className="text-xs text-emerald-600 font-medium">Done</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
