import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: (string | SelectOption)[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'block w-full appearance-none rounded-xl border border-slate-200 bg-white text-slate-900 text-sm py-2.5 pl-3.5 pr-10 transition-all duration-200 cursor-pointer',
              'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20 text-red-900',
              className
            )}
            {...props}
          >
            {options.map((opt) => {
              if (typeof opt === 'string') {
                return (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                );
              }
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
