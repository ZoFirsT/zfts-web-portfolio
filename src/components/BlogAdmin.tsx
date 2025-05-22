'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

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

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentPost, setCurrentPost] = useState<BlogPost>({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString(),
    readTime: '5 min read',
    slug: '',
    coverImage: '',
    published: false
  });

  useEffect(() => {
    const messages = [
      '> Initializing admin interface...',
      '> Authenticating session...',
      '> Loading blog management system...',
      '> Fetching all articles...'
    ];

    const typeMessage = async (index: number) => {
      if (index < messages.length) {
        setCommandHistory(prev => [...prev, messages[index]]);
        setTimeout(() => typeMessage(index + 1), 500);
      }
    };

    typeMessage(0);

    setTimeout(fetchPosts, messages.length * 500);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
      setCommandHistory(prev => [
        ...prev,
        `> Found ${data.length} articles`,
        '> Ready for management'
      ]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setCommandHistory(prev => [
        ...prev,
        '> Error: Failed to fetch articles',
        '> Please try again or contact support'
      ]);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPost),
      });

      if (response.ok) {
        setIsEditing(false);
        setCurrentPost({
          title: '',
          excerpt: '',
          content: '',
          date: new Date().toISOString(),
          readTime: '5 min read',
          slug: '',
          coverImage: '',
          published: false
        });
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 font-mono"
    >
      <div className="max-w-6xl mx-auto bg-secondary/30 p-4 rounded-lg border border-accent/20 shadow-lg backdrop-blur-sm">
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
          <span className="ml-2 text-textSecondary text-sm">zfts-admin -- Blog Management</span>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto text-accent hover:text-accent/80 transition-colors duration-200 flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" /> new_post.md
          </button>
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
                className={`${
                  line.includes('Error') ? 'text-red-400' : 
                  line.includes('Found') || line.includes('Ready') ? 'text-green-400' : 
                  'text-textSecondary'
                }`}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {isEditing && (
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-secondary/20 rounded-lg border border-accent/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-accent mb-1">Title:</label>
                  <input
                    type="text"
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    className="w-full p-2 bg-secondary/30 border border-accent/20 rounded text-textPrimary font-mono focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-accent mb-1">Excerpt:</label>
                  <textarea
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    className="w-full p-2 bg-secondary/30 border border-accent/20 rounded text-textPrimary font-mono focus:border-accent outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm text-accent mb-1">Slug:</label>
                  <input
                    type="text"
                    value={currentPost.slug}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    className="w-full p-2 bg-secondary/30 border border-accent/20 rounded text-textPrimary font-mono focus:border-accent outline-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-accent mb-1">Content:</label>
                  <textarea
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    className="w-full p-2 bg-secondary/30 border border-accent/20 rounded text-textPrimary font-mono focus:border-accent outline-none"
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-accent mb-1">Cover Image:</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Reset progress
                            setUploadProgress(0);
                            setCommandHistory(prev => [
                              ...prev,
                              `> Uploading image: ${file.name}`,
                              '> Processing and optimizing image...'
                            ]);
                            
                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                              const response = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });

                              if (!response.ok) {
                                const error = await response.json();
                                throw new Error(error.error || 'Upload failed');
                              }
                              
                              const data = await response.json();
                              setCurrentPost({ ...currentPost, coverImage: data.url });
                              setCommandHistory(prev => [
                                ...prev,
                                `> Image optimized to ${data.width}x${data.height}`,
                                '> ' + data.message
                              ]);
                              setUploadProgress(100);

                              // Reset progress after a delay
                              setTimeout(() => setUploadProgress(0), 2000);
                            } catch (error: any) {
                              console.error('Upload error:', error);
                              setCommandHistory(prev => [
                                ...prev,
                                `> Error: ${error.message || 'Failed to upload image'}`,
                                '> Please check the file and try again'
                              ]);
                              setUploadProgress(0);
                            }
                          }
                        }}
                        className="hidden"
                        id="cover-image-input"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('cover-image-input')?.click()}
                        className="w-full p-2 bg-secondary/30 border border-accent/20 rounded text-accent hover:bg-accent/10 transition-colors duration-200 text-sm"
                      >
                        Upload Image
                      </button>
                      {uploadProgress > 0 && (
                        <div className="relative h-1 bg-secondary/30 rounded overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-y-0 left-0 bg-accent/50"
                          />
                        </div>
                      )}
                      <p className="text-xs text-textSecondary mt-1">
                        Max size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
                      </p>
                    </div>
                    {currentPost.coverImage && (
                      <img
                        src={currentPost.coverImage}
                        alt="Cover preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                  {currentPost.coverImage && (
                    <input
                      type="text"
                      value={currentPost.coverImage}
                      onChange={(e) => setCurrentPost({ ...currentPost, coverImage: e.target.value })}
                      className="w-full p-2 bg-secondary/30 border border-accent/20 rounded text-textPrimary font-mono focus:border-accent outline-none text-sm"
                      placeholder="Image URL"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-accent">
                    <input
                      type="checkbox"
                      checked={currentPost.published}
                      onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                      className="rounded border-accent text-accent focus:ring-accent"
                    />
                    <span className="text-sm">Published</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 border-t border-accent/20 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-secondary/50 text-textSecondary border border-accent/20 rounded hover:bg-secondary/70 transition-colors duration-200"
              >
                ESC
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent/20 text-accent border border-accent/20 rounded hover:bg-accent/30 transition-colors duration-200"
              >
                :w
              </button>
            </div>
          </motion.form>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-secondary/20 rounded-lg border border-accent/20 hover:bg-secondary/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-accent">{">"}</span>
                  <h3 className="font-semibold text-textPrimary">{post.title}</h3>
                  {post.published ? (
                    <span className="text-green-400 text-sm">(published)</span>
                  ) : (
                    <span className="text-yellow-400 text-sm">(draft)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPost(post);
                      setIsEditing(true);
                    }}
                    className="p-2 text-accent hover:text-accent/80 transition-colors duration-200"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => post._id && handleDelete(post._id)}
                    className="p-2 text-red-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="ml-6 mt-2 text-sm text-textSecondary">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
