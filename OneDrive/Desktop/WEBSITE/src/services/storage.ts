import { Project, UserPreferences } from '../types';
import { SAMPLE_MORNING_ROUTINE_PLAN, SAMPLE_MORNING_ROUTINE_SCRIPT } from './aiGenerator';

const STORAGE_KEYS = {
  PROJECTS: 'frameflow_projects_v1',
  ACTIVE_PROJECT: 'frameflow_active_project_id_v1',
  USER_PREFERENCES: 'frameflow_user_preferences_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  name: 'Alex Rivera',
  email: 'alex.creator@example.com',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  defaultPlatform: 'YouTube Shorts',
  defaultVideoStyle: 'Short-form video',
  defaultDuration: '60 seconds',
  theme: 'light',
  preferredTone: 'Energetic',
  productionComplexity: 'Standard',
};

const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-sample-morning-routine',
    title: 'My Morning Routine',
    platform: 'YouTube Shorts',
    videoType: 'Short-form video',
    targetDuration: '60 seconds',
    tones: ['Energetic', 'Inspirational'],
    script: SAMPLE_MORNING_ROUTINE_SCRIPT,
    creativeDirection: 'Clean minimalist aesthetic, warm morning light, ASMR tactile sound design with snappy YouTube Shorts pacing.',
    status: 'Completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    plan: SAMPLE_MORNING_ROUTINE_PLAN,
  },
  {
    id: 'proj-sample-campus-vlog',
    title: 'Campus Life Vlog',
    platform: 'YouTube',
    videoType: 'Vlog',
    targetDuration: '2 minutes',
    tones: ['Casual', 'Energetic'],
    script: 'Walking to the main campus quad, stopping by the architecture library, getting an iced matcha with friends, and sharing study tips before midterm exams.',
    creativeDirection: 'Handheld dynamic vlog style, collegiate warmth, natural lighting and street sounds.',
    status: 'Draft',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'proj-sample-tech-setup',
    title: 'Desk Setup Tour 2026',
    platform: 'YouTube',
    videoType: 'Product video',
    targetDuration: '5 minutes',
    tones: ['Cinematic', 'Professional'],
    script: 'A breakdown of my dual-monitor developer setup, ergonomic chair, cable management tips, and favorite productivity peripherals.',
    creativeDirection: 'Moody dark-mode studio lighting with violet and cyan rim lights, buttery smooth slider pans.',
    status: 'Draft',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  }
];

export const storage = {
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) {
        this.saveProjects(SEED_PROJECTS);
        return SEED_PROJECTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read projects from storage', e);
      return SEED_PROJECTS;
    }
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to storage', e);
    }
  },

  getProjectById(id: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find(p => p.id === id);
  },

  saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    project.updatedAt = new Date().toISOString();
    
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.unshift(project);
    }
    this.saveProjects(projects);
  },

  deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
  },

  duplicateProject(id: string): Project | undefined {
    const original = this.getProjectById(id);
    if (!original) return undefined;

    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(original)),
      id: `proj-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (duplicated.plan) {
      duplicated.plan.id = `plan-${Date.now()}`;
      duplicated.plan.projectId = duplicated.id;
    }

    this.saveProject(duplicated);
    return duplicated;
  },

  getActiveProjectId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT) || 'proj-sample-morning-routine';
    } catch {
      return 'proj-sample-morning-routine';
    }
  },

  setActiveProjectId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
    } catch (e) {
      console.error('Failed to set active project id', e);
    }
  },

  getUserPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (!data) {
        this.saveUserPreferences(DEFAULT_PREFERENCES);
        return DEFAULT_PREFERENCES;
      }
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  saveUserPreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save user preferences', e);
    }
  },

  resetAllData(): void {
    localStorage.clear();
    this.saveProjects(SEED_PROJECTS);
    this.saveUserPreferences(DEFAULT_PREFERENCES);
  }
};
