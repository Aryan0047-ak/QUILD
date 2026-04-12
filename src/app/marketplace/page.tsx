'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  Users,
  DollarSign,
  Briefcase,
  Edit,
  Trash2,
  X,
  ShoppingCart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useOSPC } from '@/lib/ospc-store';
import { Modal, ConfirmModal } from '@/components/Modal';
import { Listing, ListingType, ListingStatus } from '@/lib/ospc-types';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const typeConfig: Record<ListingType, { label: string; color: string; bg: string }> = {
  technology: { label: 'Technology', color: 'text-blue-400', bg: 'bg-blue-400/20' },
  patent: { label: 'Patent', color: 'text-purple-400', bg: 'bg-purple-400/20' },
  trademark: { label: 'Trademark', color: 'text-orange-400', bg: 'bg-orange-400/20' },
  data: { label: 'Data', color: 'text-green-400', bg: 'bg-green-400/20' },
};

const statusConfig: Record<ListingStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-green-400' },
  pending: { label: 'Pending', color: 'text-yellow-400' },
  sold: { label: 'Sold', color: 'text-gray-400' },
  withdrawn: { label: 'Withdrawn', color: 'text-red-400' },
};

interface ListingFormProps {
  listing?: Listing;
  onSubmit: (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

function ListingForm({ listing, onSubmit, onClose }: ListingFormProps) {
  const [formData, setFormData] = useState({
    title: listing?.title || '',
    type: listing?.type || 'technology' as ListingType,
    status: listing?.status || 'active' as ListingStatus,
    sellerId: listing?.sellerId || '1',
    sellerName: listing?.sellerName || 'Admin',
    price: listing?.price || 0,
    change: listing?.change || 0,
    views: listing?.views || 0,
    likes: listing?.likes || 0,
    category: listing?.category || '',
    description: listing?.description || '',
    trl: listing?.trl || 5,
    techStack: listing?.techStack || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, images: listing?.images || [], details: listing?.details || {} });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field w-full" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as ListingType })} className="input-field w-full">
            <option value="technology">Technology</option>
            <option value="patent">Patent</option>
            <option value="trademark">Trademark</option>
            <option value="data">Data</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className="input-field w-full" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field w-full" placeholder="AI/ML, Biotech, etc." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field w-full h-24 resize-none" />
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{listing ? 'Update' : 'Create'} Listing</button>
      </div>
    </form>
  );
}

export default function Marketplace() {
  const { listings, addActivity, createListing, updateListing, deleteListing, purchaseListing } = useOSPC();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ListingType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [confirmPurchase, setConfirmPurchase] = useState<Listing | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.sellerName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || l.type === category;
      return matchesSearch && matchesCategory;
    });
  }, [listings, search, category]);

  const stats = useMemo(() => ({
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    volume: listings.filter(l => l.status === 'sold').reduce((sum, l) => sum + l.price, 0),
  }), [listings]);

  const handleCreate = async (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createListing(data);
    addActivity({ type: 'marketplace', action: 'created', description: `New listing "${data.title}" created`, userId: '1', userName: 'Admin', relatedId: '' });
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingListing) {
      await updateListing(editingListing.id, data);
      addActivity({ type: 'marketplace', action: 'updated', description: `Listing "${data.title}" updated`, userId: '1', userName: 'Admin', relatedId: editingListing.id });
      setEditingListing(null);
      setIsModalOpen(false);
    }
  };

  const handlePurchase = async () => {
    if (confirmPurchase) {
      await purchaseListing(confirmPurchase.id, '1');
      addActivity({ type: 'marketplace', action: 'purchased', description: `Purchased "${confirmPurchase.title}"`, userId: '1', userName: 'Admin', relatedId: confirmPurchase.id });
      setConfirmPurchase(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm('Delete this listing?')) {
      await deleteListing(id);
      addActivity({ type: 'marketplace', action: 'deleted', description: `Listing "${title}" deleted`, userId: '1', userName: 'Admin', relatedId: '' });
    }
  };

  function formatCurrency(value: number): string {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div className="flex items-start justify-between" variants={item}>
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-[var(--text-secondary)] mt-1">Buy and sell IP assets</p>
        </div>
        <button onClick={() => { setEditingListing(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Listing
        </button>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={item}>
        {[
          { label: 'Total Listings', value: stats.total, icon: Store },
          { label: 'Active Deals', value: stats.active, icon: Briefcase },
          { label: 'Total Volume', value: formatCurrency(stats.volume), icon: DollarSign },
          { label: 'Buyers', value: '456', icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="premium-card p-5">
            <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center"><stat.icon className="w-5 h-5 text-[var(--text-secondary)]" /></div>
            <p className="text-2xl font-bold mt-3">{stat.value}</p>
            <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div className="premium-card p-6" variants={item}>
        <h3 className="text-lg font-semibold mb-4">Market Activity</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[{ month: 'Jan', value: 120 }, { month: 'Feb', value: 180 }, { month: 'Mar', value: 150 }, { month: 'Apr', value: 220 }, { month: 'May', value: 280 }, { month: 'Jun', value: 350 }]}>
              <defs><linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E5E5E5" stopOpacity={0.3}/><stop offset="95%" stopColor="#E5E5E5" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#E5E5E5" strokeWidth={2} fillOpacity={1} fill="url(#colorMarket)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="flex flex-col md:flex-row gap-4 items-start md:items-center" variants={item}>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'technology', 'patent', 'trademark', 'data'] as const).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2.5 rounded-xl transition-all ${category === cat ? 'bg-[var(--accent)] text-[var(--background)]' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              <span className="font-medium capitalize">{cat === 'all' ? 'All' : cat}</span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search marketplace..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 pr-4 py-2.5 w-72" />
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" variants={item}>
        {filteredListings.map((listing) => {
          const type = typeConfig[listing.type];
          const status = statusConfig[listing.status];
          return (
            <motion.div key={listing.id} className="premium-card p-5 group cursor-pointer" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <div className="flex items-start justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs ${type.bg} ${type.color}`}>{type.label}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); setEditingListing(listing); setIsModalOpen(true); }} className="p-1.5 hover:bg-[var(--surface)] rounded-lg"><Edit className="w-4 h-4 text-[var(--text-muted)]" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(listing.id, listing.title); }} className="p-1.5 hover:bg-[var(--surface)] rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-base line-clamp-2">{listing.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">{listing.sellerName}</p>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-2">{listing.description}</p>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{formatCurrency(listing.price)}</span>
                  <div className={`flex items-center gap-1 text-sm ${listing.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {listing.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {listing.change >= 0 ? '+' : ''}{listing.change}%
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{listing.views}</div>
                <div className="flex items-center gap-1"><Heart className="w-4 h-4" />{listing.likes}</div>
                {listing.status === 'active' && (
                  <button onClick={(e) => { e.stopPropagation(); setConfirmPurchase(listing); }} className="ml-auto btn-primary py-1 px-3 text-xs">Buy</button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingListing(null); }} title={editingListing ? 'Edit Listing' : 'Create Listing'} size="lg">
        <ListingForm listing={editingListing || undefined} onSubmit={editingListing ? handleUpdate : handleCreate} onClose={() => { setIsModalOpen(false); setEditingListing(null); }} />
      </Modal>

      <ConfirmModal isOpen={!!confirmPurchase} onClose={() => setConfirmPurchase(null)} onConfirm={handlePurchase} title="Purchase Listing" message={`Are you sure you want to purchase "${confirmPurchase?.title}" for ${formatCurrency(confirmPurchase?.price || 0)}?`} confirmLabel="Purchase" />
    </motion.div>
  );
}
