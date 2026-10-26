import React from 'react';
import {
  Sparkles,
  Download,
  RefreshCw,
  Edit3,
  Columns,
  Maximize2,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { Project, ProductionPlan } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface WorkspaceHeaderProps {
  project: Project;
  plan: ProductionPlan;
  isSplitView: boolean;
  onToggleSplitView: () => void;
  onEdit: () => void;
  onRegenerate: () => void;
  onExport: () => void;
  onBackToDashboard: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  project,
  plan,
  isSplitView,
  onToggleSplitView,
  onEdit,
  onRegenerate,
  onExport,
  onBackToDashboard,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Back button + Title & Metadata */}
          <div className="flex items-start sm:items-center gap-3.5">
            <button
              onClick={onBackToDashboard}
              className="mt-1 sm:mt-0 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="brand" size="xs">
                  {project.platform}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {plan.summary.totalDuration}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-600 font-medium">
                  {project.tones.join(', ') || 'Energetic'}
                </span>
                <Badge variant="success" size="xs" dot>
                  Shoot-Ready
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{project.title}</span>
              </h1>
            </div>
          </div>

          {/* Right: Actions (Split View, Edit, Regenerate, Export) */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <Button
              size="sm"
              variant={isSplitView ? 'primary' : 'outline'}
              leftIcon={<Columns className="w-4 h-4" />}
              onClick={onToggleSplitView}
              className="text-xs"
            >
              {isSplitView ? 'Exit Split View' : 'Script Split View'}
            </Button>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={onEdit}
              className="text-xs"
            >
              Edit Plan
            </Button>

            <Button
              size="sm"
              variant="outline"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={onRegenerate}
              className="text-xs"
            >
              Regenerate
            </Button>

            <Button
              size="sm"
              variant="ai"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={onExport}
              className="text-xs shadow-glow"
            >
              Export Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
