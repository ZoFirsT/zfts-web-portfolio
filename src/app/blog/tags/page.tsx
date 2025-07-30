'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaTag, FaArrowLeft } from 'react-icons/fa';
import BlogMetadata from '@/components/BlogMetadata';

type Tag = {
  id: string;
  name: string;
  count: number; // Number of posts with this tag
};

type BlogPost = {
  _id?: string;
  title: string;
  content: string;
  date: string;
  slug: string;
  published: boolean;
  tags: Tag[];
  excerpt?: string;
  readTime?: string;
  coverImage?: string;
};

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  
  useEffect(() => {
    const messages = [
      '> Initializing tag database...',
      '> Scanning blog archives...',
      '> Compiling tag statistics...'
    ];

    const typeMessage = async (index: number) => {
      if (index < messages.length) {
        setCommandHistory(prev => [...prev, messages[index]]);
        setTimeout(() => typeMessage(index + 1), 500);
      }
    };

    typeMessage(0);

    const fetchTags = async () => {
      try {
        // Fetch all published posts
        const response = await fetch('/api/posts');
        const posts: BlogPost[] = await response.json();
        
        // Extract and count tags
        const tagsMap = new Map();
        
        posts.forEach((post: BlogPost) => {
          if (post.published && post.tags) {
            post.tags.forEach((tag: Tag) => {
              if (tagsMap.has(tag.name)) {
                const existingTag = tagsMap.get(tag.name);
                tagsMap.set(tag.name, {
                  ...existingTag,
                  count: existingTag.count + 1
                });
              } else {
                tagsMap.set(tag.name, {
                  id: tag.id,
                  name: tag.name,
                  count: 1
                });
              }
            });
          }
        });
        
        // Convert map to array and sort by count (descending)
        const sortedTags = Array.from(tagsMap.values()).sort((a, b) => b.count - a.count);
        setTags(sortedTags);
        
        setCommandHistory(prev => [
          ...prev,
          `> Found ${sortedTags.length} unique tags`,
          '> Rendering tag cloud...'
        ]);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError('Failed to load tags');
        setCommandHistory(prev => [
          ...prev,
          '> ERROR: Failed to retrieve tag data',
          '> Try refreshing the page'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Function to determine tag size based on count
  const getTagSize = (count: number, max: number) => {
    // Get the maximum count
    const maxCount = max || 1;
    // Calculate size between 1-5
    const sizeScale = Math.max(1, Math.min(5, Math.ceil((count / maxCount) * 5)));
    
    const sizeClasses = [
      "text-xs",
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl"
    ];
    
    return sizeClasses[sizeScale - 1];
  };

  // Find the maximum count for scaling
  const maxCount = tags.length ? Math.max(...tags.map(tag => tag.count)) : 0;

  return (
    <>
      <BlogMetadata
        title="Blog Tags | ZFTS"
        description="Browse all tags and topics from the ZFTS blog. Find articles related to web development, cloud computing, DevOps, and more."
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/tags`}
        date={new Date().toISOString()}
        tags={['blog tags', 'topics', 'categories', 'web development', 'cloud computing']}
      />
      <div className="min-h-screen bg-primary text-white py-20 font-mono">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/30 p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm"
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
                <span className="text-textSecondary text-sm">zfts-blog-tags -- Tag Cloud</span>
                <span className="text-accent/50">|</span>
                <Link 
                  href="/blog"
                  className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm flex items-center gap-1"
                >
                  <FaArrowLeft size={12} />
                  <span>cd ../blog</span>
                </Link>
              </div>
            </motion.div>
            
            {/* Command History */}
            <motion.div 
              className="mb-8 p-4 bg-secondary/20 rounded-lg border border-accent/10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <AnimatePresence>
                {commandHistory.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`font-mono text-sm ${
                      line.includes('ERROR') ? 'text-red-400' : 
                      line.includes('Found') ? 'text-green-400' : 
                      'text-textSecondary'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-accent text-sm mt-2"
                >
                  {">"} Processing request...
                </motion.div>
              )}
            </motion.div>

            {/* Tag Cloud */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaTag className="text-accent" />
                <span>All Blog Tags</span>
              </h2>
              
              {error ? (
                <div className="text-center py-10">
                  <p className="text-red-400">{">"} {error}</p>
                  <p className="text-accent mt-2">{">"} Please try again later...</p>
                </div>
              ) : tags.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <p className="text-textSecondary">
                    {">"} No tags found in the blog posts.
                  </p>
                  <p className="text-accent mt-2">
                    {">"} Check back later once more articles are added...
                  </p>
                </motion.div>
              ) : (
                <div className="bg-secondary/20 p-6 rounded-lg">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {tags.map(tag => (
                      <motion.div
                        key={tag.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative group"
                      >
                        <Link href={`/blog?tag=${encodeURIComponent(tag.name)}`}>
                          <div className={`flex items-center gap-1 bg-accent/20 hover:bg-accent/30 transition-all duration-200 px-3 py-2 rounded-md ${getTagSize(tag.count, maxCount)}`}>
                            <span className="text-textPrimary group-hover:text-accent transition-colors">{tag.name}</span>
                            <span className="bg-accent/30 text-xs px-1.5 py-0.5 rounded-full">{tag.count}</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Back to Blog Button */}
              <div className="mt-8 text-center">
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary rounded-md hover:bg-accent/80 transition-colors"
                >
                  <FaArrowLeft size={12} />
                  <span>Back to Blog</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
