import React, { useState } from 'react';
import {
  Clapperboard,
  Camera,
  Clock,
  Sparkles,
  Volume2,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  Video,
} from 'lucide-react';
import { ProductionPlan, BRollItem } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export interface BRollPlanViewProps {
  plan: ProductionPlan;
  onUpdatePlan: (updatedPlan: ProductionPlan) => void;
}

export const BRollPlanView: React.FC<BRollPlanViewProps> = ({ plan, onUpdatePlan }) => {
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [formVisual, setFormVisual] = useState('');
  const [formPurpose, setFormPurpose] = useState('');
  const [formDuration, setFormDuration] = useState('3 sec');
  const [formSceneNum, setFormSceneNum] = useState<number>(1);
  const [formCamera, setFormCamera] = useState('Macro 50mm, shallow depth of field, slow motion');
  const [formAudio, setFormAudio] = useState('Ambient tactile foley');

  const toast = useToast();

  const filteredClips = plan.brollClips.filter((clip) => {
    return selectedSceneFilter === 'all' || clip.sceneNumber.toString() === selectedSceneFilter;
  });

  const handleDeleteClip = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    updatedPlan.brollClips = updatedPlan.brollClips.filter((c) => c.id !== clipId);
    // Re-index
    updatedPlan.brollClips.forEach((c, idx) => {
      c.clipNumber = idx + 1;
    });
    updatedPlan.summary.brollCount = updatedPlan.brollClips.length;

    onUpdatePlan(updatedPlan);
    toast.info('B-Roll Removed', 'Clip deleted and list re-indexed.');
  };

  const handleAddAiBroll = () => {
    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const newClipNumber = updatedPlan.brollClips.length + 1;
    const targetSceneNum = Math.floor(Math.random() * updatedPlan.scenes.length) + 1;

    const sampleAiIdeas = [
      {
        visual: 'Atmospheric light beam filtering through morning mist with dust motes dancing',
        purpose: 'Create contemplative pause between main dialogue beats',
        camera: '85mm f/1.4 backlit, slow motion 120fps',
        audio: 'Soft ethereal synth pad shimmer',
      },
      {
        visual: 'Overhead macro of sneaker laces knotting with satisfying tension pull',
        purpose: 'Kinetic visual pacing accentuating departure readiness',
        camera: 'Top-down 45-degree angle, 35mm f/2.0',
        audio: 'Fabric pull foley & crisp sneaker thud',
      },
      {
        visual: 'Water droplet falling in ultra slow motion onto ceramic cup rim',
        purpose: 'Sensory ASMR visual cue beloved by modern viewers',
        camera: '100mm macro, 240fps slow motion',
        audio: 'Resonant liquid ping resonance',
      },
    ];

    const pick = sampleAiIdeas[Math.floor(Math.random() * sampleAiIdeas.length)];

    const newClip: BRollItem = {
      id: `br-${Date.now()}`,
      clipNumber: newClipNumber,
      visual: pick.visual,
      purpose: pick.purpose,
      suggestedDuration: '3 sec',
      suggestedDurationSeconds: 3,
      sceneNumber: targetSceneNum,
      camera: pick.camera,
      audio: pick.audio,
    };

    updatedPlan.brollClips.push(newClip);
    updatedPlan.summary.brollCount = updatedPlan.brollClips.length;

    onUpdatePlan(updatedPlan);
    toast.success('AI B-Roll Generated', `Added "${newClip.visual.slice(0, 35)}..." to Scene ${targetSceneNum}`);
  };

  const handleSaveClipModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVisual.trim()) {
      toast.error('Validation Error', 'Please describe the B-roll visual.');
      return;
    }

    const updatedPlan = JSON.parse(JSON.stringify(plan)) as ProductionPlan;
    const newClip: BRollItem = {
      id: `br-${Date.now()}`,
      clipNumber: updatedPlan.brollClips.length + 1,
      visual: formVisual.trim(),
      purpose: formPurpose.trim() || 'Add visual variety during voice-over',
      suggestedDuration: formDuration,
      suggestedDurationSeconds: parseInt(formDuration) || 3,
      sceneNumber: Number(formSceneNum),
      camera: formCamera.trim(),
      audio: formAudio.trim(),
    };

    updatedPlan.brollClips.push(newClip);
    updatedPlan.summary.brollCount = updatedPlan.brollClips.length;

    onUpdatePlan(updatedPlan);
    toast.success('B-Roll Added', `Added Clip #${newClip.clipNumber}`);
    setFormVisual('');
    setFormPurpose('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>B-Roll Cutaway Plan</span>
            <Badge variant="brand" size="xs">
              {filteredClips.length} Clips
            </Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Secondary visual inserts to cover cuts, enhance rhythm, and create compelling aesthetic texture.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedSceneFilter}
            onChange={(e) => setSelectedSceneFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="all">All Scenes</option>
            {plan.scenes.map((s) => (
              <option key={s.id} value={s.sceneNumber.toString()}>
                Scene {s.sceneNumber}: {s.title.slice(0, 18)}...
              </option>
            ))}
          </select>

          <Button
            size="sm"
            variant="ai"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={handleAddAiBroll}
          >
            + AI B-Roll
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Clip
          </Button>
        </div>
      </div>

      {/* B-Roll Cards Grid (Section 19 of Prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredClips.map((clip) => (
          <Card key={clip.id} hoverEffect className="p-5 flex flex-col justify-between space-y-4 border-slate-200/90 group">
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60">
                    B-Roll Clip {clip.clipNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Scene {clip.sceneNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="xs">
                    {clip.suggestedDuration}
                  </Badge>
                  <button
                    onClick={(e) => handleDeleteClip(clip.id, e)}
                    className="p-1 rounded text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete clip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Visual Action */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Visual Action
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {clip.visual}
                </p>
              </div>

              {/* Narrative Purpose */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-slate-700">Purpose: </span>
                <span>{clip.purpose}</span>
              </div>

              {/* Camera & Audio Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-indigo-50/40 border border-indigo-100/60">
                  <span className="text-[10px] font-bold text-indigo-900 uppercase flex items-center gap-1">
                    <Camera className="w-3 h-3 text-indigo-600" /> Camera Setup
                  </span>
                  <p className="text-indigo-950 font-medium mt-0.5 line-clamp-2">{clip.camera}</p>
                </div>

                <div className="p-2 rounded-lg bg-emerald-50/40 border border-emerald-100/60">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-emerald-600" /> Audio Ambience
                  </span>
                  <p className="text-emerald-950 font-medium mt-0.5 line-clamp-2">{clip.audio}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Suggested Cut: {clip.suggestedDuration}</span>
              <span className="text-purple-600 font-semibold text-[11px]">Shoot-Ready Cutaway</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Clip Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom B-Roll Clip"
        description="Detail visual action, purpose, duration, camera framing, and audio cues."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveClipModal}>
              Add B-Roll Clip
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveClipModal} className="space-y-4 py-2 text-left">
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Suggested Duration</label>
              <input
                type="text"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                placeholder="e.g. 3 sec"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visual Action</label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Close-up of coffee pouring into mug in slow motion"
              value={formVisual}
              onChange={(e) => setFormVisual(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose / Cutaway Reason</label>
            <input
              type="text"
              placeholder="e.g. Add visual variety during voice-over"
              value={formPurpose}
              onChange={(e) => setFormPurpose(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Camera & Framing</label>
            <input
              type="text"
              value={formCamera}
              onChange={(e) => setFormCamera(e.target.value)}
              placeholder="e.g. 50mm macro, 60fps slow motion"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Audio Foley</label>
            <input
              type="text"
              value={formAudio}
              onChange={(e) => setFormAudio(e.target.value)}
              placeholder="e.g. Natural pouring liquid sound"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
