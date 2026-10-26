import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'slate' | 'danger' | 'purple' | 'cyan' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'slate',
  size = 'sm',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    brand: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200/60',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const dotColors = {
    brand: 'bg-indigo-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    slate: 'bg-slate-400',
    danger: 'bg-rose-500',
    purple: 'bg-purple-500',
    cyan: 'bg-sky-500',
    outline: 'bg-slate-400',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 font-medium rounded-md gap-1',
    sm: 'text-xs px-2.5 py-1 font-medium rounded-lg gap-1.5',
    md: 'text-sm px-3 py-1 font-semibold rounded-lg gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border font-medium transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
