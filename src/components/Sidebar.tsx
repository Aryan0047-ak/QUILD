'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ShieldCheck, 
  FilePen, 
  Store, 
  DollarSign,
  Settings,
  ChevronRight,
  Users,
  Vote,
  Scale,
  Briefcase,
  TrendingUp,
  FileSearch,
  Gavel,
  Heart
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/validation', label: 'Validation', icon: ShieldCheck },
  { href: '/ip', label: 'IP / Patents', icon: FilePen },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/governance', label: 'Governance', icon: Vote, new: true },
  { href: '/contributors', label: 'Contributors', icon: Users, new: true },
  { href: '/royalties', label: 'Royalties', icon: Heart, new: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col z-50 overflow-y-auto">
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gradient">QUILD</h1>
            <p className="text-xs text-[var(--text-muted)]">OSPC Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 mb-2">Core</div>
        {navItems.slice(0, 6).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                isActive 
                  ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent)] rounded-r-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              <ChevronRight className={clsx(
                "w-4 h-4 ml-auto transition-transform duration-200",
                isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )} />
            </Link>
          );
        })}

        <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 mt-6 mb-2">OSPC Features</div>
        {navItems.slice(6).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                isActive 
                  ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavOSPC"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent)] rounded-r-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              {item.new && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">NEW</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}