import React from 'react';
import { Film, Plus, Sparkles, SlidersHorizontal, FolderKanban, LayoutDashboard } from 'lucide-react';
import { NavigationPage } from '../../types';
import { Button } from '../common/Button';
import { storage } from '../../services/storage';

export interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const prefs = storage.getUserPreferences();

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'create', label: 'Create New', icon: <Plus className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SlidersHorizontal className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-soft group-hover:shadow-glow transition-all">
                <Film className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  FrameFlow <span className="text-gradient">AI</span>
                </span>
                <span className="text-[10px] -mt-1 font-semibold text-slate-400 tracking-wider uppercase">
                  Pre-Production Studio
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Actions & User Profile */}
          <div className="flex items-center gap-3">
            {currentPage !== 'create' && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => onNavigate('create')}
                className="hidden sm:inline-flex"
              >
                New Production Plan
              </Button>
            )}

            {/* User Profile Avatar */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
              title="Creator Settings"
            >
              <div className="relative">
                <img
                  src={prefs.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={prefs.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="hidden xl:flex flex-col text-left pr-1">
                <span className="text-xs font-semibold text-slate-800 leading-tight">{prefs.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">Solo Creator</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden border-t border-slate-100 bg-white/95 px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium rounded-lg transition-colors ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.icon}
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
