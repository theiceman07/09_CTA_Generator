import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl active:scale-[0.98]';

    const variants = {
      primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-soft hover:shadow-glow focus:ring-indigo-500 border border-transparent',
      secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm hover:border-slate-300 focus:ring-indigo-500',
      outline: 'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-indigo-500',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus:ring-slate-400',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 focus:ring-red-500',
      ai: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white shadow-glow hover:shadow-indigo-500/50 border border-purple-400/30 font-semibold',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
      sm: 'text-sm px-3.5 py-2 gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {variant === 'ai' && !leftIcon && <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />}
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
