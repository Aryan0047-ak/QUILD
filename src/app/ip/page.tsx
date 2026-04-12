'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  FilePen, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Clock,
  Shield,
  FileText,
  Award,
  Briefcase,
  MapPin,
  Edit
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useOSPC } from '@/lib/ospc-store';
import { Modal } from '@/components/Modal';
import { Patent, Project } from '@/lib/ospc-types';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  granted: { icon: <Award className="w-3 h-3" />, color: 'text-green-400', bg: 'bg-green-400/20', label: 'Granted' },
  filed: { icon: <Clock className="w-3 h-3" />, color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'Filed' },
  examined: { icon: <Clock className="w-3 h-3" />, color: 'text-blue-400', bg: 'bg-blue-400/20', label: 'Examined' },
  draft: { icon: <FileText className="w-3 h-3" />, color: 'text-gray-400', bg: 'bg-gray-400/20', label: 'Draft' },
  rejected: { icon: <Shield className="w-3 h-3" />, color: 'text-red-400', bg: 'bg-red-400/20', label: 'Rejected' },
  expired: { icon: <Clock className="w-3 h-3" />, color: 'text-orange-400', bg: 'bg-orange-400/20', label: 'Expired' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function IP() {
  const { patents, projects, addActivity } = useOSPC();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPatents = useMemo(() => {
    return patents.filter((ip: Patent) => {
      const matchesSearch = ip.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patents, search, statusFilter]);

  const stats = useMemo(() => ({
    total: patents.length,
    granted: patents.filter(ip => ip.status === 'granted').length,
    pending: patents.filter(ip => ip.status === 'filed').length,
    value: patents.reduce((sum, ip) => sum + ip.valuation, 0),
  }), [patents]);

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div className="flex items-start justify-between" variants={item}>
        <div>
          <h1 className="text-3xl font-bold">IP / Patents</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your intellectual property portfolio</p>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><FilePen className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          <p className="text-2xl font-bold mt-3">{stats.total}</p>
          <p className="text-sm text-[var(--text-muted)]">Total IPs</p>
        </div>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-green-400/20 border border-green-400/30 flex items-center justify-center"><Award className="w-5 h-5 text-green-400" /></div>
          <p className="text-2xl font-bold mt-3">{stats.granted}</p>
          <p className="text-sm text-[var(--text-muted)]">Granted</p>
        </div>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-400" /></div>
          <p className="text-2xl font-bold mt-3">{stats.pending}</p>
          <p className="text-sm text-[var(--text-muted)]">Pending</p>
        </div>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><Briefcase className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.value)}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Value</p>
        </div>
      </motion.div>

      <motion.div className="premium-card p-6" variants={item}>
        <h3 className="text-lg font-semibold mb-4">Patent Activity</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { month: 'Jan', value: 4 }, { month: 'Feb', value: 6 }, { month: 'Mar', value: 3 },
              { month: 'Apr', value: 8 }, { month: 'May', value: 5 }, { month: 'Jun', value: 7 }
            ]}>
              <defs>
                <linearGradient id="colorPatents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E5E5E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#E5E5E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#E5E5E5" strokeWidth={2} fillOpacity={1} fill="url(#colorPatents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="premium-card p-6" variants={item}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">IP Portfolio</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search IPs..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 pr-4 py-2.5 w-64" />
            </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field py-2.5 pr-8">
              <option value="all">All Status</option>
              <option value="granted">Granted</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {filteredPatents.map((ip: Patent) => {
            const status = statusConfig[ip.status] || statusConfig.draft;
            return (
              <motion.div key={ip.id} className="p-5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center"><FileText className="w-6 h-6 text-[var(--text-muted)]" /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{ip.title}</h4>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${status.bg} ${status.color}`}>{status.icon}{status.label}</span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] mt-1">{ip.type} • Project #{ip.projectId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); }} className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"><Edit className="w-4 h-4 text-[var(--text-muted)]" /></button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-x-6 gap-y-2">
                  {ip.filingDate && <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Calendar className="w-4 h-4" />Filed: {ip.filingDate}</div>}
                  {ip.expiryDate && <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Clock className="w-4 h-4" />Expires: {ip.expiryDate}</div>}
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><MapPin className="w-4 h-4" />{ip.jurisdiction}</div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Briefcase className="w-4 h-4" />{ip.claims} claims</div>
                  <div className="ml-auto font-semibold">{formatCurrency(ip.valuation)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); }} title="IP / Patents" size="lg">
        <div className="text-center py-8 text-[var(--text-muted)]">Create new IP from the Validation page</div>
      </Modal>
    </motion.div>
  );
}
