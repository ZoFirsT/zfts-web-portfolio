'use client';

import { useEffect } from 'react';

/**
 * This component captures analytics headers set by the middleware
 * and logs them to the analytics API.
 * 
 * It should be included in the root layout component to ensure
 * analytics are captured on all pages.
 */
export default function AnalyticsLogger() {
  useEffect(() => {
    // Function to extract analytics headers and send them to the analytics API
    const logAnalytics = async () => {
      try {
        // Get all headers from the response
        const headers = document.querySelectorAll('meta[name^="x-analytics-"]');
        if (headers.length === 0) return;
        
        // Extract analytics data from meta tags
        const analyticsData: Record<string, string> = {};
        headers.forEach(header => {
          const name = header.getAttribute('name');
          const content = header.getAttribute('content');
          if (name && content) {
            analyticsData[name] = content;
          }
        });
        
        // Skip if we don't have enough data
        if (!analyticsData['x-analytics-path'] || !analyticsData['x-analytics-method']) {
          return;
        }
        
        // Prepare data for the API call
        const path = analyticsData['x-analytics-path'];
        const method = analyticsData['x-analytics-method'];
        
        // Call the analytics API endpoint using POST with data in the body
        await fetch('/api/analytics/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            path,
            method,
            timestamp: Date.now(),
            // Add other analytics data
            ...Object.fromEntries(
              Object.entries(analyticsData).map(([key, value]) => [
                key.replace('x-analytics-', ''),
                value
              ])
            )
          })
        });
      } catch (error) {
        // Silently fail to avoid impacting user experience
        console.error('Failed to log analytics:', error);
      }
    };
    
    // Log analytics after a short delay to ensure page has loaded
    const timer = setTimeout(logAnalytics, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // This component doesn't render anything
  return null;
}
