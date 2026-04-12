'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FolderKanban, 
  FilePen, 
  DollarSign,
  ArrowUpRight,
  Activity,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useOSPC } from '@/lib/ospc-store';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
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

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function Dashboard() {
  const { projects, patents, transactions, activities } = useOSPC();

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeIPs = patents.length;
    const totalRevenue = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const investorCount = 156; 
    
    return { totalProjects, activeIPs, totalRevenue, investorCount };
  }, [projects, patents, transactions]);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({ month, value: Math.floor(Math.random() * 500 + 300) }));
  }, []);

  const ownershipData = [
    { name: 'Founders', value: 45, color: '#E5E5E5' },
    { name: 'Investors', value: 30, color: '#A3A3A3' },
    { name: 'Team', value: 15, color: '#737373' },
    { name: 'Reserve', value: 10, color: '#525252' },
  ];

  const kpiData = [
    { label: 'Total Projects', value: stats.totalProjects.toString(), change: '+12.5%', trend: 'up', icon: FolderKanban },
    { label: 'Active IPs', value: stats.activeIPs.toString(), change: '+8.2%', trend: 'up', icon: FilePen },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), change: '+23.1%', trend: 'up', icon: DollarSign },
    { label: 'Investors', value: stats.investorCount.toString(), change: '+4.3%', trend: 'up', icon: Users },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return FolderKanban;
      case 'ip': return FilePen;
      case 'revenue': return DollarSign;
      case 'validation': return Activity;
      default: return Activity;
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 className="text-3xl font-bold" variants={item}>
            Command Center
          </motion.h1>
          <motion.p className="text-[var(--text-secondary)] mt-1" variants={item}>
            Real-time overview of your IP portfolio
          </motion.p>
        </div>
        <motion.div className="flex items-center gap-2 text-sm text-[var(--text-muted)]" variants={item}>
          <Clock className="w-4 h-4" />
          Last updated: Just now
        </motion.div>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={item}>
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="premium-card p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[var(--text-secondary)]" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold">{kpi.value}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{kpi.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2 premium-card p-6" variants={item}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">IP Growth</h3>
              <p className="text-sm text-[var(--text-secondary)]">Monthly IP registrations</p>
            </div>
            <button className="btn-secondary text-sm py-2 px-4">
              View Details
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E5E5E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E5E5E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#E5E5E5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="premium-card p-6" variants={item}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Ownership</h3>
            <p className="text-sm text-[var(--text-secondary)]">Distribution across stakeholders</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ownershipData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {ownershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {ownershipData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-[var(--text-secondary)]">{entry.name}</span>
                </div>
                <span className="text-sm font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="premium-card p-6" variants={item}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Live Activity</h3>
            <p className="text-sm text-[var(--text-secondary)]">Real-time updates across platform</p>
          </div>
          <button className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatTimeAgo(activity.createdAt)}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
