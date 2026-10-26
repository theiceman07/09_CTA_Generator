import React, { useState } from 'react';
import {
  User,
  Sliders,
  Sparkles,
  Moon,
  Sun,
  Shield,
  Trash2,
  Check,
  Save,
  RotateCcw,
  Camera,
  Smartphone,
  Video,
} from 'lucide-react';
import { UserPreferences, Platform, VideoType, Tone, NavigationPage } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { storage } from '../services/storage';
import { useToast } from '../components/common/Toast';

export interface SettingsPageProps {
  onNavigate: (page: NavigationPage) => void;
  onRefreshData: () => void;
}

const PLATFORMS: Platform[] = [
  'YouTube Shorts',
  'YouTube',
  'Instagram Reels',
  'TikTok',
  'LinkedIn',
  'Other',
];

const VIDEO_STYLES: VideoType[] = [
  'Short-form video',
  'Long-form video',
  'Tutorial',
  'Product video',
  'Vlog',
  'Educational',
  'Promotional',
  'Storytelling',
  'Interview',
];

const TONES: Tone[] = [
  'Energetic',
  'Cinematic',
  'Professional',
  'Casual',
  'Inspirational',
  'Educational',
  'Emotional',
  'Funny',
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, onRefreshData }) => {
  const [prefs, setPrefs] = useState<UserPreferences>(() => storage.getUserPreferences());
  const toast = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveUserPreferences(prefs);
    toast.success('Preferences Saved', 'Your creator settings have been updated.');
  };

  const handleResetData = () => {
    if (confirm('Reset all projects and settings to factory demo state? Any custom projects will be lost.')) {
      storage.resetAllData();
      setPrefs(storage.getUserPreferences());
      onRefreshData();
      toast.info('Factory Reset Complete', 'Loaded clean starter seed data.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-200 pb-16">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Creator Settings</span>
          <Badge variant="brand" size="xs">Workspace Config</Badge>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your profile, default video platforms, AI synthesis preferences, and production complexity.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Profile Section (Section 26) */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Creator Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={prefs.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={prefs.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-soft"
              />
              <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Creator Name</label>
                <input
                  type="text"
                  required
                  value={prefs.name}
                  onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={prefs.email}
                  onChange={(e) => setPrefs({ ...prefs, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Video Production Preferences */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Video className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">Default Video Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Platform</label>
              <select
                value={prefs.defaultPlatform}
                onChange={(e) => setPrefs({ ...prefs, defaultPlatform: e.target.value as Platform })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Video Style</label>
              <select
                value={prefs.defaultVideoStyle}
                onChange={(e) => setPrefs({ ...prefs, defaultVideoStyle: e.target.value as VideoType })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {VIDEO_STYLES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Runtime</label>
              <select
                value={prefs.defaultDuration}
                onChange={(e) => setPrefs({ ...prefs, defaultDuration: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="30 seconds">30 seconds</option>
                <option value="60 seconds">60 seconds</option>
                <option value="2 minutes">2 minutes</option>
                <option value="5 minutes">5 minutes</option>
                <option value="10 minutes">10 minutes</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 3. AI Preferences & Production Complexity */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">AI Synthesis Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Aesthetic Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => {
                  const isSelected = prefs.preferredTone === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPrefs({ ...prefs, preferredTone: t })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Production Complexity Default
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Simple / Solo', 'Standard', 'Cinematic / Advanced'] as const).map((level) => {
                  const isSelected = prefs.productionComplexity === level;
                  return (
                    <div
                      key={level}
                      onClick={() => setPrefs({ ...prefs, productionComplexity: level })}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-500/20 text-indigo-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs">{level}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {level === 'Simple / Solo' && 'Smartphone + natural light'}
                        {level === 'Standard' && 'Tripod, mic, and LED softbox'}
                        {level === 'Cinematic / Advanced' && 'Gimbal, anamorphic prime, 3-point light'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Appearance (Light / Dark) */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sun className="w-5 h-5 text-sky-500" />
            <h2 className="text-base font-bold text-slate-900">Appearance</h2>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPrefs({ ...prefs, theme: t })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  prefs.theme === t
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {/* 5. Account & Local Data Reset */}
        <Card className="p-6 space-y-4 border-rose-100 bg-rose-50/20">
          <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
            <Shield className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">Account & Data Management</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-semibold text-slate-800">Reset Local Demo Storage</p>
              <p className="text-slate-500 mt-0.5">Restore original starter projects ("My Morning Routine", "Campus Vlog", "Desk Setup").</p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetData}
            >
              Reset All Data
            </Button>
          </div>
        </Card>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            className="shadow-glow"
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
