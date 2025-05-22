'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaCalendar, FaClock, FaTags } from 'react-icons/fa';

type BlogPost = {
  _id?: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  coverImage: string;
  published: boolean;
  tags?: string[];
  lastModified?: string;
};

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      '> Initializing article viewer...',
      '> Connecting to content database...',
      `> Fetching article: ${params.slug}...`
    ];

    const typeMessage = async (index: number) => {
      if (index < messages.length) {
        setCommandHistory(prev => [...prev, messages[index]]);
        setTimeout(() => typeMessage(index + 1), 500);
      }
    };

    typeMessage(0);

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);
        setCommandHistory(prev => [
          ...prev,
          '> Article found',
          '> Loading content...',
          '> Rendering markdown...'
        ]);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load blog post');
        setCommandHistory(prev => [
          ...prev,
          '> Error: Article not found',
          '> Please check the URL and try again'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      setTimeout(fetchPost, messages.length * 500);
    }
  }, [params.slug]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 font-mono bg-primary text-white"
    >
      <div className="max-w-4xl mx-auto">
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
              <span className="text-textSecondary text-sm">zfts-reader -- {params.slug}.md</span>
              <span className="text-accent/50">|</span>
              <Link 
                href="/blog"
                className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
              >
                cd ../blog
              </Link>
            </div>
          </motion.div>

          {/* Terminal Output - Command History */}
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
                  className={`text-sm ${
                    line.includes('Error') ? 'text-red-400' : 
                    line.includes('found') ? 'text-green-400' : 
                    'text-textSecondary'
                  }`}
                >
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-accent"
              >
                {">"} Loading content...
              </motion.span>
            </div>
          ) : error || !post ? (
            <div className="flex flex-col items-center justify-center h-32 space-y-4">
              <span className="text-red-400 text-lg">{">"} {error || 'Article not found'}</span>
              <Link
                href="/blog"
                className="text-accent hover:text-accent/80 transition-colors duration-200"
              >
                {">"} Return to blog
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Article Header */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <motion.h1 
                    className="text-3xl font-bold text-textPrimary leading-tight"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="text-accent mr-2">{">"}</span>
                    {post.title}
                  </motion.h1>
                  
                  <motion.div 
                    className="flex flex-wrap items-center gap-4 text-sm text-textSecondary ml-6"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-accent" />
                      <time>{new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</time>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-accent" />
                      <span>{post.readTime}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FaTags className="text-accent" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="bg-accent/10 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Cover Image */}
                {post.coverImage && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="rounded-lg overflow-hidden border border-accent/20"
                  >
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-auto object-cover"
                    />
                  </motion.div>
                )}

                {/* Excerpt if available */}
                {post.excerpt && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="ml-6 text-lg text-textSecondary/90 italic border-l-2 border-accent/20 pl-4"
                  >
                    {post.excerpt}
                  </motion.div>
                )}
              </div>

              {/* Article Content */}
              <motion.div 
                className="ml-6 space-y-6 prose prose-invert prose-accent max-w-none"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-textSecondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* Article Footer */}
              <motion.div 
                className="pt-6 mt-8 border-t border-accent/20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <span>{"cd"}</span>
                    <span className="text-textSecondary">{"../blog"}</span>
                    <motion.span
                      animate={{ x: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ←
                    </motion.span>
                  </Link>
                  
                  {post.lastModified && (
                    <span className="text-xs text-textSecondary">
                      Last updated: {new Date(post.lastModified).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
