export type Platform =
  | 'YouTube'
  | 'YouTube Shorts'
  | 'Instagram Reels'
  | 'TikTok'
  | 'LinkedIn'
  | 'Other';

export type VideoType =
  | 'Short-form video'
  | 'Long-form video'
  | 'Tutorial'
  | 'Product video'
  | 'Vlog'
  | 'Educational'
  | 'Promotional'
  | 'Storytelling'
  | 'Interview';

export type Tone =
  | 'Professional'
  | 'Energetic'
  | 'Cinematic'
  | 'Educational'
  | 'Casual'
  | 'Emotional'
  | 'Funny'
  | 'Inspirational';

export type ProjectStatus = 'Completed' | 'Draft' | 'In Progress';

export interface CameraDirectionDetails {
  shotType: string;         // e.g. "Close-up", "Medium shot", "Wide"
  cameraMovement: string;   // e.g. "Slow pan left", "Static", "Push in"
  cameraAngle: string;      // e.g. "Eye level", "Low angle", "High angle"
  framing: string;          // e.g. "Subject centered", "Leading room left"
  lensSuggestion: string;   // e.g. "35mm f/1.8", "50mm prime", "24mm wide"
  movementSpeed: string;    // e.g. "Slow", "Dynamic", "Fluid"
  composition: string;      // e.g. "Rule of thirds", "Leading lines", "Symmetrical"
}

export interface Shot {
  id: string;
  shotNumber: number;
  sceneNumber: number;
  shotType: string;
  cameraMovement: string;
  cameraAngle?: string;
  framing?: string;
  lensSuggestion?: string;
  movementSpeed?: string;
  composition?: string;
  subject: string;
  duration: string;         // e.g. "2 sec", "4 sec"
  durationSeconds: number;
  audio: string;
  description?: string;
}

export type PropCategory = 'Props' | 'Camera Equipment' | 'Lighting' | 'Audio';

export interface PropItem {
  id: string;
  name: string;
  category: PropCategory;
  prepared: boolean;
  notes?: string;
}

export interface BRollItem {
  id: string;
  clipNumber: number;
  visual: string;
  purpose: string;
  suggestedDuration: string;
  suggestedDurationSeconds: number;
  sceneNumber: number;
  camera: string;
  audio: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  duration: string;           // e.g. "8 sec"
  durationSeconds: number;
  location: string;
  purpose: string;
  dialogue: string;
  visualDescription: string;
  cameraDirectionSummary: string;
  cameraDetails: CameraDirectionDetails;
  shotType: string;           // e.g. "Close-up → Medium shot"
  lighting: string;
  props: string[];            // list of prop names for this scene
  broll: string[];            // list of b-roll summaries for this scene
  audio: string;
  shots: Shot[];
}

export interface ProductionPlanSummary {
  totalDuration: string;      // e.g. "60 sec"
  totalDurationSeconds: number;
  sceneCount: number;
  shotCount: number;
  propCount: number;
  brollCount: number;
}

export interface ProductionPlan {
  id: string;
  projectId: string;
  summary: ProductionPlanSummary;
  scenes: Scene[];
  propsAndEquipment: PropItem[];
  brollClips: BRollItem[];
  timeline: {
    timestamp: string;        // e.g. "00:00"
    sceneNumber: number;
    title: string;
    duration: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  platform: Platform;
  videoType: VideoType;
  targetDuration: string;     // e.g. "60 seconds", "30 seconds", "2 minutes"
  tones: Tone[];
  script: string;
  creativeDirection?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  plan?: ProductionPlan;
}

export interface UserPreferences {
  name: string;
  email: string;
  profileImage?: string;
  defaultPlatform: Platform;
  defaultVideoStyle: VideoType;
  defaultDuration: string;
  theme: 'light' | 'dark' | 'system';
  preferredTone: Tone;
  productionComplexity: 'Simple / Solo' | 'Standard' | 'Cinematic / Advanced';
}

export interface GenerationInput {
  title: string;
  platform: Platform;
  videoType: VideoType;
  targetDuration: string;
  tones: Tone[];
  script: string;
  creativeDirection?: string;
}

export type NavigationPage = 
  | 'landing'
  | 'dashboard'
  | 'create'
  | 'processing'
  | 'workspace'
  | 'projects'
  | 'settings';
