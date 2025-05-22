'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSpinner, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import RichTextEditor from './RichTextEditor';

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
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
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
  const [previewMode, setPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (slug: string) => {
    if (!slug || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.slug !== slug));
        toast.success('Post deleted successfully');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields with detailed feedback
    const missingFields = [];
    if (!currentPost.title) missingFields.push('title');
    if (!currentPost.content) missingFields.push('content');
    
    if (missingFields.length > 0) {
      toast.error(`Required fields missing: ${missingFields.join(', ')}`);
      return;
    }
    
    // Generate and sanitize slug
    const newSlug = currentPost.slug || currentPost.title;
    const sanitizedSlug = newSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const postToSave = {
      ...currentPost,
      slug: sanitizedSlug
    };
    
    setIsSaving(true);

    try {
      const isEditing = posts.some(post => post.slug === currentPost.slug);
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/posts/${currentPost.slug}` : '/api/posts';
      
      console.log('Saving post:', method, url, postToSave);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postToSave),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing response:', jsonError);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        console.error('Failed to save post:', {
          status: response.status,
          error: data?.error,
          details: data?.details,
          method,
          url,
          postSlug: postToSave.slug
        });
        
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error('A post with this slug already exists');
        } else if (response.status === 401) {
          throw new Error('You are not authorized. Please log in again.');
        } else if (response.status === 400) {
          throw new Error(data?.error || 'Invalid post data');
        }
        
        throw new Error(data?.error || `Failed to ${isEditing ? 'update' : 'create'} post`);
      }

      await fetchPosts();
      setIsEditing(false);
      toast.success(isEditing ? 'Post updated successfully' : 'Post created successfully');
      
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
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      throw error;
    }
  };

  const handleImageDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please drop an image file');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(file);
      // Insert image URL into content at cursor position or at the end
      const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
      setCurrentPost(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      setCurrentPost(prev => ({
        ...prev,
        coverImage: imageUrl
      }));
      toast.success('Cover image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload cover image');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white dark:bg-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">Blog Management</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FaPlus /> New Post
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.slug}
              layout
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {post.coverImage && (
                <div className="relative h-48">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {!post.published && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      Draft
                    </div>
                  )}
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <div className="flex gap-3">
                    <Link 
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <FaEye />
                    </Link>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border dark:border-gray-700"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {posts.some(p => p.slug === currentPost.slug) ? 'Edit Post' : 'New Post'}
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      previewMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {previewMode ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {currentPost.coverImage && (
                      <img
                        src={currentPost.coverImage}
                        alt={currentPost.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h1 className="text-gray-900 dark:text-white">{currentPost.title}</h1>
                    <p className="text-gray-700 dark:text-gray-300">{currentPost.excerpt}</p>
                    <div 
                      dangerouslySetInnerHTML={{ __html: currentPost.content }}
                      className="text-gray-800 dark:text-gray-200"
                    />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Title</label>
                        <input
                          type="text"
                          value={currentPost.title}
                          onChange={(e) => {
                            const title = e.target.value;
                            setCurrentPost({
                              ...currentPost,
                              title,
                              slug: generateSlug(title)
                            });
                          }}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                          placeholder="Enter post title..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Excerpt</label>
                        <textarea
                          value={currentPost.excerpt}
                          onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                          rows={2}
                          placeholder="Brief description of your post..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Content</label>
                        <RichTextEditor
                          content={currentPost.content}
                          onChange={(content) => setCurrentPost({ ...currentPost, content })}
                          placeholder="Write your post content here..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Slug</label>
                        <input
                          type="text"
                          value={currentPost.slug}
                          onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentPost.published}
                            onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Published</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t dark:border-gray-700">
                      <div className="flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                        >
                          {isSaving && <FaSpinner className="animate-spin" />}
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
