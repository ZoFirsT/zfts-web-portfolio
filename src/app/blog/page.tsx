'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BlogMetadata from '@/components/BlogMetadata';

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      '> Initializing blog archive...',
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
        // Filter out unpublished posts on the client side as a backup
        // even though the API already filters them
        const publishedPosts = data.filter((post: BlogPost) => post.published);
        setPosts(publishedPosts);
        setCommandHistory(prev => [
          ...prev,
          `> Successfully loaded ${publishedPosts.length} articles`,
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
    <>
      <BlogMetadata
        title="Blog | ZFTS"
        description="Explore articles about web development, cloud architecture, DevOps practices, and software engineering insights."
        url={`${process.env.NEXT_PUBLIC_SITE_URL}/blog`}
        date={new Date().toISOString()}
        tags={['web development', 'cloud computing', 'DevOps', 'software engineering']}
      />
      <div className="min-h-screen bg-primary text-white py-20 font-mono">
        <div className="max-w-7xl mx-auto px-4">
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
                <span className="text-textSecondary text-sm">zfts-blog -- Articles</span>
                <span className="text-accent/50">|</span>
                <Link 
                  href="/"
                  className="text-accent/80 hover:text-accent transition-colors duration-200 text-sm"
                >
                  cd ../home
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
                      line.includes('Error') ? 'text-red-400' : 
                      line.includes('Successfully') ? 'text-green-400' : 
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

            {/* Blog Posts Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {error ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-red-400">{">"} {error}</p>
                  <p className="text-accent mt-2">{">"} Please try again later...</p>
                </div>
              ) : posts.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-10"
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
                    className="group bg-secondary/20 p-4 rounded-lg border border-accent/20 hover:bg-secondary/30 transition-all duration-200"
                  >
                    {post.coverImage && (
                      <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                        <motion.img
                          src={post.coverImage}
                          alt={post.title}
                          className="object-cover w-full h-full"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-accent">{">"}</span>
                        <h2 className="font-semibold text-lg text-textPrimary group-hover:text-accent transition-colors duration-200">
                          {post.title}
                        </h2>
                      </div>
                      <div className="ml-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-textSecondary">
                        <time>{new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <p className="ml-6 text-sm text-textSecondary line-clamp-3">{post.excerpt}</p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="ml-6 inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors duration-200"
                      >
                        <span>{"cat"}</span>
                        <span className="text-textSecondary group-hover:text-accent/60 transition-colors duration-200">
                          {"article.md"}
                        </span>
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
