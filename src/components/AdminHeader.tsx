'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaHome, FaNewspaper, FaChartBar, FaShieldAlt, FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';

type AdminHeaderProps = {
  activePage: 'dashboard' | 'blog' | 'analytics' | 'security';
};

export default function AdminHeader({ activePage }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-secondary/30 p-4 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm mb-6"
    >
      {/* Desktop Navigation */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin" className="text-textPrimary font-bold text-xl mr-2">Admin</Link>
          <div className="hidden md:flex items-center space-x-4 ml-6">
            <Link 
              href="/admin" 
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${activePage === 'dashboard' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
            >
              <FaHome size={14} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/blog" 
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${activePage === 'blog' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
            >
              <FaNewspaper size={14} />
              <span>Blog</span>
            </Link>
            <Link 
              href="/admin/analytics" 
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${activePage === 'analytics' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
            >
              <FaChartBar size={14} />
              <span>Analytics</span>
            </Link>
            <Link 
              href="/admin/security" 
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${activePage === 'security' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
            >
              <FaShieldAlt size={14} />
              <span>Security</span>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Logout button for desktop */}
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-1 text-accent hover:bg-secondary/50 rounded-md"
          >
            <FaSignOutAlt size={14} />
            <span>Logout</span>
          </button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-accent p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden pt-4 mt-4 border-t border-accent/20"
        >
          <div className="flex flex-col space-y-3">
            <Link 
              href="/admin" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activePage === 'dashboard' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome size={16} />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/blog" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activePage === 'blog' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaNewspaper size={16} />
              <span>Blog</span>
            </Link>
            <Link 
              href="/admin/analytics" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activePage === 'analytics' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaChartBar size={16} />
              <span>Analytics</span>
            </Link>
            <Link 
              href="/admin/security" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${activePage === 'security' ? 'bg-accent text-primary' : 'hover:bg-secondary/50'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaShieldAlt size={16} />
              <span>Security</span>
            </Link>
            <button 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleLogout(e);
              }}
              className="flex items-center justify-start gap-2 px-3 py-2 text-accent hover:bg-secondary/50 rounded-md"
            >
              <FaSignOutAlt size={16} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
