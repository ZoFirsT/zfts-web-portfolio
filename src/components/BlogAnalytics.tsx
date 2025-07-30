'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEye, FaUsers, FaChartLine, FaNewspaper, FaCalendarAlt, 
  FaArrowUp, FaArrowDown, FaEquals, FaSearch, FaStar, FaTrophy, FaMedal
} from 'react-icons/fa';
import Link from 'next/link';

type BlogAnalyticsProps = {
  timeRange: string;
  onTimeRangeChange: (timeRange: string) => void;
};

type BlogViewData = {
  totalBlogViews: number;
  uniqueVisitors: number;
  topPosts: {
    slug: string;
    title: string;
    count: number;
  }[];
  viewsByDay: {
    date: string;
    count: number;
  }[];
  timeRange: string;
  timestamp: string;
};

export default function BlogAnalytics({ timeRange, onTimeRangeChange }: BlogAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<BlogViewData | null>(null);
  const [previousData, setPreviousData] = useState<BlogViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // Calculate comparison with previous period
  const calculateChange = (current: number, previous: number): { value: number, trend: 'up' | 'down' | 'same' } => {
    if (previous === 0) return { value: 0, trend: 'same' };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change)),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'same'
    };
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // Fetch current period data
        const response = await fetch(`/api/analytics/blog?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog analytics');
        }
        const data = await response.json();
        setAnalyticsData(data);
        
        // Store previous data before updating
        if (analyticsData) {
          setPreviousData(analyticsData);
        }
      } catch (error) {
        console.error('Error fetching blog analytics:', error);
        setError('Failed to load blog analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Filter top posts based on search term
  const filteredPosts = analyticsData?.topPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <FaArrowUp className="text-green-400" />;
      case 'down': return <FaArrowDown className="text-red-400" />;
      default: return <FaEquals className="text-gray-400" />;
    }
  };

  // Get medal icon for top posts
  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0: return <FaTrophy className="text-yellow-400" />;
      case 1: return <FaMedal className="text-gray-300" />;
      case 2: return <FaMedal className="text-amber-600" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-secondary/30 p-6 rounded-lg border border-accent/20 flex justify-center items-center h-80">
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-accent flex flex-col items-center"
        >
          <FaChartLine className="text-3xl mb-3 animate-pulse" />
          <div className="text-lg">Loading blog analytics...</div>
        </motion.div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="bg-secondary/30 p-6 rounded-lg border border-accent/20 flex justify-center items-center h-80">
        <div className="text-red-400 text-center">
          <div className="text-xl mb-2">⚠️ {error || 'No data available'}</div>
          <button 
            onClick={() => onTimeRangeChange(timeRange)} 
            className="px-4 py-2 bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate changes from previous period if available
  const viewsChange = previousData ? calculateChange(analyticsData.totalBlogViews, previousData.totalBlogViews) : { value: 0, trend: 'same' as const };
  const visitorsChange = previousData ? calculateChange(analyticsData.uniqueVisitors, previousData.uniqueVisitors) : { value: 0, trend: 'same' as const };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with time range selector */}
      <div className="bg-secondary/30 p-4 rounded-lg border border-accent/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2">
            <FaNewspaper className="text-accent" />
            Blog Analytics Dashboard
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTimeRangeChange('1h')}
              className={`px-3 py-1 rounded-lg text-sm ${timeRange === '1h' ? 'bg-accent text-black' : 'bg-secondary/40 text-textSecondary'}`}
            >
              1 Hour
            </button>
            <button
              onClick={() => onTimeRangeChange('24h')}
              className={`px-3 py-1 rounded-lg text-sm ${timeRange === '24h' ? 'bg-accent text-black' : 'bg-secondary/40 text-textSecondary'}`}
            >
              24 Hours
            </button>
            <button
              onClick={() => onTimeRangeChange('7d')}
              className={`px-3 py-1 rounded-lg text-sm ${timeRange === '7d' ? 'bg-accent text-black' : 'bg-secondary/40 text-textSecondary'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => onTimeRangeChange('30d')}
              className={`px-3 py-1 rounded-lg text-sm ${timeRange === '30d' ? 'bg-accent text-black' : 'bg-secondary/40 text-textSecondary'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => onTimeRangeChange('all')}
              className={`px-3 py-1 rounded-lg text-sm ${timeRange === 'all' ? 'bg-accent text-black' : 'bg-secondary/40 text-textSecondary'}`}
            >
              All Time
            </button>
          </div>
        </div>
        
        <div className="text-xs text-textSecondary flex items-center gap-2">
          <FaCalendarAlt />
          <span>
            Data from: {new Date(analyticsData.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="bg-secondary/30 p-4 rounded-lg border border-accent/20 hover:border-accent/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-textSecondary text-sm mb-1">Total Views</h3>
              <div className="text-3xl font-bold text-textPrimary">
                {analyticsData.totalBlogViews.toLocaleString()}
              </div>
            </div>
            <div className="bg-secondary/40 p-2 rounded-full">
              <FaEye className="text-accent text-xl" />
            </div>
          </div>
          
          {previousData && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center">
                {getTrendIcon(viewsChange.trend)}
              </div>
              <span className={`
                ${viewsChange.trend === 'up' ? 'text-green-400' : ''}
                ${viewsChange.trend === 'down' ? 'text-red-400' : ''}
                ${viewsChange.trend === 'same' ? 'text-gray-400' : ''}
              `}>
                {viewsChange.value}% {viewsChange.trend === 'up' ? 'increase' : viewsChange.trend === 'down' ? 'decrease' : 'no change'}
              </span>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="bg-secondary/30 p-4 rounded-lg border border-accent/20 hover:border-accent/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-textSecondary text-sm mb-1">Unique Readers</h3>
              <div className="text-3xl font-bold text-textPrimary">
                {analyticsData.uniqueVisitors.toLocaleString()}
              </div>
            </div>
            <div className="bg-secondary/40 p-2 rounded-full">
              <FaUsers className="text-accent text-xl" />
            </div>
          </div>
          
          {previousData && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center">
                {getTrendIcon(visitorsChange.trend)}
              </div>
              <span className={`
                ${visitorsChange.trend === 'up' ? 'text-green-400' : ''}
                ${visitorsChange.trend === 'down' ? 'text-red-400' : ''}
                ${visitorsChange.trend === 'same' ? 'text-gray-400' : ''}
              `}>
                {visitorsChange.value}% {visitorsChange.trend === 'up' ? 'increase' : visitorsChange.trend === 'down' ? 'decrease' : 'no change'}
              </span>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="bg-secondary/30 p-4 rounded-lg border border-accent/20 hover:border-accent/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-textSecondary text-sm mb-1">Avg. Views per Reader</h3>
              <div className="text-3xl font-bold text-textPrimary">
                {analyticsData.uniqueVisitors > 0 
                  ? (analyticsData.totalBlogViews / analyticsData.uniqueVisitors).toFixed(1) 
                  : '0'}
              </div>
            </div>
            <div className="bg-secondary/40 p-2 rounded-full">
              <FaChartLine className="text-accent text-xl" />
            </div>
          </div>
          
          <div className="mt-4 h-1 bg-secondary/40 rounded-full">
            <div 
              className="h-1 bg-accent rounded-full" 
              style={{ 
                width: `${Math.min(
                  (analyticsData.uniqueVisitors > 0 
                    ? (analyticsData.totalBlogViews / analyticsData.uniqueVisitors) / 10 
                    : 0) * 100, 100)}%` 
              }} 
            />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <motion.div 
          className="bg-secondary/30 p-4 rounded-lg border border-accent/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-textPrimary font-medium flex items-center gap-2">
              <FaStar className="text-accent" />
              Top Performing Posts
            </h3>
            
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="bg-secondary/40 border border-accent/20 rounded-lg py-1 px-3 pl-8 text-sm text-textPrimary w-full focus:outline-none focus:border-accent/50"
              />
              <FaSearch className="absolute left-2.5 top-2 text-accent/50 text-xs" />
            </div>
          </div>

          <div className="bg-secondary/40 p-3 rounded-lg max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-secondary/20">
            {filteredPosts.length > 0 ? (
              <div className="space-y-3">
                {filteredPosts.map((post, index) => (
                  <motion.div 
                    key={post.slug}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-2 rounded-lg ${selectedPost === post.slug ? 'bg-accent/10 border border-accent/20' : 'border border-transparent hover:border-accent/10 hover:bg-secondary/60'}`}
                    onClick={() => setSelectedPost(selectedPost === post.slug ? null : post.slug)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center">
                        {getMedalIcon(index) || <span className="text-textSecondary">{index + 1}</span>}
                      </div>
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="text-textPrimary hover:text-accent transition-colors truncate max-w-[180px] md:max-w-[250px]"
                        target="_blank"
                      >
                        {post.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary/60 px-2 py-0.5 rounded text-xs text-accent">
                        {post.count} <FaEye className="inline ml-1" size={10} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-textSecondary text-sm text-center py-8">
                {searchTerm ? 'No posts match your search' : 'No blog post views recorded yet'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Views by Day Chart */}
        <motion.div 
          className="bg-secondary/30 p-4 rounded-lg border border-accent/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-textPrimary font-medium flex items-center gap-2 mb-4">
            <FaChartLine className="text-accent" />
            Views Trend
          </h3>
          
          <div className="bg-secondary/40 p-4 rounded-lg h-80 relative">
            {analyticsData.viewsByDay.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-end">
                  {analyticsData.viewsByDay.map((day, index) => {
                    const maxCount = Math.max(...analyticsData.viewsByDay.map(d => d.count));
                    const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                    
                    return (
                      <motion.div 
                        key={day.date} 
                        className="flex-1 flex flex-col items-center justify-end group"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + (index * 0.03) }}
                      >
                        <div className="relative w-full px-1">
                          <motion.div 
                            className="w-full bg-accent/70 hover:bg-accent transition-colors rounded-t"
                            style={{ height: `${height}%` }}
                            whileHover={{ scale: 1.05 }}
                          />
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-secondary/90 border border-accent/30 rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            <div className="font-medium text-accent">{formatDate(day.date)}</div>
                            <div className="text-textPrimary">{day.count} views</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="h-6 mt-2 border-t border-accent/10 pt-1 flex">
                  {analyticsData.viewsByDay.map((day, index) => (
                    <div 
                      key={`label-${day.date}`} 
                      className="flex-1 text-center"
                    >
                      {index % Math.ceil(analyticsData.viewsByDay.length / 7) === 0 && (
                        <div className="text-[8px] text-textSecondary">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-textSecondary text-sm">
                No daily view data available
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 