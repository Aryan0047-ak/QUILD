'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  FileText,
  Check,
  X,
  Eye
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useOSPC } from '@/lib/ospc-store';
import { Modal, ConfirmModal } from '@/components/Modal';
import { Validation, ValidationStatus, ValidationType } from '@/lib/ospc-types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const statusConfig: Record<ValidationStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  pending: { icon: <AlertTriangle className="w-3 h-3" />, color: 'text-orange-400', bg: 'bg-orange-400/20', label: 'Pending' },
  in_review: { icon: <Clock className="w-3 h-3" />, color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'In Review' },
  verified: { icon: <CheckCircle2 className="w-3 h-3" />, color: 'text-green-400', bg: 'bg-green-400/20', label: 'Verified' },
  rejected: { icon: <XCircle className="w-3 h-3" />, color: 'text-red-400', bg: 'bg-red-400/20', label: 'Rejected' },
};

interface ValidationFormProps {
  validation?: Validation;
  onSubmit: (data: Omit<Validation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

function ValidationForm({ validation, onSubmit, onClose }: ValidationFormProps) {
  const { projects } = useOSPC();
  const [formData, setFormData] = useState({
    name: validation?.name || '',
    type: validation?.type || 'technology' as ValidationType,
    projectId: validation?.projectId || '',
    projectName: validation?.projectName || '',
    status: validation?.status || 'pending' as ValidationStatus,
    score: validation?.score || 0,
    submitter: validation?.submitter || 'Admin',
    notes: validation?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === formData.projectId);
    onSubmit({ ...formData, projectName: project?.name || '', documents: validation?.documents || [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field w-full" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ValidationType })} className="input-field w-full">
            <option value="technology">Technology</option>
            <option value="patent">Patent</option>
            <option value="trademark">Trademark</option>
            <option value="copyright">Copyright</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Project</label>
          <select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} className="input-field w-full">
            <option value="">Select project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Submitter</label>
        <input type="text" value={formData.submitter} onChange={(e) => setFormData({ ...formData, submitter: e.target.value })} className="input-field w-full" />
      </div>
      {validation && (
        <div>
          <label className="block text-sm font-medium mb-2">Review Notes</label>
          <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-field w-full h-24 resize-none" placeholder="Add review notes..." />
        </div>
      )}
      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{validation ? 'Update' : 'Submit'} for Validation</button>
      </div>
    </form>
  );
}

export default function ValidationPage() {
  const { validations, addActivity, createValidation, updateValidation, approveValidation, rejectValidation } = useOSPC();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ValidationStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingValidation, setEditingValidation] = useState<Validation | null>(null);
  const [reviewData, setReviewData] = useState({ score: 0, notes: '' });

  const filteredValidations = useMemo(() => {
    return validations.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.projectName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [validations, search, statusFilter]);

  const stats = useMemo(() => ({
    verified: validations.filter(v => v.status === 'verified').length,
    in_review: validations.filter(v => v.status === 'in_review').length,
    pending: validations.filter(v => v.status === 'pending').length,
    rejected: validations.filter(v => v.status === 'rejected').length,
  }), [validations]);

  const handleCreate = async (data: Omit<Validation, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createValidation(data);
    addActivity({ type: 'validation', action: 'submitted', description: `Validation submitted for "${data.name}"`, userId: '1', userName: 'Admin', relatedId: '' });
    setIsModalOpen(false);
  };

  const handleApprove = async () => {
    if (editingValidation) {
      await approveValidation(editingValidation.id);
      addActivity({ type: 'validation', action: 'verified', description: `Validation approved for "${editingValidation.name}"`, userId: '1', userName: 'Admin', relatedId: editingValidation.id });
      setIsReviewModalOpen(false);
      setEditingValidation(null);
    }
  };

  const handleReject = async () => {
    if (editingValidation) {
      await rejectValidation(editingValidation.id);
      addActivity({ type: 'validation', action: 'rejected', description: `Validation rejected for "${editingValidation.name}"`, userId: '1', userName: 'Admin', relatedId: editingValidation.id });
      setIsReviewModalOpen(false);
      setEditingValidation(null);
    }
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold">Validation</h1>
        <p className="text-[var(--text-secondary)] mt-1">Verify and certify your IP assets</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        {[
          { label: 'Verified', value: stats.verified, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'In Review', value: stats.in_review, icon: Clock, color: 'text-yellow-400' },
          { label: 'Pending', value: stats.pending, icon: AlertTriangle, color: 'text-orange-400' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-400' },
        ].map((stat) => (
          <div key={stat.label} className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-[var(--text-muted)]">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold mt-3">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={item}>
        <div className="premium-card p-6">
          <h3 className="text-lg font-semibold mb-4">Validation Trends</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ week: 'W1', verified: 12 }, { week: 'W2', verified: 18 }, { week: 'W3', verified: 15 }, { week: 'W4', verified: 22 }]}>
                <defs><linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E5E5E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#E5E5E5" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Area type="monotone" dataKey="verified" stroke="#E5E5E5" strokeWidth={2} fillOpacity={1} fill="url(#colorVerified)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="premium-card p-6">
          <h3 className="text-lg font-semibold mb-4">Validation by Type</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ type: 'Technology', count: 89 }, { type: 'Patent', count: 67 }, { type: 'Trademark', count: 34 }, { type: 'Copyright', count: 28 }]}>
                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Bar dataKey="count" fill="#A3A3A3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div className="premium-card p-6" variants={item}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">All Validations</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 pr-4 py-2.5 w-64" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ValidationStatus | 'all')} className="input-field py-2.5 pr-8">
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="in_review">In Review</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Submit for Validation</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Name</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Type</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Project</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Score</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredValidations.map((validation) => {
                const status = statusConfig[validation.status];
                return (
                  <tr key={validation.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center"><FileText className="w-4 h-4 text-[var(--text-muted)]" /></div>
                        <div><p className="font-medium text-sm">{validation.name}</p><p className="text-xs text-[var(--text-muted)]">{validation.submitter}</p></div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">{validation.type}</td>
                    <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">{validation.projectName}</td>
                    <td className="py-4 px-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>{status.icon}{status.label}</span></td>
                    <td className="py-4 px-4">
                      {validation.score > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden"><div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${validation.score}%` }} /></div>
                          <span className="text-sm font-medium">{validation.score}</span>
                        </div>
                      ) : <span className="text-sm text-[var(--text-muted)]">—</span>}
                    </td>
                    <td className="py-4 px-4">
                      {validation.status === 'in_review' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditingValidation(validation); setIsReviewModalOpen(true); }} className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"><Eye className="w-4 h-4 text-[var(--text-muted)]" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit for Validation">
        <ValidationForm onSubmit={handleCreate} onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setEditingValidation(null); }} title="Review Validation" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Score (0-100)</label>
            <input type="number" min="0" max="100" value={reviewData.score} onChange={(e) => setReviewData({ ...reviewData, score: parseInt(e.target.value) || 0 })} className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Review Notes</label>
            <textarea value={reviewData.notes} onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })} className="input-field w-full h-24 resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <button onClick={handleReject} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"><X className="w-4 h-4" /> Reject</button>
            <button onClick={handleApprove} className="btn-primary flex items-center gap-2"><Check className="w-4 h-4" /> Approve</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
