'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaLock, FaHome } from 'react-icons/fa';

export default function TestNotFound() {
  return (
    <div className="min-h-screen bg-primary text-white dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="bg-secondary/30 p-8 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-3xl text-accent" />
          <h1 className="text-2xl font-bold text-textPrimary">Access Restricted</h1>
        </div>
        
        <p className="text-textSecondary mb-6">
          This section is only accessible from localhost for development and testing purposes.
        </p>
        
        <div className="p-4 bg-black/20 rounded-lg border border-red-500/30 mb-6">
          <p className="text-red-400">
            For security reasons, test routes can only be accessed from a local development environment.
          </p>
        </div>
        
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors"
        >
          <FaHome />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
} 