import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  Camera,
  MapPin,
  Volume2,
} from 'lucide-react';
import { ProductionPlan, Scene } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface TimelineViewProps {
  plan: ProductionPlan;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ plan }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);

  const totalSeconds = plan.summary.totalDurationSeconds || 60;

  // Active scene calculation based on currentSecond
  const getActiveSceneIndex = () => {
    let accumulated = 0;
    for (let i = 0; i < plan.scenes.length; i++) {
      accumulated += plan.scenes[i].durationSeconds;
      if (currentSecond <= accumulated) {
        return i;
      }
    }
    return plan.scenes.length - 1;
  };

  const activeSceneIndex = getActiveSceneIndex();
  const activeScene = plan.scenes[activeSceneIndex] || plan.scenes[0];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSecond((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 500); // 2x speed playback for smooth simulation
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSecond(0);
  };

  const formatTimestamp = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Production Timeline (00:00 — {formatTimestamp(totalSeconds)})</span>
            <Badge variant="brand" size="xs">Visual Architecture</Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand video pacing, scene transitions, and narrative rhythm across the entire duration.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause Simulator' : 'Preview Timeline'}
          </Button>
        </div>
      </div>

      {/* Interactive Scrub Bar Card */}
      <Card className="p-6 space-y-5 bg-gradient-to-br from-white to-slate-50/50 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-black text-slate-900">
              {formatTimestamp(currentSecond)}
            </span>
            <span className="text-slate-400 font-mono text-xs">/ {formatTimestamp(totalSeconds)}</span>
          </div>

          <Badge variant="purple" size="sm" dot>
            Current: Scene {activeScene.sceneNumber} — {activeScene.title}
          </Badge>
        </div>

        {/* Horizontal Proportional Timeline Blocks (Section 20) */}
        <div className="space-y-2">
          <div className="relative w-full h-16 rounded-2xl overflow-hidden bg-slate-100 flex p-1 border border-slate-200/90 shadow-inner">
            {plan.scenes.map((scene, idx) => {
              const widthPct = (scene.durationSeconds / totalSeconds) * 100;
              const isActive = idx === activeSceneIndex;

              const colors = [
                'bg-indigo-500 text-white',
                'bg-purple-500 text-white',
                'bg-blue-500 text-white',
                'bg-sky-500 text-white',
                'bg-emerald-500 text-white',
                'bg-amber-500 text-white',
              ];

              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    // Jump to beginning of scene
                    let startSec = 0;
                    for (let s = 0; s < idx; s++) {
                      startSec += plan.scenes[s].durationSeconds;
                    }
                    setCurrentSecond(startSec);
                  }}
                  className={`h-full flex flex-col justify-between p-2 rounded-xl transition-all cursor-pointer relative mr-1 last:mr-0 ${
                    colors[idx % colors.length]
                  } ${isActive ? 'ring-2 ring-indigo-900 ring-offset-2 scale-[1.02] shadow-md z-10' : 'opacity-85 hover:opacity-100'}`}
                  style={{ width: `${widthPct}%` }}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="truncate">S{scene.sceneNumber}</span>
                    <span className="font-mono opacity-90">{scene.duration}</span>
                  </div>
                  <div className="text-[11px] font-semibold truncate leading-tight">
                    {scene.title}
                  </div>
                </div>
              );
            })}

            {/* Red Playhead scrubber */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-md transition-all duration-300 pointer-events-none"
              style={{ left: `${(currentSecond / totalSeconds) * 100}%` }}
            >
              <div className="w-3 h-3 bg-rose-500 rounded-full -ml-[5px] -top-1 absolute shadow-sm" />
            </div>
          </div>

          {/* Time markers axis */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
            <span>00:00</span>
            <span>00:15</span>
            <span>00:30</span>
            <span>00:45</span>
            <span>01:00</span>
          </div>
        </div>

        {/* Active Scene Spotlight */}
        <div className="p-4 rounded-xl bg-white border border-indigo-200/80 shadow-sm space-y-3 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                {activeScene.sceneNumber}
              </span>
              <h4 className="font-bold text-sm text-slate-900">
                Scene {activeScene.sceneNumber}: {activeScene.title}
              </h4>
            </div>
            <Badge variant="cyan" size="xs">{activeScene.duration}</Badge>
          </div>

          <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            "{activeScene.dialogue}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Location:</span>
              <p className="text-slate-700 font-medium">{activeScene.location}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Camera Movement:</span>
              <p className="text-indigo-600 font-medium">{activeScene.cameraDirectionSummary}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 text-[10px] uppercase">Audio / Sound:</span>
              <p className="text-slate-600 truncate">{activeScene.audio}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Vertical Timeline Breakdown (Section 20 of Prompt) */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Sequential Scene Execution Schedule</span>
        </h3>

        <div className="space-y-3">
          {plan.timeline.map((item, idx) => {
            const isHighlighted = idx === activeSceneIndex;

            return (
              <div
                key={idx}
                onClick={() => {
                  const parts = item.timestamp.split(':');
                  const s = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                  setCurrentSecond(s);
                }}
                className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-500/20 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Timestamp */}
                <span className="font-mono font-extrabold text-sm text-indigo-600 w-16">
                  {item.timestamp}
                </span>

                {/* Bullet */}
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    isHighlighted ? 'bg-indigo-600 ring-4 ring-indigo-200' : 'bg-slate-300'
                  }`}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {item.title}
                    </span>
                    <Badge variant="slate" size="xs">
                      Scene {item.sceneNumber}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {plan.scenes[idx]?.visualDescription}
                  </p>
                </div>

                {/* Duration */}
                <Badge variant={isHighlighted ? 'brand' : 'outline'} size="sm">
                  {item.duration}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
