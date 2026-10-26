import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showWordCount?: boolean;
  maxWords?: number;
  showCharCount?: boolean;
  maxChars?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      value,
      showWordCount = false,
      maxWords,
      showCharCount = false,
      maxChars,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const stringValue = typeof value === 'string' ? value : '';
    const wordCount = stringValue.trim() ? stringValue.trim().split(/\s+/).length : 0;
    const charCount = stringValue.length;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {(showWordCount || showCharCount) && (
            <span className="text-xs text-slate-400 font-mono">
              {showWordCount && (
                <span>
                  <strong className="text-slate-600 font-semibold">{wordCount}</strong>
                  {maxWords ? ` / ${maxWords} words` : ' words'}
                </span>
              )}
              {showWordCount && showCharCount && ' · '}
              {showCharCount && (
                <span>
                  <strong className="text-slate-600 font-semibold">{charCount}</strong>
                  {maxChars ? ` / ${maxChars} chars` : ' chars'}
                </span>
              )}
            </span>
          )}
        </div>

        <div className="relative rounded-xl shadow-sm">
          <textarea
            id={textareaId}
            ref={ref}
            value={value}
            className={cn(
              'block w-full rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200',
              'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm p-3.5 leading-relaxed',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20 text-red-900',
              className
            )}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
