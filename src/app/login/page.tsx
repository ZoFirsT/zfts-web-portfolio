'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const messages = [
      '> Initializing secure connection...',
      '> Connection established',
      '> Welcome to zFts Admin Terminal',
      '> System: Linux zfts 6.5.0-x86_64',
      '> Kernel version: 6.5.0-generic',
      '> Please authenticate to continue...',
      '> Enter credentials:'
    ];

    const typeMessage = async (index: number) => {
      if (index < messages.length) {
        setCommandHistory(prev => [...prev, messages[index]]);
        setTimeout(() => typeMessage(index + 1), 500);
      }
    };

    typeMessage(0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setCommandHistory(prev => [...prev, `> Attempting authentication for user: ${username}...`]);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setCommandHistory(prev => [
          ...prev,
          '> Authentication successful',
          '> Generating session token...',
          '> Access granted',
          '> Redirecting to admin interface...'
        ]);
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/admin/blog');
      } else {
        setError(data.error || 'Authentication failed');
        setCommandHistory(prev => [
          ...prev,
          '> Error: Authentication failed',
          '> Please check your credentials and try again'
        ]);
      }
    } catch (err) {
      setError('Connection error occurred');
      setCommandHistory(prev => [
        ...prev,
        '> Error: Connection failed',
        '> Please check your network connection and try again'
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-primary text-accent p-8 font-mono"
    >
      <div className="max-w-3xl mx-auto bg-secondary/30 p-4 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm">
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
          <span className="ml-2 text-textSecondary text-sm">zfts-admin -- Secure Shell</span>
        </motion.div>

        {/* Terminal Output */}
        <div className="h-[40vh] overflow-y-auto space-y-2 mb-4 p-2 bg-secondary/20 rounded">
          <AnimatePresence>
            {commandHistory.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`font-mono ${
                  line.includes('Error') ? 'text-red-400' : 
                  line.includes('successful') ? 'text-green-400' : 
                  'text-textSecondary'
                }`}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Login Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center group">
            <span className="text-accent mr-2 opacity-75 group-focus-within:opacity-100">
              root@zfts:~$
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-textPrimary font-mono caret-accent"
              placeholder="username"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center group">
            <span className="text-accent mr-2 opacity-75 group-focus-within:opacity-100">
              password:
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-textPrimary font-mono caret-accent"
              required
              disabled={isLoading}
            />
          </div>

          <motion.div 
            className="pt-4 border-t border-accent/20"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent/10 border border-accent/20 text-accent py-2 px-4 rounded 
                       hover:bg-accent/20 transition-all duration-200 font-mono 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {">"} Processing authentication request...
                </motion.span>
              ) : (
                <span>
                  {">"} authenticate --user {username || "username"} --password ********
                </span>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}
