import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Sparkles,
  Filter,
  Search,
  MoreVertical,
  Clock,
  Volume2,
} from 'lucide-react';
import { Shot, ProductionPlan } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Dropdown } from '../common/Dropdown';
import { useToast } from '../common/Toast';
import { improveShotAi } from '../../services/aiGenerator';

export interface ShotListViewProps {
  plan: ProductionPlan;
  onUpdatePlan: (updatedPlan: ProductionPlan) => void;
}

export const ShotListView: React.FC<ShotListViewProps> = ({ plan, onUpdatePlan }) => {
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingShot, setEditingShot] = useState<Shot | null>(null);

  // Form state for adding/editing shot
  const [formSceneNum, setFormSceneNum] = useState<number>(1);
  const [formShotType, setFormShotType] = useState('Medium Shot');
  const [formMovement, setFormMovement] = useState('Slow pan');
  const [formSubject, setFormSubject] = useState('');
  const [formDuration, setFormDuration] = useState('3 sec');
  const [formAudio, setFormAudio] = useState('Voice-over + ambient sound');
  const [formLens, setFormLens] = useState('35mm prime');

  const toast = useToast();

  const allShots = plan.scenes.flatMap((s) => s.shots);

  const filteredShots = allShots.filter((shot) => {
    const matchesScene =
      selectedSceneFilter === 'all' || shot.sceneNumber.toString() === selectedSceneFilter;
    const matchesSearch =
      shot.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shot.shotType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shot.cameraMovement.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScene && matchesSearch;
  });

  const handleDeleteShot = (shotId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    let found = false;

    updatedPlan.scenes.forEach((scene) => {
      const idx = scene.shots.findIndex((s) => s.id === shotId);
      if (idx !== -1) {
        scene.shots.splice(idx, 1);
        found = true;
      }
    });

    if (found) {
      // Re-index shot numbers
      let currentShotIndex = 1;
      updatedPlan.scenes.forEach((scene) => {
        scene.shots.forEach((s) => {
          s.shotNumber = currentShotIndex++;
        });
      });
      updatedPlan.summary.shotCount = currentShotIndex - 1;

      onUpdatePlan(updatedPlan);
      toast.info('Shot Removed', 'Shot deleted and list re-indexed.');
    }
  };

  const handleDuplicateShot = (shot: Shot, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const targetScene = updatedPlan.scenes.find((s) => s.sceneNumber === shot.sceneNumber);

    if (targetScene) {
      const dup: Shot = {
        ...JSON.parse(JSON.stringify(shot)),
        id: `shot-${Date.now()}`,
        subject: `${shot.subject} (Copy)`,
      };
      targetScene.shots.push(dup);

      // Re-index
      let currentShotIndex = 1;
      updatedPlan.scenes.forEach((scene) => {
        scene.shots.forEach((s) => {
          s.shotNumber = currentShotIndex++;
        });
      });
      updatedPlan.summary.shotCount = currentShotIndex - 1;

      onUpdatePlan(updatedPlan);
      toast.success('Shot Duplicated', `Created Shot #${dup.shotNumber}`);
    }
  };

  const handleImproveShotWithAi = (shot: Shot, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const improved = improveShotAi(shot);
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;

    updatedPlan.scenes.forEach((scene) => {
      const idx = scene.shots.findIndex((s) => s.id === shot.id);
      if (idx !== -1) {
        scene.shots[idx] = improved;
      }
    });

    onUpdatePlan(updatedPlan);
    toast.success('AI Enhanced Shot', `Upgraded Shot #${shot.shotNumber} with cinematic camera movement & lens.`);
  };

  const handleOpenAddModal = () => {
    setEditingShot(null);
    setFormSceneNum(1);
    setFormShotType('Medium Shot');
    setFormMovement('Slow pan left');
    setFormSubject('');
    setFormDuration('3 sec');
    setFormAudio('Dialogue + background music');
    setFormLens('35mm prime');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (shot: Shot) => {
    setEditingShot(shot);
    setFormSceneNum(shot.sceneNumber);
    setFormShotType(shot.shotType);
    setFormMovement(shot.cameraMovement);
    setFormSubject(shot.subject);
    setFormDuration(shot.duration);
    setFormAudio(shot.audio);
    setFormLens(shot.lensSuggestion || '35mm');
    setIsAddModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) {
      toast.error('Validation Error', 'Please enter a subject for the shot.');
      return;
    }

    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;

    if (editingShot) {
      // Update existing
      updatedPlan.scenes.forEach((scene) => {
        const idx = scene.shots.findIndex((s) => s.id === editingShot.id);
        if (idx !== -1) {
          scene.shots[idx] = {
            ...scene.shots[idx],
            shotType: formShotType,
            cameraMovement: formMovement,
            subject: formSubject.trim(),
            duration: formDuration,
            audio: formAudio.trim(),
            lensSuggestion: formLens,
          };
        }
      });
      toast.success('Shot Updated', `Saved changes to Shot #${editingShot.shotNumber}`);
    } else {
      // Add new
      const targetScene = updatedPlan.scenes.find((s) => s.sceneNumber === Number(formSceneNum)) || updatedPlan.scenes[0];
      const newShot: Shot = {
        id: `shot-${Date.now()}`,
        shotNumber: allShots.length + 1,
        sceneNumber: targetScene.sceneNumber,
        shotType: formShotType,
        cameraMovement: formMovement,
        subject: formSubject.trim(),
        duration: formDuration,
        durationSeconds: parseInt(formDuration) || 3,
        audio: formAudio.trim(),
        lensSuggestion: formLens,
      };
      targetScene.shots.push(newShot);

      // Re-index
      let currentShotIndex = 1;
      updatedPlan.scenes.forEach((scene) => {
        scene.shots.forEach((s) => {
          s.shotNumber = currentShotIndex++;
        });
      });
      updatedPlan.summary.shotCount = currentShotIndex - 1;
      toast.success('Shot Added', `Added new shot to Scene ${targetScene.sceneNumber}`);
    }

    onUpdatePlan(updatedPlan);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Production Shot List</span>
            <Badge variant="brand" size="xs">
              {filteredShots.length} Shots
            </Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full shoot-ready table with camera movements, lens suggestions, and audio directions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Scene filter */}
          <select
            value={selectedSceneFilter}
            onChange={(e) => setSelectedSceneFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Scenes</option>
            {plan.scenes.map((s) => (
              <option key={s.id} value={s.sceneNumber.toString()}>
                Scene {s.sceneNumber}: {s.title.slice(0, 18)}...
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search shots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white w-36 sm:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleOpenAddModal}
          >
            Add Shot
          </Button>
        </div>
      </div>

      {/* Professional Shot List Table (Section 16) */}
      <Card className="p-0 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Shot</th>
                <th className="py-3.5 px-3">Scene</th>
                <th className="py-3.5 px-3">Shot Type</th>
                <th className="py-3.5 px-3">Camera Movement</th>
                <th className="py-3.5 px-3">Subject</th>
                <th className="py-3.5 px-3">Lens / Framing</th>
                <th className="py-3.5 px-3">Duration</th>
                <th className="py-3.5 px-3">Audio Cue</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShots.map((shot) => (
                <tr
                  key={shot.id}
                  className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  onClick={() => handleOpenEditModal(shot)}
                >
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    Shot {shot.shotNumber.toString().padStart(2, '0')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Scene {shot.sceneNumber}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900">{shot.shotType}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{shot.cameraMovement}</td>
                  <td className="py-3 px-3 text-slate-800 font-medium max-w-[200px] truncate">
                    {shot.subject}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-purple-700 font-semibold">{shot.lensSuggestion}</span>
                    {shot.cameraAngle && (
                      <span className="text-[10px] text-slate-400 block">{shot.cameraAngle}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{shot.duration}</td>
                  <td className="py-3 px-3 text-slate-500 italic max-w-[180px] truncate">
                    {shot.audio}
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                      {/* AI Improve button */}
                      <button
                        title="AI Improve Shot"
                        onClick={(e) => handleImproveShotWithAi(shot, e)}
                        className="p-1 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        title="Duplicate Shot"
                        onClick={(e) => handleDuplicateShot(shot, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        title="Edit Shot"
                        onClick={() => handleOpenEditModal(shot)}
                        className="p-1 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        title="Delete Shot"
                        onClick={(e) => handleDeleteShot(shot.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Shot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingShot ? `Edit Shot #${editingShot.shotNumber}` : 'Add New Production Shot'}
        description="Configure shot type, camera movement, lens choice, and audio cues."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveModal}>
              {editingShot ? 'Save Changes' : 'Add to Shot List'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveModal} className="space-y-4 py-2 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Scene</label>
              <select
                value={formSceneNum}
                onChange={(e) => setFormSceneNum(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {plan.scenes.map((s) => (
                  <option key={s.id} value={s.sceneNumber}>
                    Scene {s.sceneNumber}: {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                placeholder="e.g. 3 sec"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shot Type</label>
              <select
                value={formShotType}
                onChange={(e) => setFormShotType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option>Close-up</option>
                <option>Extreme Close-up</option>
                <option>Medium Shot</option>
                <option>Wide Establishing</option>
                <option>Over-the-shoulder</option>
                <option>Top-down Flat Lay</option>
                <option>POV (Point of view)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lens Suggestion</label>
              <input
                type="text"
                value={formLens}
                onChange={(e) => setFormLens(e.target.value)}
                placeholder="e.g. 35mm f/1.8"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Camera Movement</label>
            <input
              type="text"
              value={formMovement}
              onChange={(e) => setFormMovement(e.target.value)}
              placeholder="e.g. Slow pan left or Static"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Visual Action</label>
            <textarea
              rows={2}
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder="What appears in frame? e.g. Creator pouring hot coffee into ceramic mug"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Audio Cue</label>
            <input
              type="text"
              value={formAudio}
              onChange={(e) => setFormAudio(e.target.value)}
              placeholder="e.g. Dialogue line or Water kettle bubbling"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
