import React, { useState } from 'react';
import {
  Camera,
  Compass,
  Move,
  Eye,
  Maximize,
  Gauge,
  Grid,
  Sparkles,
  Info,
  Sliders,
} from 'lucide-react';
import { ProductionPlan, Scene } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Tooltip } from '../common/Tooltip';

export interface CameraDirectionsViewProps {
  plan: ProductionPlan;
}

export const CameraDirectionsView: React.FC<CameraDirectionsViewProps> = ({ plan }) => {
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');

  const filteredScenes = plan.scenes.filter((s) => {
    return selectedSceneFilter === 'all' || s.sceneNumber.toString() === selectedSceneFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Camera Directions & Visual Framing</span>
            <Badge variant="purple" size="xs">Cinematography Guide</Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Beginner-friendly cinematography specs: lens choices, camera angles, framing, movement speeds, and composition rules.
          </p>
        </div>

        <select
          value={selectedSceneFilter}
          onChange={(e) => setSelectedSceneFilter(e.target.value)}
          className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
        >
          <option value="all">All Scenes</option>
          {plan.scenes.map((s) => (
            <option key={s.id} value={s.sceneNumber.toString()}>
              Scene {s.sceneNumber}: {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Camera Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScenes.map((scene) => (
          <Card key={scene.id} hoverEffect className="p-5 space-y-4 border-slate-200/90 flex flex-col justify-between">
            <div>
              {/* Scene Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                    {scene.sceneNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{scene.title}</h3>
                    <span className="text-[11px] text-slate-400">Location: {scene.location}</span>
                  </div>
                </div>
                <Badge variant="brand" size="xs">{scene.duration}</Badge>
              </div>

              {/* Camera Direction Summary */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-4">
                <span className="font-bold text-slate-900 block mb-1">Director's Note:</span>
                <p className="text-slate-600 leading-relaxed">{scene.cameraDirectionSummary}</p>
              </div>

              {/* Technical Cinematography Matrix (Section 17) */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {/* 1. Shot Type */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Maximize className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Shot Type</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{scene.cameraDetails.shotType}</div>
                </div>

                {/* 2. Camera Movement */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Move className="w-3.5 h-3.5 text-purple-500" />
                    <span>Camera Movement</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{scene.cameraDetails.cameraMovement}</div>
                </div>

                {/* 3. Camera Angle */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Compass className="w-3.5 h-3.5 text-blue-500" />
                    <span>Camera Angle</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{scene.cameraDetails.cameraAngle}</div>
                </div>

                {/* 4. Framing */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Framing</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{scene.cameraDetails.framing}</div>
                </div>

                {/* 5. Lens Suggestion */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Camera className="w-3.5 h-3.5 text-purple-600" />
                    <span>Lens Suggestion</span>
                  </div>
                  <div className="font-mono font-bold text-purple-700 mt-1">{scene.cameraDetails.lensSuggestion}</div>
                </div>

                {/* 6. Movement Speed */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Gauge className="w-3.5 h-3.5 text-amber-500" />
                    <span>Movement Speed</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{scene.cameraDetails.movementSpeed}</div>
                </div>

                {/* 7. Composition Rule */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs col-span-2">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                    <Grid className="w-3.5 h-3.5 text-sky-500" />
                    <span>Composition Guide</span>
                  </div>
                  <div className="font-bold text-slate-800 mt-1">{scene.cameraDetails.composition}</div>
                </div>
              </div>
            </div>

            {/* In-scene shots quick view */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{scene.shots.length} planned camera setups</span>
              <span className="text-indigo-600 font-mono font-semibold">{scene.duration}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
