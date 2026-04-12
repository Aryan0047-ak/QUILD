'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Medal,
  Star,
  Clock,
  GitCommit,
  Eye,
  Shield,
  Zap,
  Crown,
  ArrowUpRight,
  Copy
} from 'lucide-react';
import { useOSPC } from '@/lib/ospc-store';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const roleColors = {
  founder: 'text-yellow-400 bg-yellow-400/20',
  steward: 'text-purple-400 bg-purple-400/20',
  maintainer: 'text-blue-400 bg-blue-400/20',
  contributor: 'text-gray-400 bg-gray-400/20',
};

const roleIcons = {
  founder: Crown,
  steward: Shield,
  maintainer: Star,
  contributor: Users,
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function Contributors() {
  const { contributors, omus, royaltyPayments, getCVScore, getOMUTotal } = useOSPC();

  const stats = useMemo(() => ({
    totalContributors: contributors.length,
    avgCV: Math.round(contributors.reduce((sum, c) => sum + c.cvScore.total, 0) / contributors.length),
    totalRoyalties: royaltyPayments.reduce((sum, r) => sum + r.netAmount, 0),
    totalOMU: omus.reduce((sum, o) => sum + o.amount, 0),
  }), [contributors, omus, royaltyPayments]);

  const sortedByCV = useMemo(() => {
    return [...contributors].sort((a, b) => b.cvScore.total - a.cvScore.total);
  }, [contributors]);

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold">Contributor Ecosystem</h1>
        <p className="text-[var(--text-secondary)] mt-1">CV Engine scoring, OMU holdings, and reputation tracking</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><Users className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          <p className="text-2xl font-bold mt-3">{stats.totalContributors}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Contributors</p>
        </div>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-400/20 border border-blue-400/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
          <p className="text-2xl font-bold mt-3">{stats.avgCV}</p>
          <p className="text-sm text-[var(--text-muted)]">Average CV Score</p>
        </div>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-green-400/20 border border-green-400/30 flex items-center justify-center"><Award className="w-5 h-5 text-green-400" /></div>
          <p className="text-2xl font-bold mt-3">₹{formatNumber(stats.totalRoyalties)}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Royalties Paid</p>
        </div>
        <div className="premium-card p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-400/20 border border-purple-400/30 flex items-center justify-center"><Zap className="w-5 h-5 text-purple-400" /></div>
          <p className="text-2xl font-bold mt-3">{formatNumber(stats.totalOMU)}</p>
          <p className="text-sm text-[var(--text-muted)]">Total OMU Minted</p>
        </div>
      </motion.div>

      <motion.div className="premium-card p-6" variants={item}>
        <h3 className="text-lg font-semibold mb-4">CV Score Leaderboard</h3>
        <div className="space-y-4">
          {sortedByCV.map((contributor, index) => {
            const cv = contributor.cvScore;
            const RoleIcon = roleIcons[contributor.role];
            
            return (
              <div key={contributor.id} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-400/20 text-yellow-400' : index === 1 ? 'bg-gray-300/20 text-gray-300' : index === 2 ? 'bg-amber-600/20 text-amber-600' : 'bg-[var(--surface)] text-[var(--text-muted)]'}`}>
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{contributor.name}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${roleColors[contributor.role]}`}>
                      <RoleIcon className="w-3 h-3" />{contributor.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><GitCommit className="w-3 h-3" />{cv.commitWeight} from commits</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{cv.reviewDepth} from reviews</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cv.temporalDecay} decay</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold">{cv.total}</p>
                  <p className="text-xs text-[var(--text-muted)]">CV Score</p>
                </div>
                
                {contributor.badges.length > 0 && (
                  <div className="flex gap-1">
                    {contributor.badges.slice(0, 3).map((badge) => (
                      <div key={badge.id} className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center" title={badge.name}>
                        <Award className="w-3 h-3 text-yellow-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div className="premium-card p-6" variants={item}>
          <h3 className="text-lg font-semibold mb-4">CV Score Breakdown</h3>
          {sortedByCV.slice(0, 3).map((contributor) => {
            const cv = contributor.cvScore;
            const maxScore = 1000;
            const metrics = [
              { label: 'Commit Weight', value: cv.commitWeight, color: 'bg-blue-400' },
              { label: 'Review Depth', value: cv.reviewDepth, color: 'bg-green-400' },
              { label: 'Test Coverage', value: cv.testCoverage, color: 'bg-purple-400' },
              { label: 'Semantic Quality', value: cv.semanticQuality, color: 'bg-yellow-400' },
              { label: 'Pair Programming', value: cv.pairProgramming, color: 'bg-pink-400' },
              { label: 'Issue Triage', value: cv.issueTriage, color: 'bg-cyan-400' },
            ];

            return (
              <div key={contributor.id} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{contributor.name}</span>
                  <span className="text-sm text-[var(--text-muted)]">Total: {cv.total}</span>
                </div>
                <div className="space-y-2">
                  {metrics.map((m) => (
                    <div key={m.label} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-muted)] w-28">{m.label}</span>
                      <div className="flex-1 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                        <div className={`h-full ${m.color} rounded-full`} style={{ width: `${(m.value / maxScore) * 100}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div className="premium-card p-6" variants={item}>
          <h3 className="text-lg font-semibold mb-4">OMU Holdings & Royalties</h3>
          <div className="space-y-4">
            {sortedByCV.slice(0, 5).map((contributor) => {
              const omusHeld = omus.filter(o => o.contributorId === contributor.id);
              const totalOMU = omusHeld.reduce((sum, o) => sum + o.transferable, 0);
              const royalties = royaltyPayments.filter(r => r.recipientId === contributor.id).reduce((sum, r) => sum + r.netAmount, 0);

              return (
                <div key={contributor.id} className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{contributor.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-400">{contributor.role}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-[var(--text-muted)]">
                      <Zap className="w-3 h-3" />OMU: {totalOMU.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-[var(--text-muted)]">
                      <Award className="w-3 h-3" />₹{formatNumber(royalties)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}