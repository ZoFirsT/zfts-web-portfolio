import { connectToDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const token = request.cookies.get('auth-token');
    
    // If no auth token, only return published posts
    const query = token ? {} : { published: true };
    
    const posts = await db.collection('posts')
      .find(query)
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
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
    
    const post = {
      ...data,
      date: new Date(),
      lastModified: new Date(),
      slug: data.slug.toLowerCase().trim()
    };
    
    const result = await db.collection('posts').insertOne(post);
    const createdPost = await db.collection('posts').findOne({ _id: result.insertedId });
    
    return NextResponse.json(createdPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
