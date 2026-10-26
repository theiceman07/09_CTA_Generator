import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Film,
  SlidersHorizontal,
  FileText,
  Clock,
  Video,
  Lightbulb,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  Platform,
  VideoType,
  Tone,
  GenerationInput,
  NavigationPage,
} from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Select } from '../components/common/Select';
import { Card } from '../components/common/Card';
import { useToast } from '../components/common/Toast';
import { SAMPLE_MORNING_ROUTINE_SCRIPT } from '../services/aiGenerator';

export interface CreateProjectPageProps {
  onStartGeneration: (input: GenerationInput) => void;
  onNavigate: (page: NavigationPage) => void;
}

const PLATFORMS: Platform[] = [
  'YouTube Shorts',
  'YouTube',
  'Instagram Reels',
  'TikTok',
  'LinkedIn',
  'Other',
];

const VIDEO_TYPES: VideoType[] = [
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

const DURATIONS = [
  '30 seconds',
  '60 seconds',
  '2 minutes',
  '5 minutes',
  '10 minutes',
  'Custom',
];

const TONES: Tone[] = [
  'Energetic',
  'Cinematic',
  'Casual',
  'Inspirational',
  'Professional',
  'Educational',
  'Emotional',
  'Funny',
];

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({
  onStartGeneration,
  onNavigate,
}) => {
  const [title, setTitle] = useState('My Morning Routine');
  const [platform, setPlatform] = useState<Platform>('YouTube Shorts');
  const [videoType, setVideoType] = useState<VideoType>('Short-form video');
  const [targetDuration, setTargetDuration] = useState('60 seconds');
  const [selectedTones, setSelectedTones] = useState<Tone[]>(['Energetic']);
  const [script, setScript] = useState(SAMPLE_MORNING_ROUTINE_SCRIPT);
  const [creativeDirection, setCreativeDirection] = useState(
    'Clean aesthetic, warm morning light, ASMR tactile sound design with snappy YouTube Shorts pacing.'
  );

  const [errors, setErrors] = useState<{ title?: string; script?: string }>({});
  const toast = useToast();

  const handleToggleTone = (tone: Tone) => {
    setSelectedTones((prev) => {
      if (prev.includes(tone)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((t) => t !== tone);
      }
      return [...prev, tone];
    });
  };

  const handleLoadSample = () => {
    setTitle('My Morning Routine');
    setPlatform('YouTube Shorts');
    setVideoType('Short-form video');
    setTargetDuration('60 seconds');
    setSelectedTones(['Energetic', 'Inspirational']);
    setScript(SAMPLE_MORNING_ROUTINE_SCRIPT);
    setCreativeDirection('Clean aesthetic, warm morning light, ASMR tactile sound design with snappy pacing.');
    setErrors({});
    toast.info('Sample Data Loaded', 'Sample morning routine script & presets applied.');
  };

  const handleClear = () => {
    setTitle('');
    setScript('');
    setCreativeDirection('');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; script?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please enter a project title';
    }
    if (!script.trim()) {
      newErrors.script = 'Please add a script before generating your production plan';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Validation Error', 'Please complete the required project fields.');
      return;
    }

    setErrors({});

    const input: GenerationInput = {
      title: title.trim(),
      platform,
      videoType,
      targetDuration,
      tones: selectedTones,
      script: script.trim(),
      creativeDirection: creativeDirection.trim(),
    };

    onStartGeneration(input);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-200 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Your Production Plan
        </h1>
        <p className="text-base text-slate-500">
          Tell us about your video and we'll handle the planning.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6 shadow-soft">
          {/* Quick Preset Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-medium">
              <Lightbulb className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                Want to test immediately? Click to pre-fill the recommended 60-second creator demo script.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                type="button"
                size="xs"
                variant="secondary"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                onClick={handleLoadSample}
              >
                Load Sample Script
              </Button>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Project Name */}
          <div>
            <Input
              label="Project Name"
              required
              placeholder="e.g. My Morning Routine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              helperText="Give your video a descriptive name"
            />
          </div>

          {/* Platform, Video Type, Target Duration in 3-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Select
                label="Platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                options={PLATFORMS}
                helperText="Optimizes aspect ratio"
              />
            </div>

            <div>
              <Select
                label="Video Type"
                value={videoType}
                onChange={(e) => setVideoType(e.target.value as VideoType)}
                options={VIDEO_TYPES}
                helperText="Influences pacing & shots"
              />
            </div>

            <div>
              <Select
                label="Target Duration"
                value={targetDuration}
                onChange={(e) => setTargetDuration(e.target.value)}
                options={DURATIONS}
                helperText="Estimated runtime"
              />
            </div>
          </div>

          {/* Multi-Tone Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Tone & Style <span className="text-xs text-slate-400 font-normal">(select one or more)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => {
                const isSelected = selectedTones.includes(tone);
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => handleToggleTone(tone)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{tone}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Script Input Textarea */}
          <div>
            <Textarea
              label="Paste your script"
              required
              rows={6}
              placeholder="Paste your script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              showWordCount
              maxWords={5000}
              showCharCount
              error={errors.script}
              helperText="Add dialogue, voiceover, or general video beats. The AI parses sentences into scenes and shots."
            />
          </div>

          {/* Optional Creative Direction */}
          <div>
            <Textarea
              label="Optional Creative Direction"
              rows={3}
              placeholder="Describe the visual style, audience, location or any specific requirements..."
              value={creativeDirection}
              onChange={(e) => setCreativeDirection(e.target.value)}
              helperText="E.g. Aesthetic minimalism, moody shadows, fast vlog cuts, collegiate setting, etc."
            />
          </div>

          {/* Submit CTA Button (Section 11) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="lg"
              variant="ai"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto px-8 py-3.5 shadow-glow hover:shadow-indigo-500/50"
            >
              ✨ Generate Production Plan
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
