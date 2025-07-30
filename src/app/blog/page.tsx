'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BlogMetadata from '@/components/BlogMetadata';
import BlogTags from '@/components/BlogTags';
import { FaTag, FaTimes, FaEye, FaSort, FaSearch, FaFilter } from 'react-icons/fa';

type Tag = {
  id: string;
  name: string;
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
  viewCount?: number;
};

function BlogPageContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get('tag');
  
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
        // If tag filter is applied, include it in the API request
        const url = tagFilter 
          ? `/api/posts?tag=${encodeURIComponent(tagFilter)}` 
          : '/api/posts';
        
        const response = await fetch(url);
        const data = await response.json();
        // Filter out unpublished posts on the client side as a backup
        const publishedPosts = data.filter((post: BlogPost) => post.published);
        
        setPosts(publishedPosts);
        // Filter posts if there's a tag filter
        if (tagFilter) {
          setFilteredPosts(publishedPosts.filter((post: BlogPost) => 
            post.tags.some((tag: Tag) => tag.name === tagFilter)
          ));
        } else {
          setFilteredPosts(publishedPosts);
        }
        
        // Add a message about filtering if a tag is selected
        if (tagFilter) {
          setCommandHistory(prev => [
            ...prev,
            `> Filtering for posts with tag: "${tagFilter}"`
          ]);
        }
        
        setCommandHistory(prev => [
          ...prev,
          `> Found ${publishedPosts.length} articles`,
          '> Rendering content...'
        ]);
        
        // Fetch view counts for all posts
        fetchViewCounts();
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts');
        setCommandHistory(prev => [
          ...prev,
          '> ERROR: Connection to database failed',
          '> Try refreshing the page'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [tagFilter]);
  
  // Fetch view counts for all blog posts
  const fetchViewCounts = async () => {
    try {
      const response = await fetch('/api/analytics/blog?timeRange=all');
      
      if (response.ok) {
        const data = await response.json();
        
        // Create a map of slug to view count
        const counts: Record<string, number> = {};
        data.topPosts.forEach((post: { slug: string, count: number }) => {
          counts[post.slug] = post.count;
        });
        
        setViewCounts(counts);
        setCommandHistory(prev => [...prev, '> Loaded view statistics']);
      }
    } catch (error) {
      console.error('Error fetching view counts:', error);
      // Don't show an error to the user, just log it
    }
  };

  // Sort and filter posts
  useEffect(() => {
    let sorted = [...filteredPosts];
    
    // Apply sorting
    switch (sortBy) {
      case 'date':
        sorted = sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'views':
        sorted = sorted.sort((a, b) => (viewCounts[b.slug] || 0) - (viewCounts[a.slug] || 0));
        break;
      case 'title':
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    // Apply search filter
    if (searchTerm) {
      sorted = sorted.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredPosts(sorted);
  }, [sortBy, searchTerm, posts, tagFilter, viewCounts]);

  return (
    <>
      <BlogMetadata
        title={tagFilter ? `${tagFilter} Articles | Blog | ZFTS` : "Blog | ZFTS"}
        description={tagFilter 
          ? `Explore articles related to ${tagFilter} - web development, cloud architecture, and software engineering insights.`
          : "Explore articles about web development, cloud architecture, DevOps practices, and software engineering insights."
        }
        url={tagFilter
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/blog?tag=${encodeURIComponent(tagFilter)}`
          : `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
        }
        date={new Date().toISOString()}
        tags={tagFilter 
          ? [tagFilter, 'web development', 'software engineering'] 
          : ['web development', 'cloud computing', 'DevOps', 'software engineering']
        }
        canonical={`${process.env.NEXT_PUBLIC_SITE_URL}/blog`}
      />
      <div className="min-h-screen bg-primary text-white py-10 sm:py-16 md:py-20 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/30 p-4 sm:p-6 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm"
          >
            {/* Terminal Header */}
            <motion.div 
              className="flex items-center gap-2 mb-4 sm:mb-6 pb-2 border-b border-accent/20"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 sm:gap-4 ml-2">
                <span className="text-textSecondary text-xs sm:text-sm">zfts-blog -- Articles</span>
                <span className="text-accent/50 hidden xs:inline-block">|</span>
                <Link 
                  href="/"
                  className="text-accent/80 hover:text-accent transition-colors duration-200 text-xs sm:text-sm hidden xs:inline-flex"
                >
                  cd ../home
                </Link>
              </div>
            </motion.div>

            {/* Search and Sort Controls */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-secondary/40 border border-accent/20 rounded-lg py-2 pl-9 pr-3 text-sm text-textPrimary focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/50" />
              </div>
              
              <div className="flex items-center gap-2 self-end">
                <span className="text-xs text-textSecondary whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'title')}
                  className="bg-secondary/40 border border-accent/20 rounded-lg py-1 px-2 text-sm text-textPrimary focus:outline-none focus:ring-1 focus:ring-accent/50"
                >
                  <option value="date">Newest</option>
                  <option value="views">Most viewed</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </motion.div>

            {/* Command History */}
            <motion.div 
              className="mb-6 p-3 sm:p-4 bg-secondary/20 rounded-lg border border-accent/10"
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
                    className={`font-mono text-xs sm:text-sm ${
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
                  className="text-accent text-xs sm:text-sm mt-2"
                >
                  {">"} Processing request...
                </motion.div>
              )}
              
              {/* Tag filter active indicator */}
              {tagFilter && !isLoading && (
                <div className="mt-4 pt-3 border-t border-accent/10 flex flex-wrap items-center gap-2">
                  <span className="text-accent text-xs sm:text-sm">{">"} Filtering by tag:</span>
                  <div className="bg-accent/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="text-accent text-xs sm:text-sm">{tagFilter}</span>
                    <Link href="/blog" className="text-accent hover:text-white">
                      <FaTimes size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Mobile Filters Toggle */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="sm:hidden w-full mb-4 flex items-center justify-center gap-2 p-2 bg-secondary/40 rounded-lg border border-accent/20 text-sm"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <FaFilter className="text-accent" />
              <span>{isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </motion.button>

            {/* Blog Tags Filter - Responsive */}
            <AnimatePresence>
              {(isMobileFiltersOpen || !('sm' in window)) && (
                <motion.div
                  className="mb-6 pt-4 border-t border-accent/20 sm:block"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold">Filter by Tag</h3>
                    <Link
                      href="/blog/tags"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors"
                    >
                      <FaTag className="w-2 h-2 sm:w-3 sm:h-3" />
                      <span>View All Tags</span>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all duration-200"
                    >
                      <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Clear Filter</span>
                    </Link>
                    {/* Create a list of all unique tags */}
                    <BlogTags 
                      selectedTags={
                        // Create a map of unique tags to remove duplicates
                        Array.from(
                          new Map(
                            posts.flatMap(post => post.tags)
                              .map(tag => [tag.name, tag])
                          ).values()
                        )
                      }
                      activeTag={tagFilter}
                      onTagClick={(tag) => {
                        // Check if we're already filtering by this tag (toggle behavior)
                        const isAlreadyActive = tagFilter === tag;
                        
                        if (isAlreadyActive) {
                          // Clear filter using Next.js router
                          router.push('/blog');
                          
                          // Reset to showing all posts
                          setFilteredPosts(posts);
                          
                          // Add message about clearing filter
                          setCommandHistory(prev => [
                            ...prev,
                            `> Filter cleared, showing all posts`
                          ]);
                          return;
                        }
                        
                        // Update URL with new tag filter using Next.js router
                        router.push(`/blog?tag=${encodeURIComponent(tag)}`);
                        
                        // Trigger a re-fetch of posts with the new tag filter
                        setCommandHistory(prev => [
                          ...prev,
                          `> Filtering for posts with tag: "${tag}"`
                        ]);
                        
                        // Client-side filtering
                        setFilteredPosts(
                          posts.filter((post: BlogPost) => post.tags.some((t: Tag) => t.name === tag))
                        );
                      }}
                      className="flex-1"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Blog Posts Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {error ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-red-400">{">"} {error}</p>
                  <p className="text-accent mt-2">{">"} Please try again later...</p>
                </div>
              ) : filteredPosts.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-10"
                >
                  <p className="text-textSecondary">
                    {">"} {searchTerm ? 'No articles match your search.' : 'No published articles available at the moment.'}
                  </p>
                  <p className="text-accent mt-2">
                    {">"} {searchTerm ? 'Try different keywords or clear your search.' : 'Please check back later...'}
                  </p>
                </motion.div>
              ) : (
                filteredPosts.map((post) => (
                  <motion.article
                    key={post.slug}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-secondary/20 p-3 sm:p-4 rounded-lg border border-accent/20 hover:bg-secondary/30 transition-all duration-200 flex flex-col h-full"
                  >
                    {post.coverImage && (
                      <div className="aspect-video relative overflow-hidden rounded-lg mb-3 sm:mb-4">
                        <motion.img
                          src={post.coverImage}
                          alt={post.title}
                          className="object-cover w-full h-full"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                    <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-accent">{">"}</span>
                        <h2 className="font-semibold text-base sm:text-lg text-textPrimary group-hover:text-accent transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h2>
                      </div>
                      <div className="ml-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-textSecondary">
                        <time>{new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                        {viewCounts[post.slug] !== undefined && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FaEye className="text-accent" size={10} />
                              {viewCounts[post.slug].toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="ml-6 text-xs sm:text-sm text-textSecondary line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="ml-6 mt-2">
                          <BlogTags selectedTags={post.tags.slice(0, 3)} />
                          {post.tags.length > 3 && (
                            <span className="text-xs text-textSecondary ml-1">+{post.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-auto pt-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="ml-6 inline-flex items-center gap-2 text-xs sm:text-sm text-accent hover:text-accent/80 transition-colors duration-200"
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

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary text-white py-10 sm:py-16 md:py-20 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <p className="text-accent">Loading blog posts...</p>
          </div>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
