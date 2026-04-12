'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Download,
  Calendar,
  Filter,
  Wallet,
  CreditCard,
  Building2,
  PiggyBank,
  Receipt,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useOSPC } from '@/lib/ospc-store';
import { Modal } from '@/components/Modal';
import { Transaction, TransactionType, TransactionCategory } from '@/lib/ospc-types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const categoryIcons: Record<TransactionCategory, React.ReactNode> = {
  investment: <Building2 className="w-4 h-4" />,
  licensing: <License className="w-4 h-4" />,
  sale: <DollarSign className="w-4 h-4" />,
  grant: <PiggyBank className="w-4 h-4" />,
  royalty: <DollarSign className="w-4 h-4" />,
  legal: <Receipt className="w-4 h-4" />,
  operations: <Wallet className="w-4 h-4" />,
  research: <Receipt className="w-4 h-4" />,
};

function License({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="6" width="18" height="12" rx="2"/></svg>;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

function TransactionForm({ transaction, onSubmit, onClose }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    type: transaction?.type || 'income' as TransactionType,
    category: transaction?.category || 'investment' as TransactionCategory,
    date: transaction?.date || new Date().toISOString().split('T')[0],
    status: transaction?.status || 'completed' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field w-full" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })} className="input-field w-full">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })} className="input-field w-full">
            <option value="investment">Investment</option>
            <option value="licensing">Licensing</option>
            <option value="sale">Sale</option>
            <option value="grant">Grant</option>
            <option value="royalty">Royalty</option>
            <option value="legal">Legal</option>
            <option value="operations">Operations</option>
            <option value="research">Research</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount ($)</label>
          <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })} className="input-field w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input-field w-full" />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{transaction ? 'Update' : 'Add'} Transaction</button>
      </div>
    </form>
  );
}

export default function Revenue() {
  const { transactions, addActivity, createTransaction, deleteTransaction } = useOSPC();
  const [timeRange, setTimeRange] = useState('6m');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, net: income - expenses };
  }, [transactions]);

  const chartData = useMemo(() => {
    return [
      { month: 'Jan', revenue: 850000, expenses: 120000 },
      { month: 'Feb', revenue: 920000, expenses: 145000 },
      { month: 'Mar', revenue: 780000, expenses: 98000 },
      { month: 'Apr', revenue: 1100000, expenses: 165000 },
      { month: 'May', revenue: 1250000, expenses: 210000 },
      { month: 'Jun', revenue: 980000, expenses: 135000 },
    ];
  }, []);

  const revenueBySource = useMemo(() => [
    { name: 'Licensing', value: 35, color: '#E5E5E5' },
    { name: 'Sales', value: 30, color: '#A3A3A3' },
    { name: 'Investments', value: 20, color: '#737373' },
    { name: 'Royalties', value: 15, color: '#525252' },
  ], []);

  const handleCreate = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    await createTransaction(data);
    addActivity({
      type: 'revenue',
      action: data.type === 'income' ? 'received' : 'expense',
      description: `${data.type === 'income' ? 'Received' : 'Paid'} ${formatCurrency(data.amount)}: ${data.description}`,
      userId: '1',
      userName: 'Admin',
      relatedId: ''
    });
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, description: string) => {
    if (confirm('Delete this transaction?')) {
      await deleteTransaction(id);
      addActivity({ type: 'revenue', action: 'deleted', description: `Transaction "${description}" deleted`, userId: '1', userName: 'Admin', relatedId: '' });
    }
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div className="flex items-start justify-between" variants={item}>
        <div>
          <h1 className="text-3xl font-bold">Revenue</h1>
          <p className="text-[var(--text-secondary)] mt-1">Track your income and expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Add Transaction</button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-green-400/20 border border-green-400/30 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-400" /></div>
            <span className="flex items-center gap-1 text-sm text-green-400"><ArrowUpRight className="w-4 h-4" />23.5%</span>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.income)}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Revenue</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-red-400/20 border border-red-400/30 flex items-center justify-center"><TrendingDown className="w-5 h-5 text-red-400" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.expenses)}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Expenses</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><Wallet className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(stats.net)}</p>
          <p className="text-sm text-[var(--text-muted)]">Net Income</p>
        </div>
        <div className="premium-card p-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><DollarSign className="w-5 h-5 text-[var(--text-secondary)]" /></div>
          </div>
          <p className="text-2xl font-bold mt-3">{formatCurrency(4200000)}</p>
          <p className="text-sm text-[var(--text-muted)]">Cash Balance</p>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={item}>
        <div className="lg:col-span-2 premium-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Revenue vs Expenses</h3>
              <p className="text-sm text-[var(--text-secondary)]">Monthly breakdown</p>
            </div>
            <div className="flex items-center gap-2">
              {(['1m', '3m', '6m', '1y'] as const).map((range) => (
                <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${timeRange === range ? 'bg-[var(--accent)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>{range}</button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E5E5E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#E5E5E5" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#525252" stopOpacity={0.3}/><stop offset="95%" stopColor="#525252" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Area type="monotone" dataKey="revenue" stroke="#E5E5E5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#525252" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Revenue by Source</h3>
            <p className="text-sm text-[var(--text-secondary)]">Distribution</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueBySource} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {revenueBySource.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {revenueBySource.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} /><span className="text-sm text-[var(--text-secondary)]">{source.name}</span></div>
                <span className="text-sm font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div className="premium-card p-6" variants={item}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">View All <ArrowUpRight className="w-4 h-4" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Description</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Category</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-[var(--text-secondary)]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-green-400/20' : 'bg-red-400/20'}`}>
                        {tx.type === 'income' ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
                      </div>
                      <span className="font-medium text-sm">{tx.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-[var(--text-secondary)]">{tx.category}</td>
                  <td className="py-4 px-4 text-sm text-[var(--text-muted)]">{tx.date}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${tx.status === 'completed' ? 'bg-green-400/20 text-green-400' : tx.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-400/20 text-red-400'}`}>{tx.status}</span>
                  </td>
                  <td className={`py-4 px-4 text-right font-medium ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm transaction={editingTransaction || undefined} onSubmit={handleCreate} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} />
      </Modal>
    </motion.div>
  );
}
