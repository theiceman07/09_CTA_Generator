import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

export interface DropdownProps {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger ? (
          trigger
        ) : (
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-40 mt-1.5 w-48 rounded-xl bg-white shadow-soft-lg border border-slate-200/80 py-1 focus:outline-none animate-in fade-in-50 zoom-in-95 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors text-left',
                item.danger
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
