'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaEye, FaInfoCircle, FaExclamationTriangle, FaClock, FaUserSecret, FaDesktop, FaMobile, FaTablet, FaChrome, FaFirefox, FaSafari, FaEdge } from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

type AnalyticsData = {
  totalVisits: number;
  uniqueVisitors: number;
  topPages: { path: string; count: number }[];
  visitsByBrowser: { browser: string; count: number }[];
  visitsByDevice: { device: string; count: number }[];
  visitsByOS: { os: string; count: number }[];
  visitsByReferer: { referer: string; count: number }[];
  visitsByHour: { date: string; count: number }[];
  ddosAttempts: any[];
  timeRange: string;
}

type RealTimeData = {
  activeVisitors: number;
  currentPages: { path: string; count: number }[];
  timestamp: string;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ddos'>('overview');
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

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/analytics/real-time');
      
      if (!response.ok) {
        throw new Error('Failed to fetch real-time data');
      }
      
      const data = await response.json();
      setRealTimeData(data);
    } catch (err) {
      console.error('Error fetching real-time data:', err);
      // Don't set error for real-time data failures
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    
    // Refresh real-time data every 15 seconds
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 15000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  // Get browser icon
  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return <FaChrome className="text-accent" />;
      case 'firefox': return <FaFirefox className="text-accent" />;
      case 'safari': return <FaSafari className="text-accent" />;
      case 'edge': return <FaEdge className="text-accent" />;
      default: return <FaInfoCircle className="text-accent" />;
    }
  };

  // Get device icon
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return <FaDesktop className="text-accent" />;
      case 'mobile': return <FaMobile className="text-accent" />;
      case 'tablet': return <FaTablet className="text-accent" />;
      default: return <FaInfoCircle className="text-accent" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 font-mono bg-primary text-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm"
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
              <span className="text-textSecondary text-sm">zfts-monitor -- Analytics Dashboard</span>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ..
              </Link>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin/security"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../security
              </Link>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin/blog"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../blog
              </Link>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin/blog"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../blog
              </Link>
              <span className="text-accent/50">|</span>
              <Link 
                href="/admin/security"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../security
              </Link>
            </div>
          </motion.div>

          {/* Time Range Selector */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setTimeRange('1h')}
              className={`px-4 py-2 rounded-lg border ${timeRange === '1h' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
            >
              Last Hour
            </button>
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-4 py-2 rounded-lg border ${timeRange === '24h' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
            >
              Last 24 Hours
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 rounded-lg border ${timeRange === '7d' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 rounded-lg border ${timeRange === '30d' ? 'bg-accent text-black border-accent' : 'bg-secondary/30 border-accent/30 text-textSecondary'}`}
            >
              Last 30 Days
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-accent/20">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 ${activeTab === 'overview' ? 'text-accent border-b-2 border-accent' : 'text-textSecondary'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('ddos')}
                className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'ddos' ? 'text-accent border-b-2 border-accent' : 'text-textSecondary'}`}
              >
                <FaExclamationTriangle /> Security Threats
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-accent text-lg"
              >
                {">"} Loading analytics data...
              </motion.span>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <span className="text-red-400 text-lg">{">"} {error}</span>
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-accent/20 text-accent border border-accent/20 rounded hover:bg-accent/30 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {/* Analytics Content - Overview */}
          {!isLoading && !error && analyticsData && activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Real-time Stats */}
              {realTimeData && (
                <div className="mb-8 p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <div className="flex items-center gap-2 mb-3 text-accent">
                    <FaClock />
                    <h3 className="text-lg font-semibold">Real-time Activity</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg">
                      <div className="text-3xl text-accent">
                        <FaUsers />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-textPrimary">{realTimeData.activeVisitors}</div>
                        <div className="text-xs text-textSecondary">Active Visitors</div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm text-textSecondary mb-2">Currently Viewing:</div>
                      <div className="space-y-2">
                        {realTimeData.currentPages.map((page, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <span className="text-accent">{page.path}</span>
                            <span className="bg-secondary/40 px-2 py-1 rounded">{page.count}</span>
                          </div>
                        ))}
                        {realTimeData.currentPages.length === 0 && (
                          <div className="text-textSecondary text-sm">No active pages</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-secondary/30 p-4 rounded-lg border border-accent/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-textSecondary">Total Visits</h3>
                    <FaEye className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-textPrimary">{analyticsData.totalVisits.toLocaleString()}</div>
                </div>
                
                <div className="bg-secondary/30 p-4 rounded-lg border border-accent/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-textSecondary">Unique Visitors</h3>
                    <FaUsers className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-textPrimary">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                </div>
                
                <div className="bg-secondary/30 p-4 rounded-lg border border-accent/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-textSecondary">Avg. per Visitor</h3>
                    <FaInfoCircle className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-textPrimary">
                    {analyticsData.uniqueVisitors > 0 
                      ? (analyticsData.totalVisits / analyticsData.uniqueVisitors).toFixed(1) 
                      : '0'}
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-4 rounded-lg border border-accent/20">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-textSecondary">Security Threats</h3>
                    <FaUserSecret className="text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-textPrimary">{analyticsData.ddosAttempts.length}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Pages */}
                <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Top Pages</h3>
                  <div className="space-y-3">
                    {analyticsData.topPages.map((page, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="text-accent truncate max-w-[70%]">{page.path || '/'}</div>
                        <div className="text-textSecondary bg-secondary/40 px-2 py-1 rounded">{page.count}</div>
                      </div>
                    ))}
                    {analyticsData.topPages.length === 0 && (
                      <div className="text-textSecondary">No page visits recorded</div>
                    )}
                  </div>
                </div>

                {/* Referrers */}
                <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Top Referrers</h3>
                  <div className="space-y-3">
                    {analyticsData.visitsByReferer.map((ref, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="text-accent truncate max-w-[70%]">{ref.referer || 'Direct'}</div>
                        <div className="text-textSecondary bg-secondary/40 px-2 py-1 rounded">{ref.count}</div>
                      </div>
                    ))}
                    {analyticsData.visitsByReferer.length === 0 && (
                      <div className="text-textSecondary">No referrers recorded</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Device & Browser Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Devices */}
                <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Devices</h3>
                  <div className="space-y-4">
                    {analyticsData.visitsByDevice.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="text-2xl">{getDeviceIcon(item.device)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-textPrimary">{item.device || 'Unknown'}</span>
                            <span className="text-accent">{item.count}</span>
                          </div>
                          <div className="h-1 bg-secondary/40 rounded-full mt-1">
                            <div 
                              className="h-1 bg-accent rounded-full" 
                              style={{ 
                                width: `${(item.count / analyticsData.totalVisits) * 100}%` 
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browsers */}
                <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Browsers</h3>
                  <div className="space-y-4">
                    {analyticsData.visitsByBrowser.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="text-2xl">{getBrowserIcon(item.browser)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-textPrimary">{item.browser || 'Unknown'}</span>
                            <span className="text-accent">{item.count}</span>
                          </div>
                          <div className="h-1 bg-secondary/40 rounded-full mt-1">
                            <div 
                              className="h-1 bg-accent rounded-full" 
                              style={{ 
                                width: `${(item.count / analyticsData.totalVisits) * 100}%` 
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OS */}
                <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Operating Systems</h3>
                  <div className="space-y-4">
                    {analyticsData.visitsByOS.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="text-2xl">
                          <FaInfoCircle className="text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-textPrimary">{item.os || 'Unknown'}</span>
                            <span className="text-accent">{item.count}</span>
                          </div>
                          <div className="h-1 bg-secondary/40 rounded-full mt-1">
                            <div 
                              className="h-1 bg-accent rounded-full" 
                              style={{ 
                                width: `${(item.count / analyticsData.totalVisits) * 100}%` 
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Content - DDoS */}
          {!isLoading && !error && analyticsData && activeTab === 'ddos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20 mb-8">
                <h2 className="text-xl text-textPrimary mb-4 pb-2 border-b border-accent/20 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-400" />
                  Security Threat Logs
                </h2>
                
                {analyticsData.ddosAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-textSecondary">No security threats detected in the selected time period.</p>
                    <p className="text-accent/80 mt-2">That's good news!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-accent/20">
                        <tr>
                          <th className="text-left p-2 text-textSecondary">Timestamp</th>
                          <th className="text-left p-2 text-textSecondary">IP Address</th>
                          <th className="text-left p-2 text-textSecondary">Requests</th>
                          <th className="text-left p-2 text-textSecondary">Time Window</th>
                          <th className="text-left p-2 text-textSecondary">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.ddosAttempts.map((attempt, i) => (
                          <tr key={i} className="border-b border-secondary/20">
                            <td className="p-2 text-textSecondary">
                              {new Date(attempt.timestamp).toLocaleString()}
                            </td>
                            <td className="p-2 text-accent">{attempt.ip}</td>
                            <td className="p-2 text-textPrimary">{attempt.requestCount}</td>
                            <td className="p-2 text-textSecondary">{attempt.timeWindow}s</td>
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

              <div className="bg-secondary/20 p-4 rounded-lg border border-accent/20">
                <h3 className="text-lg text-textPrimary mb-4 pb-2 border-b border-accent/20">Security Recommendations</h3>
                <div className="space-y-4 text-textSecondary mb-6">
                  <p>
                    <span className="text-accent">{">"}</span> Consider implementing rate limiting if you're seeing frequent security threats.
                  </p>
                  <p>
                    <span className="text-accent">{">"}</span> Use a CDN like Cloudflare for additional DDoS protection on production sites.
                  </p>
                  <p>
                    <span className="text-accent">{">"}</span> Review your server logs regularly for suspicious activity.
                  </p>
                  <p>
                    <span className="text-accent">{">"}</span> Keep your software and dependencies up to date.
                  </p>
                </div>
                
                <div className="text-center">
                  <Link 
                    href="/admin/security" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors duration-200"
                  >
                    <FaExclamationTriangle /> Go to Security Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
