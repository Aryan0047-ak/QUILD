'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Building2,
  Receipt,
  RefreshCw,
  Filter,
  Download
} from 'lucide-react';
import { useOSPC } from '@/lib/ospc-store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export default function Royalties() {
  const { royaltyPayments, contributors, projects, licenses } = useOSPC();

  const stats = useMemo(() => {
    const completed = royaltyPayments.filter(p => p.status === 'completed');
    const pending = royaltyPayments.filter(p => p.status === 'pending');
    
    const totalPaid = completed.reduce((sum, p) => sum + p.netAmount, 0);
    const totalPending = pending.reduce((sum, p) => sum + p.convertedInr, 0);
    const totalTax = completed.reduce((sum, p) => sum + p.taxDeducted, 0);
    const avgPayment = completed.length > 0 ? totalPaid / completed.length : 0;

    return { totalPaid, totalPending, totalTax, avgPayment, completedCount: completed.length, pendingCount: pending.length };
  }, [royaltyPayments]);

  const byContributor = useMemo(() => {
    const map: Record<string, { contributor: typeof contributors[0]; total: number; count: number }> = {};
    royaltyPayments.filter(p => p.status === 'completed').forEach(p => {
      if (!map[p.recipientId]) {
        const c = contributors.find(con => con.id === p.recipientId);
        if (c) map[p.recipientId] = { contributor: c, total: 0, count: 0 };
      }
      if (map[p.recipientId]) {
        map[p.recipientId].total += p.netAmount;
        map[p.recipientId].count += 1;
      }
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [royaltyPayments, contributors]);

  const byProject = useMemo(() => {
    const map: Record<string, { project: typeof projects[0]; total: number }> = {};
    royaltyPayments.filter(p => p.status === 'completed').forEach(p => {
      const proj = projects.find(pr => pr.id === p.projectId);
      if (proj && !map[p.projectId]) map[p.projectId] = { project: proj, total: 0 };
      if (map[p.projectId]) map[p.projectId].total += p.netAmount;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [royaltyPayments, projects]);

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div className="flex items-start justify-between" variants={item}>
        <div>
          <h1 className="text-3xl font-bold">Royalties Engine</h1>
          <p className="text-[var(--text-secondary)] mt-1">Real-time gross settlement, micropayment accumulator, and tax compliance</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><Filter className="w-4 h-4" />Filter</button>
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-green-400/20 border border-green-400/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-400" /></div>
            <span className="flex items-center gap-1 text-sm text-green-400"><ArrowUpRight className="w-4 h-4" />+18.5%</span>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.totalPaid)}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Paid</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-400" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.totalPending)}</p>
          <p className="text-sm text-[var(--text-muted)]">Pending Distribution</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-red-400/20 border border-red-400/30 flex items-center justify-center"><Receipt className="w-5 h-5 text-red-400" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.totalTax)}</p>
          <p className="text-sm text-[var(--text-muted)]">TDS Deducted (194-O)</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><DollarSign className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.avgPayment)}</p>
          <p className="text-sm text-[var(--text-muted)]">Average Payment</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="premium-card p-6" variants={item}>
          <h3 className="text-lg font-semibold mb-4">Royalties by Contributor</h3>
          <div className="space-y-4">
            {byContributor.map((entry) => (
              <div key={entry.contributor.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center text-white font-semibold text-sm">
                    {entry.contributor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.contributor.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{entry.count} payments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(entry.total)}</p>
                  <p className="text-xs text-green-400">Received</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="premium-card p-6" variants={item}>
          <h3 className="text-lg font-semibold mb-4">Royalties by Project</h3>
          <div className="space-y-4">
            {byProject.map((entry) => {
              const licensesCount = licenses.filter(l => l.projectId === entry.project.id && l.status === 'active').length;
              return (
                <div key={entry.project.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <div>
                    <p className="font-medium text-sm">{entry.project.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{licensesCount} active licenses</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(entry.total)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div className="premium-card p-6" variants={item}>
        <h3 className="text-lg font-semibold mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Recipient</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Project</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Amount</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Method</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">TDS</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Net</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Date</th>
              </tr>
            </thead>
            <tbody>
              {royaltyPayments.slice(0, 10).map((payment) => {
                const recipient = contributors.find(c => c.id === payment.recipientId);
                const project = projects.find(p => p.id === payment.projectId);
                const statusConfig = payment.status === 'completed' ? { icon: CheckCircle2, color: 'text-green-400' } : payment.status === 'pending' ? { icon: Clock, color: 'text-yellow-400' } : { icon: AlertCircle, color: 'text-red-400' };
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={payment.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-elevated)]">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xs font-medium">
                          {recipient?.name.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <span className="text-sm font-medium">{recipient?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">{project?.name || '-'}</td>
                    <td className="py-4 px-4 text-sm">{formatCurrency(payment.convertedInr)}</td>
                    <td className="py-4 px-4 text-sm text-[var(--text-muted)] uppercase">{payment.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-4 px-4 text-sm text-red-400">-{formatCurrency(payment.taxDeducted)}</td>
                    <td className="py-4 px-4 text-sm font-medium text-green-400">{formatCurrency(payment.netAmount)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-400/20 text-green-400' : payment.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'}`}>
                        <StatusIcon className="w-3 h-3" />{payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-[var(--text-muted)]">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={item}>
        <div className="premium-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center"><Wallet className="w-6 h-6 text-blue-400" /></div>
          <div>
            <p className="font-semibold">Micropayment Wallet</p>
            <p className="text-xs text-[var(--text-muted)]">Auto-aggregate &lt;₹100</p>
          </div>
        </div>
        <div className="premium-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center"><CreditCard className="w-6 h-6 text-green-400" /></div>
          <div>
            <p className="font-semibold">RTGS for &gt;₹10L</p>
            <p className="text-xs text-[var(--text-muted)]">Auto-rail selection</p>
          </div>
        </div>
        <div className="premium-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center"><Building2 className="w-6 h-6 text-purple-400" /></div>
          <div>
            <p className="font-semibold">Auto GST Invoice</p>
            <p className="text-xs text-[var(--text-muted)]">Compliant with Rules 2017</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}