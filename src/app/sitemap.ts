import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { db } = await connectToDatabase();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Get all published blog posts
  const posts = await db.collection('posts')
    .find({ published: true })
    .toArray();

  // Create blog post entries
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified || post.date,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    },
    // Add other static routes here
  ];

  return [...routes, ...blogEntries];
}
