'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaDownload, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

type BlacklistFormat = 'txt' | 'json' | 'csv' | 'apache' | 'nginx';

type BlacklistDownloaderProps = {
  variant?: 'full' | 'compact'; // full = all formats with descriptions, compact = simple dropdown
  className?: string;
  title?: string;
  showIcon?: boolean;
}

export default function BlacklistDownloader({ 
  variant = 'full',
  className = '',
  title = 'IP Blacklist',
  showIcon = true 
}: BlacklistDownloaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<BlacklistFormat>('txt');
  
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const downloadBlacklist = async (format: BlacklistFormat) => {
    try {
      setIsDownloading(true);
      setDownloadStatus('idle');
      const response = await fetch(`/api/analytics/security/blacklist?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate blacklist');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Set the file name based on format
      let fileName = '';
      switch (format) {
        case 'txt':
          fileName = 'ip-blacklist.txt';
          break;
        case 'json':
          fileName = 'ip-blacklist.json';
          break;
        case 'csv':
          fileName = 'ip-blacklist.csv';
          break;
        case 'apache':
          fileName = 'apache-deny.conf';
          break;
        case 'nginx':
          fileName = 'nginx-deny.conf';
          break;
      }
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } catch (err) {
      console.error('Error downloading blacklist:', err);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  // Format descriptions for the full variant
  const formatInfo = [
    {
      id: 'txt' as BlacklistFormat,
      name: 'Plain Text',
      description: 'Simple list of IPs with attack counts',
      icon: <FaDownload />
    },
    {
      id: 'json' as BlacklistFormat,
      name: 'JSON Format',
      description: 'Structured data with IP, count and timestamp',
      icon: <FaDownload />
    },
    {
      id: 'csv' as BlacklistFormat,
      name: 'CSV Format',
      description: 'Compatible with Excel and data analysis tools',
      icon: <FaDownload />
    },
    {
      id: 'apache' as BlacklistFormat,
      name: 'Apache Config',
      description: 'Ready to use with Apache web server',
      icon: <FaDownload />
    },
    {
      id: 'nginx' as BlacklistFormat,
      name: 'Nginx Config',
      description: 'Ready to use with Nginx web server',
      icon: <FaDownload />
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col ${className}`}>
        {title && (
          <div className="flex items-center gap-2 mb-3">
            {showIcon && <FaShieldAlt className="text-accent" />}
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as BlacklistFormat)}
            className="px-3 py-2 bg-secondary/40 text-textPrimary border border-accent/30 rounded focus:outline-none focus:border-accent"
          >
            <option value="txt">Plain Text (.txt)</option>
            <option value="json">JSON Format (.json)</option>
            <option value="csv">CSV Format (.csv)</option>
            <option value="apache">Apache Config (.conf)</option>
            <option value="nginx">Nginx Config (.conf)</option>
          </select>
          
          <button
            onClick={() => downloadBlacklist(selectedFormat)}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-3 py-2 bg-accent text-black border border-accent rounded hover:bg-accent/80 transition-colors ${isDownloading ? 'opacity-70' : ''}`}
          >
            {isDownloading ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                /> 
                Downloading...
              </>
            ) : (
              <>
                <FaDownload /> Download
              </>
            )}
          </button>
        </div>
           <div className="mt-2 text-xs text-textSecondary flex items-center gap-1">
        <FaExclamationTriangle className="text-yellow-400" />
        <span>Open source security data - use responsibly</span>
      </div>
      
      {downloadStatus === 'success' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-green-400 flex items-center gap-1"
        >
          ✓ Download successful! File saved to your downloads folder.
        </motion.div>
      )}
      
      {downloadStatus === 'error' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-red-400 flex items-center gap-1"
        >
          ✗ Download failed. Please try again or check your connection.
        </motion.div>
      )}
      
      <div className="mt-2 text-right">
        <Link 
          href="/opensrc/blacklist" 
          className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1 justify-end"
        >
          <FaInfoCircle className="text-xs" /> API documentation
        </Link>
      </div>
      </div>
    );
  }

  // Full variant with all the options displayed as cards
  return (
    <motion.div 
      className={`bg-secondary/30 p-5 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-accent/20">
        {showIcon && <FaShieldAlt className="text-xl text-accent" />}
        <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
      </div>
      
      <p className="text-textSecondary mb-4">
        Download our open-source blacklist of malicious IPs to enhance your security infrastructure:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {formatInfo.map((format) => (
          <motion.div
            key={format.id}
            className="bg-secondary/20 p-4 rounded-lg border border-accent/20 hover:bg-secondary/40 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => downloadBlacklist(format.id)}
          >
            <div className="flex items-center gap-2 mb-2 text-accent">
              {format.icon}
              <span className="font-medium">{format.name}</span>
            </div>
            <p className="text-sm text-textSecondary">{format.description}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="text-xs text-textSecondary bg-secondary/40 p-3 rounded border border-accent/10 flex items-start gap-2 mb-3">
        <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" />
        <p>
          This data is provided as an open-source security resource. Always review blacklists before implementing
          in production environments. Some legitimate users may share IPs with malicious actors.
        </p>
      </div>
      
      {downloadStatus === 'success' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-400 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Download successful! File saved to your downloads folder.
        </motion.div>
      )}
      
      {downloadStatus === 'error' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Download failed. Please try again or check your connection.
        </motion.div>
      )}
      
      <div className="flex justify-end">
        <Link 
          href="/opensrc/blacklist" 
          className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
        >
          <FaInfoCircle className="text-xs" /> View API documentation
        </Link>
      </div>
    </motion.div>
  );
}
