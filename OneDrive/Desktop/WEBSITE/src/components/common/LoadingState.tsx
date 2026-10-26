import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading production data...',
  submessage = 'Please wait a moment',
  className,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2.5 py-6 justify-center text-slate-500', className)}>
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-glow">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-purple-500 animate-bounce" />
        </div>
      </div>
      <h4 className="text-base font-semibold text-slate-900 mb-1">{message}</h4>
      {submessage && <p className="text-sm text-slate-500 max-w-xs">{submessage}</p>}
    </div>
  );
};
