'use client';

import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  return (
    <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search projects, IP, patents..."
            className="input-field w-full pl-12 pr-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-xl hover:bg-[var(--surface-elevated)] transition-colors">
          <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--accent)] rounded-full" />
        </button>
        
        <motion.div 
          className="flex items-center gap-3 pl-4 border-l border-[var(--border)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center">
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-[var(--text-muted)]">Pro Plan</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
