"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Plus, Sparkles } from "lucide-react";

interface HeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export function Header({ breadcrumbs = [], action }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0a0f1d]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard"
          className="text-slate-400 hover:text-slate-200 transition-colors font-medium"
        >
          SaaS
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-slate-400 hover:text-slate-200 transition-colors font-medium"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-200 font-semibold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {action.icon || <Plus className="w-3.5 h-3.5" />}
            <span>{action.label}</span>
          </button>
        )}
      </div>
    </header>
  );
}
