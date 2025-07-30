'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import ImageManager from '@/components/ImageManager';
import LoadingAnimation from '@/components/LoadingAnimation';

export default function ImagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push('/login?redirect=/admin/images');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login?redirect=/admin/images');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingAnimation />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout activePage="dashboard">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Image Management</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Manage blog images uploaded to your Cloudinary account.
        </p>
        
        <ImageManager />
      </div>
    </AdminLayout>
  );
}
