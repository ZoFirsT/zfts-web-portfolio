'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type BlogPost = {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  slug: string;
  coverImage: string;
  published: boolean;
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      '> Initializing blog module...',
      '> Connecting to content database...',
      '> Fetching published articles...'
    ];

    const typeMessage = async (index: number) => {
      if (index < messages.length) {
        setCommandHistory(prev => [...prev, messages[index]]);
        setTimeout(() => typeMessage(index + 1), 500);
      }
    };

    typeMessage(0);

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        const filteredPosts = data.filter((post: BlogPost) => post.published);
        setPosts(filteredPosts);
        setCommandHistory(prev => [
          ...prev,
          `> Successfully loaded ${filteredPosts.length} articles`,
          '> Ready for browsing'
        ]);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts');
        setCommandHistory(prev => [
          ...prev,
          '> Error: Failed to load blog posts',
          '> Please check your connection and try again'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(fetchPosts, messages.length * 500);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative flex flex-col text-left max-w-full p-8 justify-evenly mx-auto items-center font-mono"
    >
      <div className="w-full max-w-6xl mx-auto bg-secondary/30 p-4 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm">
        {/* Terminal Header */}
        <motion.div 
          className="flex items-center gap-2 mb-4 pb-2 border-b border-accent/20"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-textSecondary text-sm">zfts-blog -- Articles</span>
        </motion.div>

        {/* Terminal Output - Command History */}
        <div className="h-[20vh] overflow-y-auto space-y-2 mb-4 p-2 bg-secondary/20 rounded">
          <AnimatePresence>
            {commandHistory.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`font-mono ${
                  line.includes('Error') ? 'text-red-400' : 
                  line.includes('Successfully') ? 'text-green-400' : 
                  'text-textSecondary'
                }`}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Blog Posts in Terminal Style */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="text-textSecondary">
                {">"} No published articles available at the moment.
              </p>
              <p className="text-accent mt-2">
                {">"} Please check back later...
              </p>
            </motion.div>
          ) : (
            posts.map((post) => (
              <motion.article
                key={post.slug}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-secondary/20 p-4 rounded-lg border border-accent/20 hover:bg-secondary/30 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-2 text-accent">
                  <span>{">"}</span>
                  <h4 className="font-semibold">{post.title}</h4>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-4 text-sm text-textSecondary">
                    <time>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</time>
                    <span>|</span>
                    <span>{post.readTime}</span>
                  </div>
                  <p className="text-textSecondary text-sm">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <span>{"cat"}</span>
                    <span className="text-textSecondary">{"article.md"}</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.article>
            ))
          )}
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors duration-200"
            >
              View All Articles
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Blog;
