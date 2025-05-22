'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTerminal, FaChartBar, FaNewspaper, FaShieldAlt, FaUserCog, FaServer } from 'react-icons/fa';
import AdminHeader from '@/components/AdminHeader';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('admin');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // Check if the user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          if (data.username) setUserName(data.username);
          
          // Add initial command history
          setCommandHistory([
            '> Initializing admin interface...',
            '> Authenticating session...',
            '> Loading system components...',
            '> Ready'
          ]);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedCommand = command.trim().toLowerCase();
    setCommandHistory(prev => [...prev, `$ ${command}`]);
    
    // Process commands
    if (processedCommand === 'help') {
      setCommandHistory(prev => [...prev, 
        'Available commands:',
        '  help - Show this help message',
        '  clear - Clear the terminal',
        '  blog - Go to blog management',
        '  analytics - Go to analytics dashboard',
        '  security - Go to security dashboard',
        '  logout - Sign out of admin panel'
      ]);
    } else if (processedCommand === 'clear') {
      setCommandHistory([]);
    } else if (processedCommand === 'blog' || processedCommand === 'cd blog') {
      setCommandHistory(prev => [...prev, 'Redirecting to blog management...']);
      setTimeout(() => router.push('/admin/blog'), 500);
    } else if (processedCommand === 'analytics' || processedCommand === 'cd analytics') {
      setCommandHistory(prev => [...prev, 'Redirecting to analytics dashboard...']);
      setTimeout(() => router.push('/admin/analytics'), 500);
    } else if (processedCommand === 'security' || processedCommand === 'cd security') {
      setCommandHistory(prev => [...prev, 'Redirecting to security dashboard...']);
      setTimeout(() => router.push('/admin/security'), 500);
    } else if (processedCommand === 'logout' || processedCommand === 'exit') {
      setCommandHistory(prev => [...prev, 'Logging out...']);
      setTimeout(async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          router.push('/login');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }, 500);
    } else if (processedCommand === '') {
      // Do nothing for empty commands
    } else {
      setCommandHistory(prev => [...prev, `Command not found: ${command}. Type 'help' for available commands.`]);
    }
    
    setCommand('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 font-mono bg-primary text-white flex items-center justify-center">
        <motion.div 
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-accent text-lg"
        >
          Loading admin interface...
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen p-8 font-mono bg-primary text-white flex items-center justify-center"
      >
        <div className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm max-w-md w-full">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Authentication Required</h2>
          <p className="text-textSecondary mb-6">
            You need to be logged in to access the admin dashboard.
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

  function handleLogout(event: React.MouseEvent<HTMLSpanElement, MouseEvent>): void {
    event.preventDefault();
    setCommandHistory(prev => [...prev, 'Logging out...']);
    setTimeout(async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }, 500);
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 sm:p-6 md:p-8 font-mono bg-primary text-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Admin Header */}
        <AdminHeader activePage="dashboard" />
        
        <motion.div 
          className="bg-secondary/30 p-4 sm:p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm mb-6 sm:mb-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Terminal Header */}
          {/* Terminal Header */}
          <motion.div 
            className="flex items-center gap-2 mb-4 pb-2 border-b border-accent/20"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-2 flex items-center gap-4 w-full overflow-hidden">
              <span className="text-textSecondary text-sm truncate">zfts-admin -- Main Dashboard</span>
              
              <span className="ml-auto text-accent/80 hover:text-accent transition-colors duration-200 text-sm flex items-center gap-1 cursor-pointer whitespace-nowrap" onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">logout</span>
              </span>
            </div>
          </motion.div>
          
          {/* Terminal Output */}
          <div className="bg-secondary/40 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 h-60 sm:h-80 overflow-y-auto text-sm sm:text-base">
            <AnimatePresence>
              {commandHistory.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-1 ${
                    line.startsWith('$') ? 'text-accent' : 
                    line.startsWith('>') ? 'text-green-400' : 
                    line.startsWith('Command not found') ? 'text-red-400' : 
                    'text-textSecondary'
                  } break-words`}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Terminal Input */}
          <form onSubmit={handleCommand} className="flex items-center flex-wrap sm:flex-nowrap">
            <div className="text-accent mr-2 text-sm sm:text-base whitespace-nowrap">{userName}@zfts:~$</div>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-textPrimary text-sm sm:text-base w-full sm:w-auto"
              autoFocus
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              placeholder="Type 'help' for commands"
            />
          </form>
        </motion.div>

        {/* Quick Access Panel */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/admin/blog">
            <div className="bg-secondary/30 p-4 sm:p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm hover:bg-secondary/40 transition-all duration-200 h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FaNewspaper className="text-xl sm:text-2xl text-accent" />
                <h3 className="text-base sm:text-lg font-semibold text-textPrimary">Blog Management</h3>
              </div>
              <p className="text-textSecondary text-xs sm:text-sm">
                Create, edit, and publish blog posts. Manage images, SEO, and more.
              </p>
            </div>
          </Link>
          
          <Link href="/admin/analytics">
            <div className="bg-secondary/30 p-4 sm:p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm hover:bg-secondary/40 transition-all duration-200 h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FaChartBar className="text-xl sm:text-2xl text-accent" />
                <h3 className="text-base sm:text-lg font-semibold text-textPrimary">Analytics Dashboard</h3>
              </div>
              <p className="text-textSecondary text-xs sm:text-sm">
                Track website visits, user behavior, and performance metrics.
              </p>
            </div>
          </Link>
          
          <Link href="/admin/security" className="sm:col-span-2 lg:col-span-1">
            <div className="bg-secondary/30 p-4 sm:p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm hover:bg-secondary/40 transition-all duration-200 h-full">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <FaShieldAlt className="text-xl sm:text-2xl text-accent" />
                <h3 className="text-base sm:text-lg font-semibold text-textPrimary">Security Center</h3>
              </div>
              <p className="text-textSecondary text-xs sm:text-sm">
                Monitor threats, download IP blacklists, and manage security settings.
              </p>
            </div>
          </Link>
        </motion.div>
        
        {/* System Info */}
        <motion.div 
          className="bg-secondary/30 p-4 sm:p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-2 border-b border-accent/20">
            <FaServer className="text-xl sm:text-2xl text-accent" />
            <h2 className="text-lg sm:text-xl font-semibold text-textPrimary">System Status</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="mb-4">
                <div className="text-textSecondary text-xs sm:text-sm mb-1">Server Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-500"></div>
                  <span className="text-textPrimary text-sm sm:text-base">Online</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-textSecondary text-xs sm:text-sm mb-1">Last Deployment</div>
                <div className="text-textPrimary text-sm sm:text-base">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <div className="text-textSecondary text-xs sm:text-sm mb-1">Storage Usage</div>
                <div className="w-full bg-secondary/40 rounded-full h-1.5 sm:h-2 mb-1">
                  <div className="bg-accent h-1.5 sm:h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="text-right text-textSecondary text-xs">35% of 5GB</div>
              </div>
              
              <div>
                <div className="text-textSecondary text-xs sm:text-sm mb-1">Memory Usage</div>
                <div className="w-full bg-secondary/40 rounded-full h-1.5 sm:h-2 mb-1">
                  <div className="bg-accent h-1.5 sm:h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="text-right text-textSecondary text-xs">42% of 512MB</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
