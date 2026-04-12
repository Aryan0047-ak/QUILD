'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  Vote, 
  Scale, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Users,
  TrendingUp,
  Filter,
  Plus,
  Gavel,
  Shield,
  Zap,
  MessageSquare,
  AlertOctagon
} from 'lucide-react';
import { useOSPC } from '@/lib/ospc-store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const statusConfig = {
  draft: { icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-400/20', label: 'Draft' },
  signaling: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/20', label: 'Signaling' },
  voting: { icon: Vote, color: 'text-yellow-400', bg: 'bg-yellow-400/20', label: 'Voting' },
  passed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/20', label: 'Passed' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/20', label: 'Rejected' },
  executed: { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/20', label: 'Executed' },
};

export default function Governance() {
  const { proposals, projects, contributors, createProposal, vote, executeProposal } = useOSPC();
  const [filter, setFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeProposals = useMemo(() => {
    return proposals.filter(p => {
      if (filter === 'all') return true;
      if (filter === 'active') return ['signaling', 'voting'].includes(p.status);
      return p.status === filter;
    });
  }, [proposals, filter]);

  const stats = useMemo(() => ({
    active: proposals.filter(p => ['signaling', 'voting'].includes(p.status)).length,
    passed: proposals.filter(p => p.status === 'passed' || p.status === 'executed').length,
    totalVotes: proposals.reduce((sum, p) => sum + p.votesFor + p.votesAgainst, 0),
    avgParticipation: proposals.length > 0 ? Math.round(proposals.reduce((sum, p) => {
      const total = p.votesFor + p.votesAgainst + p.abstain;
      return sum + (total > 0 ? (p.votesFor / total) * 100 : 0);
    }, 0) / proposals.filter(p => p.votesFor + p.votesAgainst + p.abstain > 0).length || 0) : 0,
  }), [proposals]);

  const handleVote = async (proposalId: string, support: boolean) => {
    await vote(proposalId, support, 100); // Weight would come from user OMU holdings
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold">Decentralised Governance</h1>
        <p className="text-[var(--text-secondary)] mt-1">Liquid democracy, conviction voting, and community decision-making</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center"><Vote className="w-5 h-5 text-yellow-400" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.active}</p>
          <p className="text-sm text-[var(--text-muted)]">Active Proposals</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-green-400/20 border border-green-400/30 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-green-400" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.passed}</p>
          <p className="text-sm text-[var(--text-muted)]">Passed</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><Users className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.totalVotes.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Votes</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><TrendingUp className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.avgParticipation}%</p>
          <p className="text-sm text-[var(--text-muted)]">Participation</p>
        </div>
      </motion.div>

      <motion.div className="flex items-center gap-2" variants={item}>
        {['all', 'active', 'passed', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-[var(--accent)] text-[var(--background)]' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={() => setShowCreateModal(true)} className="btn-primary ml-auto flex items-center gap-2"><Plus className="w-4 h-4" />New Proposal</button>
      </motion.div>

      <motion.div className="space-y-4" variants={item}>
        {activeProposals.map((proposal) => {
          const status = statusConfig[proposal.status as keyof typeof statusConfig] || statusConfig.draft;
          const StatusIcon = status.icon;
          const project = projects.find(p => p.id === proposal.projectId);
          const creator = contributors.find(c => c.id === proposal.createdBy);
          const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.abstain;
          const forPercent = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;

          return (
            <div key={proposal.id} className="premium-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />{status.label}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">{project?.name || 'Platform-wide'}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{proposal.title}</h3>
                </div>
                {proposal.status === 'voting' && (
                  <div className="text-right">
                    <p className="text-sm text-[var(--text-muted)]">Ends {new Date(proposal.endsAt).toLocaleDateString()}</p>
                    <p className="text-xs text-[var(--text-muted)]">Conviction: {proposal.conviction}</p>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-[var(--text-secondary)] mb-4">{proposal.description}</p>
              
              {['voting', 'passed', 'rejected'].includes(proposal.status) && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${forPercent}%` }} />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{forPercent}%</span>
                  </div>
                  <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                    <span>For: {proposal.votesFor.toLocaleString()}</span>
                    <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                    <span>Abstain: {proposal.abstain.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div className="text-xs text-[var(--text-muted)]">
                  Proposed by {creator?.name} • {new Date(proposal.createdAt).toLocaleDateString()}
                </div>
                {proposal.status === 'voting' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleVote(proposal.id, false)} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm">Against</button>
                    <button onClick={() => handleVote(proposal.id, true)} className="btn-primary py-2 px-4 text-sm">For</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {activeProposals.length === 0 && (
        <motion.div className="text-center py-20" variants={item}>
          <Vote className="w-16 h-16 mx-auto text-[var(--text-muted)] opacity-50" />
          <p className="text-[var(--text-secondary)] mt-4">No proposals found</p>
        </motion.div>
      )}
    </motion.div>
  );
}