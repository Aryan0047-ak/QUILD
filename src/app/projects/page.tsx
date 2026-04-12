'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  Brain, 
  Dna, 
  Cpu, 
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useOSPC } from '@/lib/ospc-store';
import { Modal } from '@/components/Modal';
import { Project, ProjectCategory, ProjectStatus } from '@/lib/ospc-types';

const categoryIcons: Record<ProjectCategory, React.ReactNode> = {
  ai: <Brain className="w-6 h-6" />,
  biotech: <Dna className="w-6 h-6" />,
  hardware: <Cpu className="w-6 h-6" />,
  blockchain: <Cpu className="w-6 h-6" />,
  quantum: <Cpu className="w-6 h-6" />,
};

const categoryGradients: Record<ProjectCategory, string> = {
  ai: 'from-gray-300 to-gray-500',
  biotech: 'from-gray-400 to-gray-600',
  hardware: 'from-gray-500 to-gray-700',
  blockchain: 'from-gray-500 to-gray-700',
  quantum: 'from-gray-300 to-gray-500',
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

function ProjectForm({ project, onSubmit, onClose }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    category: project?.category || 'ai' as ProjectCategory,
    status: project?.status || 'pending' as ProjectStatus,
    description: project?.description || '',
    ipCount: project?.ipCount || 0,
    value: project?.value || 0,
    growth: project?.growth || 0,
    owner: project?.owner || '1',
    tags: project?.tags || [],
    trl: project?.trl || 5,
    contributors: project?.contributors || ['1'],
    vestingConfig: project?.vestingConfig || { cliff: 6, duration: 24 },
    governanceModel: project?.governanceModel || 'omu_weighted' as const,
    treasury: project?.treasury || 0,
    licenses: project?.licenses || [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Project Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field w-full"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
            className="input-field w-full"
          >
            <option value="ai">AI</option>
            <option value="biotech">Biotech</option>
            <option value="hardware">Hardware</option>
            <option value="blockchain">Blockchain</option>
            <option value="quantum">Quantum</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            className="input-field w-full"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field w-full h-24 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Value ($)</label>
          <input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
            className="input-field w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Growth (%)</label>
          <input
            type="number"
            value={formData.growth}
            onChange={(e) => setFormData({ ...formData, growth: parseInt(e.target.value) || 0 })}
            className="input-field w-full"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="input-field flex-1"
            placeholder="Add tag and press Enter"
          />
          <button type="button" onClick={addTag} className="btn-secondary px-3">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--surface-elevated)] rounded-full text-xs">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{project ? 'Update' : 'Create'} Project</button>
      </div>
    </form>
  );
}

export default function Projects() {
  const { projects, patents, addActivity, createProject, updateProject, deleteProject } = useOSPC();
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = filter === 'all' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projects, filter, search]);

  const handleCreateProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createProject(data);
    addActivity({ type: 'project', action: 'created', description: `New project "${data.name}" created`, userId: '1', userName: 'Admin', relatedId: '' });
    setIsModalOpen(false);
  };

  const handleUpdateProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
      addActivity({ type: 'project', action: 'updated', description: `Project "${data.name}" updated`, userId: '1', userName: 'Admin', relatedId: editingProject.id });
      setEditingProject(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      addActivity({ type: 'project', action: 'deleted', description: `Project "${name}" deleted`, userId: '1', userName: 'Admin', relatedId: '' });
    }
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage and track your innovation portfolio</p>
      </motion.div>

      <motion.div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" variants={item}>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'ai', 'biotech', 'hardware', 'quantum'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                filter === cat ? 'bg-[var(--accent)] text-[var(--background)]' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'all' ? <FolderKanban className="w-5 h-5" /> : categoryIcons[cat]}
              <span className="font-medium capitalize">{cat === 'all' ? 'All Projects' : cat}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 pr-4 py-2.5 w-64" />
          </div>
          <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" variants={item}>
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            className="premium-card p-5 group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryGradients[project.category]} flex items-center justify-center opacity-80`}>
                {categoryIcons[project.category]}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); setEditingProject(project); setIsModalOpen(true); }} className="p-1.5 hover:bg-[var(--surface)] rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id, project.name); }} className="p-1.5 hover:bg-[var(--surface)] rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                {project.status === 'active' && <span className="w-2 h-2 rounded-full bg-green-400" />}
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{project.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">IP Assets</span>
                <span className="font-medium">{project.ipCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-[var(--text-muted)]">Value</span>
                <span className="font-medium">{formatCurrency(project.value)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs px-2.5 py-1 rounded-full ${
                project.status === 'active' ? 'bg-green-400/20 text-green-400' :
                project.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                project.status === 'completed' ? 'bg-blue-400/20 text-blue-400' :
                'bg-gray-400/20 text-gray-400'
              }`}>{project.status}</span>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />+{project.growth}%
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FolderKanban className="w-16 h-16 mx-auto text-[var(--text-muted)] opacity-50" />
          <p className="text-[var(--text-secondary)] mt-4">No projects found</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-4">Create your first project</button>
        </motion.div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingProject(null); }} title={editingProject ? 'Edit Project' : 'New Project'}>
        <ProjectForm project={editingProject || undefined} onSubmit={editingProject ? handleUpdateProject : handleCreateProject} onClose={() => { setIsModalOpen(false); setEditingProject(null); }} />
      </Modal>
    </motion.div>
  );
}
