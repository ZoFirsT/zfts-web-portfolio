'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa';

interface ImageData {
  publicId: string;
  url: string;
  createdAt: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

const ImageManager = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Could not load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    const loadingToast = toast.loading('Uploading image...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('Image uploaded successfully', { id: loadingToast });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchImages(); // Refresh the list
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image', { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    const loadingToast = toast.loading('Deleting image...');
    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete image');
      }

      toast.success('Image deleted successfully', { id: loadingToast });
      // Remove from state
      setImages(images.filter(img => img.publicId !== publicId));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image', { id: loadingToast });
    }
  };

  // Format file size to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Image Manager</h2>
      
      {/* Upload Section */}
      <div className="mb-8 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <div className="flex flex-col items-center">
          {previewUrl ? (
            <div className="mb-4 relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-40 object-contain rounded" 
              />
              <button 
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ) : (
            <label className="w-full h-32 flex flex-col items-center justify-center cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <FaCloudUploadAlt size={36} className="mb-2 text-gray-500" />
              <span className="text-sm text-gray-500">Click to select an image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
          
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`px-4 py-2 rounded-lg ${
              !selectedFile || uploading
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } transition`}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
      
      {/* Gallery Section */}
      <h3 className="text-xl font-semibold mb-4">Your Images</h3>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div 
              key={image.publicId} 
              className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative h-40">
                <img
                  src={image.url}
                  alt={image.publicId}
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity"
                >
                  <button
                    onClick={() => handleDelete(image.publicId)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    title="Delete image"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 text-xs">
                <p className="truncate" title={image.publicId}>ID: {image.publicId.split('/').pop()}</p>
                <p>{formatBytes(image.bytes)} • {image.format.toUpperCase()}</p>
                <p>{new Date(image.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No images found. Upload your first image!</p>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
