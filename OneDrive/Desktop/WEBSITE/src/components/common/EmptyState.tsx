import React from 'react';
import { Film, Plus } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 max-w-lg mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
        {icon || <Film className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} leftIcon={<Plus className="w-4 h-4" />}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
