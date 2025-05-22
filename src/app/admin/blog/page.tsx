'use client';

import BlogAdmin from '@/components/BlogAdmin';
import AdminLayout from '@/components/AdminLayout';

export default function AdminBlogPage() {
  return (
    <AdminLayout activePage="blog">
      <BlogAdmin />
    </AdminLayout>
  );
}
