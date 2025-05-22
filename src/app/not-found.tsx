'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const router = useRouter();

  const commands = {
    help: 'Available commands:\n  home - Return to homepage\n  ls - List sections\n  clear - Clear terminal\n  about - About me\n  contact - Contact information',
    ls: 'Sections:\n  /home\n  /about\n  /experience\n  /skills\n  /projects\n  /blog\n  /contact',
    about: 'Thanatcha Saleekongchai\nFull Stack Developer & Cloud DevOps Engineer\nSpecializing in web development, cloud architecture, and DevOps practices.',
    contact: 'Email: thanatcha.s@zfts.site\nLocation: Bangkok, Thailand',
    home: 'REDIRECTING_TO_HOME',
    clear: 'CLEAR_TERMINAL',
  };

  useEffect(() => {
    const initialMessages = [
      '> 404 Error: Page Not Found',
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
    <div className="min-h-screen bg-primary text-accent p-8 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-secondary/30 p-4 rounded-lg border border-accent/20 shadow-lg"
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-accent/20">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-textSecondary text-sm">zfts-terminal -- 404 Not Found</span>
        </div>

        {/* Terminal Content */}
        <div className="h-[60vh] overflow-y-auto space-y-2 mb-4">
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
    </div>
  );
}
