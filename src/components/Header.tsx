'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SocialIcon } from 'react-social-icons';

// Custom NavLink component for desktop navigation
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-textSecondary hover:text-accent transition-colors">
    <span className="uppercase text-sm font-medium hover:border-b border-accent pb-1">
      {children}
    </span>
  </Link>
);

// Custom NavLink component for mobile navigation
const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode, onClick: () => void }) => (
  <Link href={href} className="text-textSecondary hover:text-accent transition-colors block py-2" onClick={onClick}>
    <span className="uppercase text-sm font-medium">
      {children}
    </span>
  </Link>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 p-5 flex items-start justify-between max-w-7xl mx-auto z-20 xl:items-center backdrop-blur-sm bg-primary/70 dark:bg-slate-900/70">
      <motion.div
        initial={{
          x: -500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="flex flex-row items-center"
      >
        <SocialIcon
          url="https://github.com/ZoFirsT"
          fgColor="#8892B0"
          bgColor="transparent"
          className="hover:scale-125 transition-all"
        />
        <SocialIcon
          url="https://www.linkedin.com/in/thanatcha-saleekongchai-187385367/"
          fgColor="#8892B0"
          bgColor="transparent"
          className="hover:scale-125 transition-all"
        />
      </motion.div>
      
      {/* Navigation Links - Desktop */}
      <motion.nav 
        className="hidden md:flex items-center space-x-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <NavLink href="#hero">Home</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#experience">Experience</NavLink>
        <NavLink href="#skills">Skills</NavLink>
        <NavLink href="#projects">Projects</NavLink>
        <NavLink href="#blog">Blog</NavLink>
        <NavLink href="#security-tools">Security</NavLink>
      </motion.nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center z-30">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-textSecondary p-2 focus:outline-none"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 right-5 bg-secondary/90 backdrop-blur-md p-5 rounded-lg shadow-lg md:hidden w-64 z-20"
          >
            <div className="flex flex-col space-y-4">
              <h3 className="text-accent font-medium text-sm uppercase pb-2 mb-2 border-b border-accent/20">Navigation</h3>
              <MobileNavLink href="#hero" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="#about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
              <MobileNavLink href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</MobileNavLink>
              <MobileNavLink href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</MobileNavLink>
              <MobileNavLink href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</MobileNavLink>
              <MobileNavLink href="#timeline" onClick={() => setIsMenuOpen(false)}>Timeline</MobileNavLink>
              <MobileNavLink href="#blog" onClick={() => setIsMenuOpen(false)}>Blog</MobileNavLink>
              <MobileNavLink href="#security-tools" onClick={() => setIsMenuOpen(false)}>Security</MobileNavLink>
              <MobileNavLink href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
              
              <h3 className="text-accent font-medium text-sm uppercase pb-2 mb-2 border-b border-accent/20 mt-4">Pages</h3>
              <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>Blog Archive</MobileNavLink>
              <MobileNavLink href="/opensrc/blacklist" onClick={() => setIsMenuOpen(false)}>API Documentation</MobileNavLink>
              <div className="pt-4 mt-2 border-t border-accent/20 flex items-center justify-between">
                <a href="https://github.com/ZoFirsT" target="_blank" rel="noopener noreferrer" 
                   className="text-textSecondary hover:text-accent transition-colors p-1">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/thanatcha-saleekongchai-187385367/" target="_blank" rel="noopener noreferrer" 
                   className="text-textSecondary hover:text-accent transition-colors p-1">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          x: 500,
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          x: 0,
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
        }}
        className="flex flex-row items-center text-textSecondary cursor-pointer"
      >
        <SocialIcon
          className="cursor-pointer hover:scale-125 transition-all"
          network="email"
          fgColor="#8892B0"
          bgColor="transparent"
          url="#contact"
        />
        <Link href="#contact">
          <p className="uppercase hidden md:inline-flex text-sm text-textSecondary">
            Get In Touch
          </p>
        </Link>
      </motion.div>
    </header>
  );
}