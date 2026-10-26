import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  ExternalLink,
  Copy,
  Trash2,
  Calendar,
  Layers,
  Camera,
  LayoutGrid,
  List,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Project, NavigationPage } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Dropdown } from '../components/common/Dropdown';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { storage } from '../services/storage';
import { useToast } from '../components/common/Toast';

export interface ProjectsPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenWorkspace: (project: Project) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onNavigate,
  onOpenWorkspace,
}) => {
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Draft'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const toast = useToast();

  const handleDuplicate = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const duplicated = storage.duplicateProject(id);
    if (duplicated) {
      setProjects(storage.getProjects());
      toast.success('Project Duplicated', `Created "${duplicated.title}"`);
    }
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;
    storage.deleteProject(projectToDelete.id);
    setProjects(storage.getProjects());
    toast.info('Project Deleted', `Removed "${projectToDelete.title}"`);
    setProjectToDelete(null);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.script.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Project History</span>
            <Badge variant="brand" size="xs">
              {projects.length} Total
            </Badge>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your past and ongoing video production blueprints, shot lists, and scripts.
          </p>
        </div>

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

      {/* Search, Filter, and View Mode Bar (Section 25) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, platform, or script text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            {(['All', 'Completed', 'Draft'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
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

        {/* View Switcher: Grid vs Table */}
        <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 font-bold'
                : 'text-slate-400 border-slate-200 hover:bg-slate-50'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl border transition-colors ${
              viewMode === 'table'
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 font-bold'
                : 'text-slate-400 border-slate-200 hover:bg-slate-50'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty State when no results */}
      {filteredProjects.length === 0 && (
        <EmptyState
          title="No projects match your filter"
          description={searchQuery ? `No production plans found matching "${searchQuery}".` : "Your saved production plans will appear here."}
          actionText={searchQuery ? "Clear Search" : "Create New Plan"}
          onAction={() => {
            if (searchQuery) {
              setSearchQuery('');
              setStatusFilter('All');
            } else {
              onNavigate('create');
            }
          }}
        />
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredProjects.length > 0 && (
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
                onClick={() => onOpenWorkspace(project)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="brand" size="xs">
                      {project.platform}
                    </Badge>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Badge
                        variant={isCompleted ? 'success' : 'slate'}
                        dot={isCompleted}
                        size="xs"
                      >
                        {project.status}
                      </Badge>

                      <Dropdown
                        items={[
                          {
                            id: 'open',
                            label: 'Open Workspace',
                            icon: <ExternalLink className="w-3.5 h-3.5" />,
                            onClick: () => onOpenWorkspace(project),
                          },
                          {
                            id: 'duplicate',
                            label: 'Duplicate Project',
                            icon: <Copy className="w-3.5 h-3.5" />,
                            onClick: () => handleDuplicate(project.id),
                          },
                          {
                            id: 'delete',
                            label: 'Delete Project',
                            icon: <Trash2 className="w-3.5 h-3.5" />,
                            danger: true,
                            onClick: () => setProjectToDelete(project),
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
                    <Calendar className="w-3 h-3" /> Today
                  </span>
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Open Plan <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View (Section 25 of prompt) */}
      {viewMode === 'table' && filteredProjects.length > 0 && (
        <Card className="p-0 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-3">Platform</th>
                  <th className="py-3.5 px-3">Duration</th>
                  <th className="py-3.5 px-3">Scenes</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => {
                  const sceneCount = project.plan?.summary.sceneCount || (project.title.includes('Campus') ? 8 : 6);
                  const isCompleted = project.status === 'Completed';

                  return (
                    <tr
                      key={project.id}
                      onClick={() => onOpenWorkspace(project)}
                      className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                          {project.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{project.script}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge variant="brand" size="xs">{project.platform}</Badge>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                        {project.plan?.summary.totalDuration || project.targetDuration}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{sceneCount} scenes</td>
                      <td className="py-3.5 px-3">
                        <Badge variant={isCompleted ? 'success' : 'slate'} dot={isCompleted} size="xs">
                          {project.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">Today</td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenWorkspace(project)}
                            className="p-1 rounded text-indigo-600 hover:bg-indigo-50"
                            title="Open Workspace"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(project.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(project)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Delete Project Plan?"
        description={`Are you sure you want to permanently delete "${projectToDelete?.title}"? This action cannot be undone.`}
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Yes, Delete Project
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-500 py-2">
          All generated scenes, shot lists, and gear checklists associated with this project will be removed from your local storage.
        </p>
      </Modal>
    </div>
  );
};
