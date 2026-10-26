import React from 'react';
import {
  Clock,
  Layers,
  Camera,
  Package,
  Clapperboard,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { ProductionPlan, Project } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface WorkspaceOverviewProps {
  project: Project;
  plan: ProductionPlan;
  onSelectTab: (tabId: string) => void;
  onSelectScene: (sceneNumber: number) => void;
}

export const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({
  project,
  plan,
  onSelectTab,
  onSelectScene,
}) => {
  const preparedPropsCount = plan.propsAndEquipment.filter((p) => p.prepared).length;
  const totalPropsCount = plan.propsAndEquipment.length;
  const prepPercentage = Math.round((preparedPropsCount / totalPropsCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Summary Metric Cards (Section 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* Total Duration */}
        <div
          onClick={() => onSelectTab('timeline')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Duration</span>
            <Clock className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{plan.summary.totalDuration}</div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-0.5">
            View timeline <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Scenes */}
        <div
          onClick={() => onSelectTab('scenes')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Scenes</span>
            <Layers className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{plan.summary.sceneCount}</div>
          <p className="text-[11px] text-purple-600 font-medium mt-1 flex items-center gap-0.5">
            Explore breakdown <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Shots */}
        <div
          onClick={() => onSelectTab('shots')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shots</span>
            <Camera className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">{plan.summary.shotCount}</div>
          <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-0.5">
            Full shot list <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Props & Gear */}
        <div
          onClick={() => onSelectTab('props')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Props & Gear</span>
            <Package className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{plan.summary.propCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-0.5">
            {preparedPropsCount}/{totalPropsCount} prepared <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* B-Roll Clips */}
        <div
          onClick={() => onSelectTab('broll')}
          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-amber-300 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">B-Roll Clips</span>
            <Clapperboard className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-purple-600">{plan.summary.brollCount}</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-0.5">
            View visual clips <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* 2. Visual Production Timeline Bar (Section 20) */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Production Timeline Architecture</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any segment to jump directly into that scene's camera setup.
            </p>
          </div>
          <Badge variant="brand" size="xs">
            {plan.summary.totalDuration} Total Runtime
          </Badge>
        </div>

        {/* Timeline block grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {plan.timeline.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectTab('scenes');
                onSelectScene(item.sceneNumber);
              }}
              className="group p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-indigo-600 group-hover:text-indigo-700">
                  {item.timestamp}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-500 border border-slate-200/80 font-mono">
                  {item.duration}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate mt-1.5 group-hover:text-indigo-900">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>Scene {item.sceneNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Narrative Script Foundation & Quick Scene Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Original Script Summary */}
        <Card className="p-6 lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900">Input Script Foundation</h4>
            <Badge variant="slate" size="xs">
              {project.script.split(/\s+/).length} words
            </Badge>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            "{project.script}"
          </p>
          {project.creativeDirection && (
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Creative Direction:
              </span>
              <p className="text-xs text-slate-600 bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100/60">
                {project.creativeDirection}
              </p>
            </div>
          )}
          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Platform Target:</span>
            <span className="font-semibold text-slate-800">{project.platform}</span>
          </div>
        </Card>

        {/* Right: Key Scenes Highlights (First 2 Scenes) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">Featured Scene Blueprints</h4>
            <button
              onClick={() => onSelectTab('scenes')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all {plan.scenes.length} scenes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.scenes.slice(0, 2).map((scene) => (
              <Card
                key={scene.id}
                hoverEffect
                className="p-5 cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  onSelectTab('scenes');
                  onSelectScene(scene.sceneNumber);
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {scene.sceneNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{scene.title}</span>
                    </div>
                    <Badge variant="cyan" size="xs">{scene.duration}</Badge>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {scene.visualDescription}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Camera: </span>
                    <span className="text-slate-600">{scene.cameraDirectionSummary}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" /> {scene.location}
                  </span>
                  <span className="font-mono text-indigo-600 font-semibold">{scene.shots.length} shots</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
