import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Camera,
  Clock,
  Sparkles,
  ArrowRight,
  FolderKanban,
  MoreVertical,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Copy,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { NavigationPage, Project } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Dropdown } from '../components/common/Dropdown';
import { storage } from '../services/storage';
import { useToast } from '../components/common/Toast';

export interface DashboardPageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectProject: (project: Project) => void;
  onOpenWorkspace: (project: Project) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectProject,
  onOpenWorkspace,
}) => {
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Draft'>('All');
  const toast = useToast();

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated = storage.duplicateProject(id);
    if (duplicated) {
      setProjects(storage.getProjects());
      toast.success('Project Duplicated', `Created copy of "${duplicated.title}"`);
    }
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      storage.deleteProject(id);
      setProjects(storage.getProjects());
      toast.info('Project Deleted', `Removed "${title}"`);
    }
  };

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Dashboard Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{greetingTime}, Creator</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            What are you creating today? Turn any script into a shoot-ready video blueprint.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="ai"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => onNavigate('create')}
            className="shadow-glow"
          >
            + New Production Plan
          </Button>
        </div>
      </div>

      {/* 2. Statistics Cards (Section 10 of prompt) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: 12 Projects */}
        <Card hoverEffect className="bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">12</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Projects</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 3 active this week
          </p>
        </Card>

        {/* Stat 2: 48 Scenes Planned */}
        <Card hoverEffect className="bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scenes Planned</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">48</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Scenes</span>
          </div>
          <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Automated scene splits
          </p>
        </Card>

        {/* Stat 3: 126 Shots Generated */}
        <Card hoverEffect className="bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shots Generated</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">126</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Shots</span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">
            With camera & lens specs
          </p>
        </Card>

        {/* Stat 4: 8 Hours Saved */}
        <Card hoverEffect className="bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Saved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">8</span>
            <span className="text-xs text-slate-400 ml-1.5 font-medium">Hours Saved</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            ~45 mins per script
          </p>
        </Card>
      </div>

      {/* 3. Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
            <p className="text-xs sm:text-sm text-slate-500">Pick up where you left off or open your production plans.</p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              {(['All', 'Completed', 'Draft'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    statusFilter === filter
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isCompleted = project.status === 'Completed';
            const sceneCount = project.plan?.summary.sceneCount || (project.title.includes('Campus') ? 8 : 6);
            const shotCount = project.plan?.summary.shotCount || (project.title.includes('Campus') ? 24 : 18);
            const durationDisplay = project.plan?.summary.totalDuration || project.targetDuration;

            return (
              <Card
                key={project.id}
                hoverEffect
                className="flex flex-col justify-between cursor-pointer group border-slate-200/90 hover:border-indigo-300"
                onClick={() => {
                  storage.setActiveProjectId(project.id);
                  onSelectProject(project);
                  if (project.plan) {
                    onOpenWorkspace(project);
                  } else {
                    onNavigate('create');
                  }
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="brand" size="xs">
                      {project.platform}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={isCompleted ? 'success' : 'slate'}
                        dot={isCompleted}
                        size="xs"
                      >
                        {project.status}
                      </Badge>

                      {/* Dropdown Options */}
                      <Dropdown
                        items={[
                          {
                            id: 'open',
                            label: 'Open Workspace',
                            icon: <ExternalLink className="w-3.5 h-3.5" />,
                            onClick: () => {
                              storage.setActiveProjectId(project.id);
                              onSelectProject(project);
                              onOpenWorkspace(project);
                            },
                          },
                          {
                            id: 'duplicate',
                            label: 'Duplicate Project',
                            icon: <Copy className="w-3.5 h-3.5" />,
                            onClick: () => {
                              const dup = storage.duplicateProject(project.id);
                              if (dup) {
                                setProjects(storage.getProjects());
                                toast.success('Duplicated', dup.title);
                              }
                            },
                          },
                          {
                            id: 'delete',
                            label: 'Delete Project',
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            danger: true,
                            onClick: () => {
                              if (confirm(`Delete "${project.title}"?`)) {
                                storage.deleteProject(project.id);
                                setProjects(storage.getProjects());
                                toast.info('Deleted', project.title);
                              }
                            },
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {project.script}
                  </p>

                  {/* Badges / Metrics row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center mb-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Scenes</span>
                      <div className="text-xs font-bold text-slate-800">{sceneCount}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Shots</span>
                      <div className="text-xs font-bold text-indigo-600">{shotCount}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration</span>
                      <div className="text-xs font-bold text-slate-800">{durationDisplay}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Last edited Today
                  </span>
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    {isCompleted ? 'Open Plan' : 'Continue'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
