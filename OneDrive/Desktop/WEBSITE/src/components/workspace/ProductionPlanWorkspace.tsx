import React, { useState } from 'react';
import {
  Layers,
  Clapperboard,
  Camera,
  Package,
  Film,
  Clock,
  Columns,
  Sparkles,
  Sliders,
  Edit3,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Save,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { Project, ProductionPlan, Scene } from '../../types';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceOverview } from './WorkspaceOverview';
import { SceneBreakdownView } from './SceneBreakdownView';
import { ShotListView } from './ShotListView';
import { CameraDirectionsView } from './CameraDirectionsView';
import { PropsEquipmentView } from './PropsEquipmentView';
import { BRollPlanView } from './BRollPlanView';
import { TimelineView } from './TimelineView';
import { SplitScreenView } from './SplitScreenView';
import { AiActionsBar } from './AiActionsBar';
import AgentsPanel from './AgentsPanel';
import { Tabs } from '../common/Tabs';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

export interface ProductionPlanWorkspaceProps {
  project: Project;
  plan: ProductionPlan;
  onUpdatePlan: (plan: ProductionPlan) => void;
  onBackToDashboard: () => void;
  onRegenerate: () => void;
  onOpenExport: () => void;
}

export type WorkspaceTab =
  | 'overview'
  | 'scenes'
  | 'shots'
  | 'camera'
  | 'props'
  | 'broll'
  | 'timeline'
  | 'agents';

export const ProductionPlanWorkspace: React.FC<ProductionPlanWorkspaceProps> = ({
  project,
  plan,
  onUpdatePlan,
  onBackToDashboard,
  onRegenerate,
  onOpenExport,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [isSplitView, setIsSplitView] = useState(false);
  const [selectedSceneNumber, setSelectedSceneNumber] = useState<number | undefined>(undefined);

  // Edit Scene Modal state
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDialogue, setEditDialogue] = useState('');
  const [editVisual, setEditVisual] = useState('');
  const [editCamera, setEditCamera] = useState('');
  const [editPropsStr, setEditPropsStr] = useState('');
  const [editBrollStr, setEditBrollStr] = useState('');

  // Add Scene Modal state
  const [isAddSceneModalOpen, setIsAddSceneModalOpen] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [newSceneDuration, setNewSceneDuration] = useState('8 sec');
  const [newSceneLocation, setNewSceneLocation] = useState('Studio Setting');
  const [newSceneDialogue, setNewSceneDialogue] = useState('');
  const [newSceneVisual, setNewSceneVisual] = useState('');

  const toast = useToast();

  const handleOpenEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setEditTitle(scene.title);
    setEditDuration(scene.duration);
    setEditLocation(scene.location);
    setEditDialogue(scene.dialogue);
    setEditVisual(scene.visualDescription);
    setEditCamera(scene.cameraDirectionSummary);
    setEditPropsStr(scene.props.join(', '));
    setEditBrollStr(scene.broll.join(', '));
  };

  const handleSaveSceneEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScene) return;

    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const target = updatedPlan.scenes.find((s) => s.id === editingScene.id);

    if (target) {
      target.title = editTitle.trim();
      target.duration = editDuration.trim();
      target.durationSeconds = parseInt(editDuration) || target.durationSeconds;
      target.location = editLocation.trim();
      target.dialogue = editDialogue.trim();
      target.visualDescription = editVisual.trim();
      target.cameraDirectionSummary = editCamera.trim();
      target.props = editPropsStr.split(',').map((p) => p.trim()).filter(Boolean);
      target.broll = editBrollStr.split(',').map((b) => b.trim()).filter(Boolean);

      // Update timeline title
      const timelineItem = updatedPlan.timeline.find((t) => t.sceneNumber === target.sceneNumber);
      if (timelineItem) {
        timelineItem.title = target.title;
        timelineItem.duration = target.duration;
      }

      onUpdatePlan(updatedPlan);
      toast.success('Scene Updated', `Saved changes to Scene ${target.sceneNumber}`);
    }

    setEditingScene(null);
  };

  const handleAddScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneTitle.trim()) {
      toast.error('Validation Error', 'Please enter a scene title.');
      return;
    }

    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const newSceneNum = updatedPlan.scenes.length + 1;
    const durSec = parseInt(newSceneDuration) || 8;

    const newScene: Scene = {
      id: `sc-${Date.now()}`,
      sceneNumber: newSceneNum,
      title: newSceneTitle.trim(),
      duration: newSceneDuration.trim(),
      durationSeconds: durSec,
      location: newSceneLocation.trim(),
      purpose: `Narrative beat for ${newSceneTitle.trim()}`,
      dialogue: newSceneDialogue.trim() || `Dialogue for scene ${newSceneNum}`,
      visualDescription: newSceneVisual.trim() || `Visual presentation for scene ${newSceneNum}`,
      cameraDirectionSummary: 'Medium shot cutting into close-up detail with steady tracking',
      cameraDetails: {
        shotType: 'Medium → Close-up',
        cameraMovement: 'Smooth push-in',
        cameraAngle: 'Eye level',
        framing: 'Subject centered',
        lensSuggestion: '35mm prime',
        movementSpeed: 'Balanced',
        composition: 'Rule of thirds',
      },
      shotType: 'Medium → Close-up',
      lighting: 'Natural studio light with warm key light',
      props: ['Primary scene prop', 'Accessory'],
      broll: [`Cutaway accent for Scene ${newSceneNum}`],
      audio: 'Dialogue + atmospheric music',
      shots: [
        {
          id: `shot-${Date.now()}-1`,
          shotNumber: updatedPlan.summary.shotCount + 1,
          sceneNumber: newSceneNum,
          shotType: 'Medium Shot',
          cameraMovement: 'Static',
          subject: `Creator introducing ${newSceneTitle}`,
          duration: `${Math.round(durSec * 0.5)} sec`,
          durationSeconds: Math.round(durSec * 0.5),
          audio: 'Dialogue',
          lensSuggestion: '35mm',
        },
        {
          id: `shot-${Date.now()}-2`,
          shotNumber: updatedPlan.summary.shotCount + 2,
          sceneNumber: newSceneNum,
          shotType: 'Close-up Detail',
          cameraMovement: 'Slow pan',
          subject: 'Key demonstration',
          duration: `${durSec - Math.round(durSec * 0.5)} sec`,
          durationSeconds: durSec - Math.round(durSec * 0.5),
          audio: 'Tactile sound effect',
          lensSuggestion: '50mm',
        },
      ],
    };

    updatedPlan.scenes.push(newScene);
    updatedPlan.summary.sceneCount = updatedPlan.scenes.length;
    updatedPlan.summary.shotCount += 2;

    // Recalculate timeline
    recalculateTimeline(updatedPlan);

    onUpdatePlan(updatedPlan);
    toast.success('Scene Added', `Added Scene ${newSceneNum}: "${newScene.title}"`);
    setNewSceneTitle('');
    setNewSceneDialogue('');
    setNewSceneVisual('');
    setIsAddSceneModalOpen(false);
  };

  const handleDeleteScene = (sceneNumber: number) => {
    if (plan.scenes.length <= 1) {
      toast.warning('Cannot Delete', 'A production plan must have at least one scene.');
      return;
    }

    if (confirm(`Are you sure you want to delete Scene ${sceneNumber}?`)) {
      const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
      updatedPlan.scenes = updatedPlan.scenes.filter((s) => s.sceneNumber !== sceneNumber);

      // Re-index scenes & shots
      let currentShotIndex = 1;
      updatedPlan.scenes.forEach((s, idx) => {
        s.sceneNumber = idx + 1;
        s.shots.forEach((sh) => {
          sh.sceneNumber = s.sceneNumber;
          sh.shotNumber = currentShotIndex++;
        });
      });
      updatedPlan.summary.sceneCount = updatedPlan.scenes.length;
      updatedPlan.summary.shotCount = currentShotIndex - 1;

      recalculateTimeline(updatedPlan);
      onUpdatePlan(updatedPlan);
      toast.info('Scene Deleted', `Scene removed and remaining scenes re-indexed.`);
    }
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= plan.scenes.length) return;

    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const temp = updatedPlan.scenes[index];
    updatedPlan.scenes[index] = updatedPlan.scenes[newIndex];
    updatedPlan.scenes[newIndex] = temp;

    // Re-index numbers
    let currentShotIndex = 1;
    updatedPlan.scenes.forEach((s, idx) => {
      s.sceneNumber = idx + 1;
      s.shots.forEach((sh) => {
        sh.sceneNumber = s.sceneNumber;
        sh.shotNumber = currentShotIndex++;
      });
    });

    recalculateTimeline(updatedPlan);
    onUpdatePlan(updatedPlan);
    toast.success('Scenes Reordered', `Moved Scene ${index + 1} ${direction}.`);
  };

  const recalculateTimeline = (p: ProductionPlan) => {
    let accumulatedSec = 0;
    p.timeline = p.scenes.map((s) => {
      const m = Math.floor(accumulatedSec / 60).toString().padStart(2, '0');
      const sec = (accumulatedSec % 60).toString().padStart(2, '0');
      const timestamp = `${m}:${sec}`;
      accumulatedSec += s.durationSeconds;
      return {
        timestamp,
        sceneNumber: s.sceneNumber,
        title: s.title,
        duration: s.duration,
      };
    });
    p.summary.totalDurationSeconds = accumulatedSec;
    p.summary.totalDuration = `${accumulatedSec} sec`;
  };

  const handleRegenerateScene = (sceneNumber: number) => {
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const target = updatedPlan.scenes.find((s) => s.sceneNumber === sceneNumber);

    if (target) {
      target.cameraDetails.cameraMovement = 'Dynamic orbital push-in tracking subject eye level';
      target.cameraDetails.lensSuggestion = '50mm anamorphic prime f/1.4';
      target.cameraDetails.movementSpeed = 'Silky 24fps filmic cadence';
      target.cameraDirectionSummary = `Re-engineered camera: ${target.cameraDetails.cameraMovement} with ${target.cameraDetails.lensSuggestion}`;
      target.lighting = 'Dramatic key lighting with warm motivated morning rim light and subtle haze';

      onUpdatePlan(updatedPlan);
      toast.success('Scene Regenerated', `Generated new cinematic camera treatment for Scene ${sceneNumber}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg pb-16">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        project={project}
        plan={plan}
        isSplitView={isSplitView}
        onToggleSplitView={() => setIsSplitView(!isSplitView)}
        onEdit={() => handleOpenEditScene(plan.scenes[0])}
        onRegenerate={onRegenerate}
        onExport={onOpenExport}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Main Workspace Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* AI Actions Copilot Bar (Section 23) */}
        <AiActionsBar
          plan={plan}
          onUpdatePlan={onUpdatePlan}
          onOpenRegenerate={onRegenerate}
        />

        {/* If in Split View mode, render SplitScreenView */}
        {isSplitView ? (
          <SplitScreenView project={project} plan={plan} />
        ) : (
          <>
            {/* Workspace Navigation Tabs with Add Scene CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 pb-2">
              <Tabs
                variant="pills"
                tabs={[
                  { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
                  {
                    id: 'scenes',
                    label: 'Scene Breakdown',
                    icon: <Clapperboard className="w-4 h-4" />,
                    badge: plan.scenes.length,
                  },
                  {
                    id: 'shots',
                    label: 'Shot List',
                    icon: <Camera className="w-4 h-4" />,
                    badge: plan.summary.shotCount,
                  },
                  {
                    id: 'camera',
                    label: 'Camera Directions',
                    icon: <Sliders className="w-4 h-4" />,
                  },
                  {
                    id: 'props',
                    label: 'Props & Equipment',
                    icon: <Package className="w-4 h-4" />,
                    badge: plan.propsAndEquipment.length,
                  },
                  {
                    id: 'broll',
                    label: 'B-Roll Plan',
                    icon: <Film className="w-4 h-4" />,
                    badge: plan.summary.brollCount,
                  },
                  { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
                  { id: 'agents', label: 'AI Agents', icon: <Bot className="w-4 h-4" /> },
                ]}
                activeTab={activeTab}
                onChange={(tabId) => {
                  setActiveTab(tabId as WorkspaceTab);
                  setSelectedSceneNumber(undefined);
                }}
              />

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddSceneModalOpen(true)}
                >
                  Add Scene
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Save className="w-3.5 h-3.5 text-emerald-600" />}
                  onClick={() => {
                    onUpdatePlan(plan);
                    toast.success('Changes Saved', 'Production plan persisted to storage.');
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'overview' && (
              <WorkspaceOverview
                project={project}
                plan={plan}
                onSelectTab={(tab) => setActiveTab(tab as WorkspaceTab)}
                onSelectScene={(sceneNum) => {
                  setSelectedSceneNumber(sceneNum);
                  setActiveTab('scenes');
                }}
              />
            )}

            {activeTab === 'scenes' && (
              <div className="space-y-6">
                {/* Scene Controls & Reordering bar */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Scene Ordering & Management ({plan.scenes.length} Scenes Total)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Reorder with arrows on each card or</span>
                    <button
                      onClick={() => setIsAddSceneModalOpen(true)}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      + Add New Scene
                    </button>
                  </div>
                </div>

                {/* List scenes with Reorder + Delete controls */}
                <div className="space-y-4">
                  {plan.scenes.map((scene, idx) => (
                    <div key={scene.id} className="relative group">
                      <div className="absolute right-14 top-5 z-20 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveScene(idx, 'up')}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
                          title="Move Scene Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === plan.scenes.length - 1}
                          onClick={() => handleMoveScene(idx, 'down')}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none shadow-xs"
                          title="Move Scene Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteScene(scene.sceneNumber)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 shadow-xs"
                          title="Delete Scene"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <SceneBreakdownView
                        plan={{
                          ...plan,
                          scenes: [scene],
                        }}
                        selectedSceneNumber={selectedSceneNumber}
                        onEditScene={handleOpenEditScene}
                        onRegenerateScene={handleRegenerateScene}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shots' && (
              <ShotListView plan={plan} onUpdatePlan={onUpdatePlan} />
            )}

            {activeTab === 'camera' && <CameraDirectionsView plan={plan} />}

            {activeTab === 'props' && (
              <PropsEquipmentView plan={plan} onUpdatePlan={onUpdatePlan} />
            )}

            {activeTab === 'broll' && (
              <BRollPlanView plan={plan} onUpdatePlan={onUpdatePlan} />
            )}

            {activeTab === 'timeline' && <TimelineView plan={plan} />}

            {activeTab === 'agents' && (
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6">
                <AgentsPanel project={project} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Scene Modal (Section 22) */}
      <Modal
        isOpen={!!editingScene}
        onClose={() => setEditingScene(null)}
        title={editingScene ? `Edit Scene ${editingScene.sceneNumber}: ${editingScene.title}` : 'Edit Scene'}
        description="Modify narrative dialogue, visual action, timing, props, or camera directions."
        maxWidth="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingScene(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveSceneEdit}>
              Save Scene Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveSceneEdit} className="space-y-4 py-2 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scene Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                required
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Setting</label>
            <input
              type="text"
              required
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dialogue / Voice-over</label>
            <textarea
              rows={2}
              value={editDialogue}
              onChange={(e) => setEditDialogue(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 leading-relaxed italic"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visual Description</label>
            <textarea
              rows={2}
              value={editVisual}
              onChange={(e) => setEditVisual(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Camera Direction Summary</label>
            <textarea
              rows={2}
              value={editCamera}
              onChange={(e) => setEditCamera(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scene Props (comma separated)</label>
              <input
                type="text"
                value={editPropsStr}
                onChange={(e) => setEditPropsStr(e.target.value)}
                placeholder="Alarm clock, Curtains, Phone"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">B-Roll Ideas (comma separated)</label>
              <input
                type="text"
                value={editBrollStr}
                onChange={(e) => setEditBrollStr(e.target.value)}
                placeholder="Clock macro, sunlight flare"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Add Scene Modal */}
      <Modal
        isOpen={isAddSceneModalOpen}
        onClose={() => setIsAddSceneModalOpen(false)}
        title="Add New Scene"
        description="Insert an additional narrative scene into your production timeline."
        maxWidth="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddSceneModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddScene}>
              Add Scene
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddScene} className="space-y-4 py-2 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scene Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Midday Focus Sprint"
                value={newSceneTitle}
                onChange={(e) => setNewSceneTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Duration</label>
              <input
                type="text"
                required
                placeholder="e.g. 10 sec"
                value={newSceneDuration}
                onChange={(e) => setNewSceneDuration(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Home Office Desk"
              value={newSceneLocation}
              onChange={(e) => setNewSceneLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dialogue / Voice-over</label>
            <textarea
              rows={2}
              placeholder="Script line spoken during this scene..."
              value={newSceneDialogue}
              onChange={(e) => setNewSceneDialogue(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visual Description</label>
            <textarea
              rows={2}
              placeholder="What does the camera see? e.g. Creator typing rapidly on mechanical keyboard"
              value={newSceneVisual}
              onChange={(e) => setNewSceneVisual(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
