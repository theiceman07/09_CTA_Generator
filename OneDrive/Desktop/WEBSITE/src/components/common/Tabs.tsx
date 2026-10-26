import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  if (variant === 'segmented') {
    return (
      <div className={cn('inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 select-none',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap select-none border',
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-mono font-semibold',
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Underline
  return (
    <div className={cn('border-b border-slate-200 overflow-x-auto no-scrollbar', className)}>
      <nav className="flex space-x-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3.5 px-1 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap select-none',
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-mono font-medium',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
