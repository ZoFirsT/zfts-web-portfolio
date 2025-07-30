'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityDashboard from '@/components/SecurityDashboard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaShieldAlt, FaLock, FaExclamationTriangle, FaUserSecret, FaServer, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function SecurityPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      
      if (response.ok) {
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  useEffect(() => {
    // Check if the user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };
    
    checkAuth();
  }, []);

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-8 font-mono bg-primary text-white flex items-center justify-center"
      >
        <div className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm max-w-md w-full">
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-accent/20">
            <FaLock className="text-2xl text-red-400" />
            <h2 className="text-xl font-semibold text-textPrimary">Authentication Required</h2>
          </div>
          
          <p className="text-textSecondary mb-6">
            You need to be logged in to access the security dashboard.
          </p>
          
          <div className="flex justify-center">
            <Link 
              href="/login" 
              className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 font-mono bg-primary text-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm mb-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Terminal Header */}
          <motion.div 
            className="flex items-center gap-2 mb-6 pb-2 border-b border-accent/20"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex items-center gap-4 ml-2">
              <span className="text-textSecondary text-sm">zfts-monitor -- Security Dashboard</span>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ..
              </Link>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin/analytics"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../analytics
              </Link>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin/blog"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../blog
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-3xl text-accent" />
              <div>
                <h1 className="text-2xl font-bold text-textPrimary">Security Control Center</h1>
                <p className="text-textSecondary">Monitor and manage security threats</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/admin/analytics" 
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaServer /> Analytics Dashboard
              </Link>
              
              <Link
                href="/security/docs"
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaShieldAlt /> Security Docs
              </Link>
              
              <button
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
                onClick={() => window.open('https://zfts-docs.com/security-best-practices', '_blank')}
              >
                <FaCog /> Configuration Guide
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Security Dashboard */}
        <SecurityDashboard />
        
        {/* Additional Security Information */}
        <motion.div 
          className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-accent/20">
            <FaUserSecret className="text-2xl text-accent" />
            <h2 className="text-xl font-semibold text-textPrimary">Security Intelligence</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
              <h3 className="text-lg text-textPrimary mb-3">Threat Mitigation</h3>
              <ul className="space-y-2 text-textSecondary">
                <li className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-orange-400 mt-1 flex-shrink-0" />
                  <span>Use the blacklist downloads to block malicious IPs at the server or firewall level.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-orange-400 mt-1 flex-shrink-0" />
                  <span>Consider implementing Captcha challenges for suspicious IPs rather than outright blocking them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-orange-400 mt-1 flex-shrink-0" />
                  <span>Remember that some legitimate visitors may be behind shared IPs; use caution with permanent blocks.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
              <h3 className="text-lg text-textPrimary mb-3">Additional Protections</h3>
              <ul className="space-y-2 text-textSecondary">
                <li className="flex items-start gap-2">
                  <FaShieldAlt className="text-accent mt-1 flex-shrink-0" />
                  <span>Consider adding a Web Application Firewall (WAF) for additional protection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaShieldAlt className="text-accent mt-1 flex-shrink-0" />
                  <span>Implement strict Content Security Policies to prevent XSS attacks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaShieldAlt className="text-accent mt-1 flex-shrink-0" />
                  <span>Set up email alerts for security events requiring immediate attention.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
