'use client';

import { useEffect } from 'react';

type BlogViewTrackerProps = {
  slug: string;
  title: string;
  readTime?: string;
};

/**
 * Component that tracks blog post views
 * Should be included in each blog post page
 */
export default function BlogViewTracker({ slug, title, readTime }: BlogViewTrackerProps) {
  useEffect(() => {
    // Function to log the blog view
    const logBlogView = async () => {
      try {
        // Send the view data to the API
        await fetch('/api/analytics/blog-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug,
            title,
            readTime,
          }),
        });
      } catch (error) {
        // Silently fail to avoid impacting user experience
        console.error('Failed to log blog view:', error);
      }
    };

    // Log the view after a short delay to ensure the page has loaded
    // and to avoid counting views from bots that immediately leave
    const timer = setTimeout(logBlogView, 5000);

    return () => clearTimeout(timer);
  }, [slug, title, readTime]);

  // This component doesn't render anything
  return null;
} 