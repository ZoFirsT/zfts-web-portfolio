'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="bg-secondary/30 text-textSecondary py-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Info */}
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold text-textPrimary mb-2">zFts.Site</h3>
            <p className="max-w-md">
              Full Stack Developer focused on creating clean, user-friendly experiences.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-16 mb-8 md:mb-0">
            <div>
              <h4 className="text-lg font-semibold text-textPrimary mb-4">Main Pages</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#hero" className="hover:text-accent transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-accent transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#experience" className="hover:text-accent transition-colors duration-300">
                    Experience
                  </Link>
                </li>
                <li>
                  <Link href="#skills" className="hover:text-accent transition-colors duration-300">
                    Skills
                  </Link>
                </li>
                <li>
                  <Link href="#projects" className="hover:text-accent transition-colors duration-300">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-accent transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-textPrimary mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#blog" className="hover:text-accent transition-colors duration-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#security-tools" className="hover:text-accent transition-colors duration-300">
                    Security Tools
                  </Link>
                </li>
                <li>
                  <Link href="/opensrc/blacklist" className="hover:text-accent transition-colors duration-300">
                    IP Blacklist API
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-accent transition-colors duration-300">
                    Blog Archive
                  </Link>
                </li>
                <li>
                  <Link href="#timeline" className="hover:text-accent transition-colors duration-300">
                    Timeline
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-textPrimary mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:thanatcha.s@zfts.site" 
                    className="hover:text-accent transition-colors duration-300 flex items-center gap-2"
                  >
                    <FaEnvelope />
                    <span>Email</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/ZoFirsT" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-accent transition-colors duration-300 flex items-center gap-2"
                  >
                    <FaGithub />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/thanatcha-saleekongchai-187385367/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-accent transition-colors duration-300 flex items-center gap-2"
                  >
                    <FaLinkedin />
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-accent/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p>© {currentYear} zFts.Site. All rights reserved.</p>
            <div className="flex gap-4 items-center">
              <Link href="/login" className="text-xs hover:text-accent transition-colors duration-300 opacity-50 hover:opacity-100">
                Admin Login
              </Link>
              <span className="hidden md:inline text-accent/50">|</span>
              <Link href="/opensrc/blacklist" className="text-xs hover:text-accent transition-colors duration-300">
                API Docs
              </Link>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="https://github.com/ZoFirsT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accent transition-colors duration-300"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/thanatcha-saleekongchai-187385367/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accent transition-colors duration-300"
            >
              <FaLinkedin size={20} />
            </a>
            <a 
              href="mailto:thanatcha.s@zfts.site"
              className="text-textSecondary hover:text-accent transition-colors duration-300"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;