'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaDownload, FaCloudDownloadAlt } from 'react-icons/fa';
import Link from 'next/link';

type SecurityStats = {
  totalAttempts: number;
  blockedIPs: number;
  recentAttempts: {
    ip: string;
    timestamp: string;
    requestCount: number;
    paths: string[];
    blocked: boolean;
  }[];
  topAttackerIPs: {
    ip: string;
    attemptCount: number;
  }[];
}

export default function SecurityDashboard() {
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const fetchSecurityStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics/security?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch security data');
      }
      
      const data = await response.json();
      setSecurityStats(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching security stats:', err);
      setError(err.message || 'Failed to fetch security data');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBlacklist = async (format: 'txt' | 'json' | 'csv' | 'apache' | 'nginx') => {
    try {
      setIsDownloading(true);
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
    } catch (err) {
      console.error('Error downloading blacklist:', err);
      alert('Failed to download blacklist');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStats();
  }, [timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm w-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-2 border-b border-accent/20">
        <FaShieldAlt className="text-2xl text-accent" />
        <h2 className="text-xl font-semibold text-textPrimary">Security Dashboard</h2>
        <Link 
          href="/admin/analytics" 
          className="ml-auto text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
        >
          View Full Analytics
        </Link>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setTimeRange('24h')}
          className={`px-3 py-1 rounded-lg border ${timeRange === '24h' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
        >
          Last 24h
        </button>
        <button
          onClick={() => setTimeRange('7d')}
          className={`px-3 py-1 rounded-lg border ${timeRange === '7d' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
        >
          Last Week
        </button>
        <button
          onClick={() => setTimeRange('30d')}
          className={`px-3 py-1 rounded-lg border ${timeRange === '30d' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
        >
          Last Month
        </button>
        
        <Link
          href="/security/docs"
          className="ml-auto flex items-center gap-2 px-3 py-1 rounded-lg border border-accent/30 bg-secondary/30 text-accent hover:bg-secondary/50 transition-colors"
        >
          <FaShieldAlt size={14} /> Security Docs
        </Link>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-accent"
          >
            {">"} Loading security data...
          </motion.span>
        </div>
      )}
      
      {/* Error State */}
      {!isLoading && error && (
        <div className="flex items-center justify-center h-32">
          <span className="text-red-400">{">"} {error}</span>
        </div>
      )}
      
      {/* Main Content */}
      {!isLoading && !error && securityStats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
              <div className="flex justify-between items-center">
                <h3 className="text-textSecondary">Attack Attempts</h3>
                <FaExclamationTriangle className="text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-textPrimary mt-2">{securityStats.totalAttempts}</div>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
              <div className="flex justify-between items-center">
                <h3 className="text-textSecondary">Blocked IPs</h3>
                <FaShieldAlt className="text-accent" />
              </div>
              <div className="text-3xl font-bold text-textPrimary mt-2">{securityStats.blockedIPs}</div>
            </div>
          </div>

          {/* Recent Attacks Table */}
          <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20 mb-6">
            <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Recent Attack Attempts</h3>
            
            {securityStats.recentAttempts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-textSecondary">No attack attempts detected.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-textSecondary border-b border-accent/20">
                    <tr>
                      <th className="text-left p-2">IP Address</th>
                      <th className="text-left p-2">Timestamp</th>
                      <th className="text-left p-2">Requests</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityStats.recentAttempts.map((attempt, i) => (
                      <tr key={i} className="border-b border-secondary/30">
                        <td className="p-2 text-accent">{attempt.ip}</td>
                        <td className="p-2 text-textSecondary">
                          {new Date(attempt.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2">{attempt.requestCount}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${attempt.blocked ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {attempt.blocked ? 'Blocked' : 'Warning'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Top Attacker IPs */}
          <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20 mb-6">
            <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Top Attacker IPs</h3>
            
            {securityStats.topAttackerIPs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-textSecondary">No repeat attackers detected.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {securityStats.topAttackerIPs.map((attacker, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="text-accent">{attacker.ip}</div>
                    <div className="bg-secondary/40 px-2 py-1 rounded text-textSecondary">{attacker.attemptCount} attempts</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Blacklist Download Section */}
          <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-accent/20">
              <FaCloudDownloadAlt className="text-accent" />
              <h3 className="text-lg text-textPrimary">Download IP Blacklist</h3>
            </div>
            
            <p className="text-textSecondary mb-4">
              Download the blacklist of malicious IPs in various formats to protect your systems.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => downloadBlacklist('txt')}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaDownload /> Plain Text
              </button>
              
              <button
                onClick={() => downloadBlacklist('json')}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaDownload /> JSON
              </button>
              
              <button
                onClick={() => downloadBlacklist('csv')}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaDownload /> CSV
              </button>
              
              <button
                onClick={() => downloadBlacklist('apache')}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaDownload /> Apache
              </button>
              
              <button
                onClick={() => downloadBlacklist('nginx')}
                disabled={isDownloading}
                className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-accent border border-accent/30 rounded hover:bg-secondary/60 transition-colors"
              >
                <FaDownload /> Nginx
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
