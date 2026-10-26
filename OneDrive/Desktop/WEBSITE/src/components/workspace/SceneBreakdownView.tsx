import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Camera,
  Sun,
  Package,
  Clapperboard,
  Sparkles,
  Volume2,
  HelpCircle,
  Eye,
  Sliders,
  Edit2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Scene, ProductionPlan } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

export interface SceneBreakdownViewProps {
  plan: ProductionPlan;
  selectedSceneNumber?: number;
  onEditScene?: (scene: Scene) => void;
  onRegenerateScene?: (sceneNumber: number) => void;
}

export const SceneBreakdownView: React.FC<SceneBreakdownViewProps> = ({
  plan,
  selectedSceneNumber,
  onEditScene,
  onRegenerateScene,
}) => {
  // Track open/collapsed state for each scene
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    plan.scenes.forEach((s) => {
      // By default open the selected scene, or the first two scenes
      initial[s.sceneNumber] = selectedSceneNumber ? s.sceneNumber === selectedSceneNumber : true;
    });
    return initial;
  });

  const toast = useToast();

  const toggleScene = (sceneNumber: number) => {
    setExpandedScenes((prev) => ({
      ...prev,
      [sceneNumber]: !prev[sceneNumber],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    plan.scenes.forEach((s) => (allOpen[s.sceneNumber] = true));
    setExpandedScenes(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<number, boolean> = {};
    plan.scenes.forEach((s) => (allClosed[s.sceneNumber] = false));
    setExpandedScenes(allClosed);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Scene Breakdown ({plan.scenes.length})</span>
            <Badge variant="brand" size="xs">Complete Structure</Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Expand any scene card to view technical camera directions, lighting setup, dialogue, props, and B-roll.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="xs" variant="secondary" onClick={expandAll} leftIcon={<Maximize2 className="w-3.5 h-3.5" />}>
            Expand All
          </Button>
          <Button size="xs" variant="secondary" onClick={collapseAll} leftIcon={<Minimize2 className="w-3.5 h-3.5" />}>
            Collapse All
          </Button>
        </div>
      </div>

      {/* Expandable Scene Cards List */}
      <div className="space-y-4">
        {plan.scenes.map((scene) => {
          const isExpanded = !!expandedScenes[scene.sceneNumber];

          return (
            <div
              key={scene.id}
              className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden ${
                isExpanded ? 'border-indigo-300 shadow-soft-lg ring-1 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Scene Card Header */}
              <div
                onClick={() => toggleScene(scene.sceneNumber)}
                className="p-5 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                    {scene.sceneNumber}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-bold text-base text-slate-900 truncate">
                        {scene.title}
                      </h3>
                      <Badge variant="cyan" size="xs">
                        {scene.duration}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {scene.location}
                      </span>
                      <span>·</span>
                      <span className="truncate">{scene.shots.length} shots planned</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{scene.shotType}</span>
                  </div>

                  <button
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle Scene"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Scene Expanded Body (Section 15 of Prompt) */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t border-slate-100 space-y-6 animate-in fade-in-50 duration-200">
                  {/* Narrative Purpose */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                      Scene Purpose & Audience Hook:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{scene.purpose}</p>
                  </div>

                  {/* 2-Column: Dialogue vs Visual Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dialogue / Voice-over */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" /> Dialogue / Voice-over
                      </span>
                      <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 italic leading-relaxed font-medium">
                        {scene.dialogue}
                      </div>
                    </div>

                    {/* Visual Description */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-purple-600" /> Visual Description
                      </span>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                        {scene.visualDescription}
                      </div>
                    </div>
                  </div>

                  {/* Camera Direction & Lighting Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-indigo-400" /> Camera Direction & Cinematography
                      </span>
                      <span className="text-[11px] font-mono text-indigo-200">{scene.shotType}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {scene.cameraDirectionSummary}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase">Movement</span>
                        <div className="font-semibold text-white mt-0.5">{scene.cameraDetails.cameraMovement}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase">Lens Choice</span>
                        <div className="font-mono text-purple-300 mt-0.5">{scene.cameraDetails.lensSuggestion}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase">Framing / Angle</span>
                        <div className="text-slate-200 mt-0.5">{scene.cameraDetails.cameraAngle}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-300 uppercase">Lighting</span>
                        <div className="text-amber-300 mt-0.5 truncate">{scene.lighting}</div>
                      </div>
                    </div>
                  </div>

                  {/* Props & B-Roll Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Props Required */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-600" /> Props Required ({scene.props.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {scene.props.map((prop, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-xs"
                          >
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* B-Roll Suggestions */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clapperboard className="w-3.5 h-3.5 text-amber-600" /> B-Roll Suggestions ({scene.broll.length})
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {scene.broll.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* In-Scene Shots Breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Shots in Scene {scene.sceneNumber} ({scene.shots.length})
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Total {scene.shots.map((s) => s.duration).join(' + ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {scene.shots.map((shot) => (
                        <div
                          key={shot.id}
                          className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all text-xs space-y-1 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-indigo-600">
                              Shot {shot.shotNumber.toString().padStart(2, '0')}
                            </span>
                            <span className="font-mono font-bold text-slate-700">{shot.duration}</span>
                          </div>
                          <div className="font-semibold text-slate-900">{shot.shotType}</div>
                          <p className="text-slate-500 line-clamp-1">{shot.subject}</p>
                          <div className="text-[10px] text-purple-700 font-mono">{shot.lensSuggestion}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scene Action Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Runtime: {scene.duration}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<Sparkles className="w-3 h-3 text-purple-600" />}
                        onClick={() => {
                          if (onRegenerateScene) onRegenerateScene(scene.sceneNumber);
                          toast.info('Regenerating Scene', `Applying new cinematic camera variation to Scene ${scene.sceneNumber}`);
                        }}
                      >
                        Regenerate Scene
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        leftIcon={<Edit2 className="w-3 h-3" />}
                        onClick={() => {
                          if (onEditScene) onEditScene(scene);
                          toast.info('Edit Scene', `Editing Scene ${scene.sceneNumber}`);
                        }}
                      >
                        Edit Scene
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
