import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Camera,
  Layers,
  Package,
  Clapperboard,
  ArrowRight,
  Eye,
  Volume2,
  Clock,
} from 'lucide-react';
import { Project, ProductionPlan, Scene } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface SplitScreenViewProps {
  project: Project;
  plan: ProductionPlan;
}

export const SplitScreenView: React.FC<SplitScreenViewProps> = ({ project, plan }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const activeScene = plan.scenes[activeSceneIndex] || plan.scenes[0];

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      {/* Informative Banner */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-indigo-950 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            <strong>Script + Visual Split View:</strong> See how FrameFlow AI partitioned your raw script lines into scenes, shots, camera directions, and props.
          </span>
        </div>
        <span className="font-mono text-indigo-600 font-bold hidden sm:inline">Side-by-Side</span>
      </div>

      {/* 2-Column Split Container (Section 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Column: Script Divided by Scene (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Original Script Segments</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {plan.scenes.length} Scenes
            </span>
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {plan.scenes.map((scene, idx) => {
              const isSelected = idx === activeSceneIndex;

              return (
                <div
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded font-extrabold text-[11px] flex items-center justify-center ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {scene.sceneNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{scene.title}</span>
                    </div>
                    <Badge variant={isSelected ? 'brand' : 'slate'} size="xs">
                      {scene.duration}
                    </Badge>
                  </div>

                  <p
                    className={`text-xs leading-relaxed italic ${
                      isSelected ? 'text-indigo-950 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    "{scene.dialogue}"
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{scene.location}</span>
                    <span className="flex items-center gap-0.5 text-indigo-600 font-semibold">
                      Explore Blueprint <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Production Plan for the Active Scene (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>
                Generated Production Plan for Scene {activeScene.sceneNumber}
              </span>
            </h3>
            <Badge variant="purple" size="xs">
              {activeScene.duration} · {activeScene.shots.length} Shots
            </Badge>
          </div>

          <Card className="p-6 space-y-6 shadow-soft">
            {/* Scene Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {activeScene.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Location: <strong className="text-slate-800">{activeScene.location}</strong>
                </p>
              </div>
              <Badge variant="brand" size="sm">
                {activeScene.shotType}
              </Badge>
            </div>

            {/* Visual Action & Purpose */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-purple-600" /> Visual Realization
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                {activeScene.visualDescription}
              </p>
            </div>

            {/* Camera Direction Details */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Cinematography Direction
                </span>
                <span className="text-xs font-mono text-purple-300">{activeScene.cameraDetails.lensSuggestion}</span>
              </div>
              <p className="text-xs text-slate-200">{activeScene.cameraDirectionSummary}</p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-indigo-900/80 text-[11px]">
                <div>
                  <span className="text-indigo-400 text-[10px] block">Movement:</span>
                  <span className="font-medium text-white">{activeScene.cameraDetails.cameraMovement}</span>
                </div>
                <div>
                  <span className="text-indigo-400 text-[10px] block">Framing:</span>
                  <span className="font-medium text-white">{activeScene.cameraDetails.framing}</span>
                </div>
                <div>
                  <span className="text-indigo-400 text-[10px] block">Speed:</span>
                  <span className="font-medium text-white">{activeScene.cameraDetails.movementSpeed}</span>
                </div>
              </div>
            </div>

            {/* In-Scene Shots List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Camera className="w-3 h-3 text-indigo-600" /> Planned Camera Shots ({activeScene.shots.length})
              </span>
              <div className="space-y-1.5">
                {activeScene.shots.map((shot) => (
                  <div
                    key={shot.id}
                    className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-indigo-600">
                        Shot {shot.shotNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="font-semibold text-slate-800">{shot.shotType}</span>
                      <span className="text-slate-500 truncate max-w-[180px]">{shot.subject}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700">{shot.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Props & B-Roll Row */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 text-[10px] uppercase flex items-center gap-1">
                  <Package className="w-3 h-3 text-emerald-600" /> Props
                </span>
                <p className="text-slate-600 line-clamp-2">{activeScene.props.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 text-[10px] uppercase flex items-center gap-1">
                  <Clapperboard className="w-3 h-3 text-amber-600" /> B-Roll
                </span>
                <p className="text-slate-600 line-clamp-2">{activeScene.broll.join(' · ')}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
