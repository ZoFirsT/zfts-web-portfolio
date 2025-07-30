'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaLock, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function ForbiddenPage() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const router = useRouter();

  const commands = {
    help: 'Available commands:\n  home - Return to homepage\n  ls - List accessible sections\n  clear - Clear terminal\n  info - Get information about this error\n  contact - Contact information',
    ls: 'Accessible Sections:\n  /home\n  /about\n  /experience\n  /skills\n  /projects\n  /blog\n  /contact',
    info: 'Error 403: Forbidden\nYou do not have permission to access this resource.\nTest routes are only accessible from localhost environments.',
    contact: 'If you believe this is an error, please contact:\nEmail: thanatcha.s@zfts.site',
    home: 'REDIRECTING_TO_HOME',
    clear: 'CLEAR_TERMINAL',
  };

  useEffect(() => {
    const initialMessages = [
      '> 403 Error: Forbidden',
      '> Access to this resource is denied.',
      '> Type "help" for available commands',
    ];
    setCommandHistory(initialMessages);
    
    // Auto-focus on mount
    const input = document.getElementById('terminal-input') as HTMLInputElement;
    if (input) input.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === '') return;
    
    // Add command to history
    setCommandHistory(prev => [...prev, `> ${cmd}`]);
    
    // Process command
    if (trimmedCmd === 'clear') {
      setCommandHistory([]);
      return;
    }
    
    if (trimmedCmd === 'home') {
      router.push('/');
      return;
    }
    
    const response = commands[trimmedCmd as keyof typeof commands];
    if (response) {
      setCommandHistory(prev => [...prev, response]);
    } else {
      setCommandHistory(prev => [...prev, `Command not found: ${cmd}`]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  return (
    <div className="min-h-screen bg-primary text-accent p-4 md:p-8 font-mono">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3"
        >
          <FaExclamationTriangle className="text-2xl text-red-500" />
          <div>
            <h1 className="text-xl font-bold text-red-400">403 Forbidden</h1>
            <p className="text-red-300/80 text-sm">Access to this resource is restricted</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-secondary/30 p-4 rounded-lg border border-accent/20 shadow-lg"
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-accent/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-textSecondary text-sm">zfts-terminal -- 403 Forbidden</span>
          </div>

          {/* Terminal Content */}
          <div className="h-[50vh] overflow-y-auto space-y-2 mb-4">
            {commandHistory.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line.startsWith('>') ? (
                  <span className="text-accent">{line}</span>
                ) : (
                  <span className="text-textSecondary">{line}</span>
                )}
              </div>
            ))}
          </div>

          {/* Terminal Input */}
          <div className="flex items-center">
            <span className="text-accent mr-2">{">"}</span>
            <input
              id="terminal-input"
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none flex-1 text-textPrimary"
              autoFocus
              spellCheck="false"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded hover:bg-accent/80 transition-colors"
          >
            <FaShieldAlt /> Return to Safety
          </button>
        </motion.div>
      </div>
    </div>
  );
} 