'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navSections = [
    {
      category: 'WORKFLOWS',
      items: [
        {
          name: 'Command Center',
          href: '/',
          badge: 'Master',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          name: 'Autonomous Pipeline',
          href: '/?focus=pipeline',
          badge: 'Branch 21',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        },
      ],
    },
    {
      category: 'CREATION SUITE',
      items: [
        {
          name: 'Idea Generator',
          href: '/ideas',
          badge: '01',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
        },
        {
          name: 'Hook Generator',
          href: '/hooks',
          badge: '03',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          ),
        },
        {
          name: 'Reel Script Studio',
          href: '/reels',
          badge: '05',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          name: 'Thumbnail Ideator',
          href: '/thumbnails',
          badge: '07',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      category: 'INTELLIGENCE',
      items: [
        {
          name: 'Second Brain',
          href: '/brain',
          badge: '19',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#E2E8F0] flex selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sleek Dark Sidebar */}
      <aside className="w-64 bg-[#0D0F17]/90 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col justify-between fixed h-full z-40">
        <div>
          {/* Workspace Branding */}
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                    Creator OS
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                      v1.0
                    </span>
                  </h1>
                  <p className="text-[11px] text-zinc-500 font-medium">Autonomous Studio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="p-3 space-y-6">
            {navSections.map((section, sidx) => (
              <div key={sidx} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase font-mono">
                  {section.category}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${
                          isActive
                            ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.08]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`transition-colors duration-150 ${
                              isActive
                                ? 'text-indigo-400'
                                : 'text-zinc-500 group-hover:text-zinc-300'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </div>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                            isActive
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-zinc-800/60 text-zinc-500 group-hover:text-zinc-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer System Health */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <div className="bg-zinc-900/60 border border-white/[0.06] rounded-xl p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Engine Status
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                Live
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>Model: Gemini 2.5</span>
              <span>22 Agents</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Modern Top Header Bar */}
        <header className="h-14 border-b border-white/[0.06] bg-[#090A0F]/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3 text-xs text-zinc-400">
            <span className="text-zinc-600">Workspaces</span>
            <span className="text-zinc-600">/</span>
            <span className="text-white font-medium">Production Pipeline</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick search (Cmd+K)..."
                readOnly
                className="bg-zinc-900/70 border border-white/[0.08] text-xs text-zinc-400 px-3 py-1.5 pl-8 rounded-lg w-56 cursor-pointer hover:border-zinc-700 transition"
              />
              <svg className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <Link
              href="/"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-indigo-500/20 transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Pipeline
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
