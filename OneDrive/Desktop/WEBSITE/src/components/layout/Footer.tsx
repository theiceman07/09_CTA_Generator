import React from 'react';
import { Film, Sparkles, Heart } from 'lucide-react';
import { NavigationPage } from '../../types';

export const Footer: React.FC<{ onNavigate: (page: NavigationPage) => void }> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-sm mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-sm">
              FrameFlow AI
            </span>
            <span className="text-slate-400 text-xs">· Turn your script into a production-ready video plan</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <button onClick={() => onNavigate('landing')} className="hover:text-indigo-600 transition-colors">
              Overview
            </button>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('projects')} className="hover:text-indigo-600 transition-colors">
              Projects
            </button>
            <button onClick={() => onNavigate('create')} className="hover:text-indigo-600 transition-colors">
              New Plan
            </button>
            <button onClick={() => onNavigate('settings')} className="hover:text-indigo-600 transition-colors">
              Settings
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>Built for Creators with</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
            <span>AI Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
