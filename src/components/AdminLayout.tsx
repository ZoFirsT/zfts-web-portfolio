'use client';

import { motion } from 'framer-motion';
import AdminHeader from './AdminHeader';

type AdminLayoutProps = {
  children: React.ReactNode;
  activePage: 'dashboard' | 'blog' | 'analytics' | 'security';
};

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 md:p-8 font-mono bg-primary text-white"
    >
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Common Admin Header */}
        <AdminHeader activePage={activePage} />
        
        {/* Page Content */}
        <div className="space-y-4 sm:space-y-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
