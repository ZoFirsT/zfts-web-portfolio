import { connectToDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const token = request.cookies.get('auth-token');
    
    // Get query parameters
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    
    // Build query
    let query: any = token ? {} : { published: true };
    
    // Add tag filter if provided
    if (tag) {
      query.tags = { $elemMatch: { name: tag } };
    }
    
    const posts = await db.collection('posts')
      .find(query)
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content || !data.slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, and slug are required' },
        { status: 400 }
      );
    }
    
    // Check for duplicate slug
    const existingPost = await db.collection('posts').findOne({ slug: data.slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }
    
    // Create post object with all fields
    const post = {
      title: data.title,
      content: data.content,
      slug: data.slug.toLowerCase().trim(),
      date: new Date(),
      lastModified: new Date(),
      published: data.published || false,
      tags: data.tags || [], // Add tags support
    };
    
    const result = await db.collection('posts').insertOne(post);
    
    return NextResponse.json({
      message: 'Post created successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
