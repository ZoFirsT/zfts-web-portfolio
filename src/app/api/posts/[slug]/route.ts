import { connectToDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const token = request.cookies.get('auth-token');
    const post = await db.collection('posts').findOne({ slug: params.slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // If post is not published and user is not authenticated, return 404
    if (!post.published && !token) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('posts').deleteOne({ slug: params.slug });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    if (!params.slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content || !data.slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required fields' },
        { status: 400 }
      );
    }
    
    // If slug is being changed, check for duplicates
    if (data.slug !== params.slug) {
      const existingPost = await db.collection('posts').findOne({ slug: data.slug });
      if (existingPost) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 409 }
        );
      }
    }
    
    // Extract only the fields we want to update
    const updateData = {
      title: data.title,
      content: data.content,
      slug: data.slug.toLowerCase().trim(),
      lastModified: new Date(),
      // Preserve published state if it exists in the data
      ...(typeof data.published !== 'undefined' && { published: data.published })
    };

    const result = await db.collection('posts').updateOne(
      { slug: params.slug },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Fetch and return the updated post
    const updatedPost = await db.collection('posts').findOne({ slug: data.slug.toLowerCase().trim() });
    if (!updatedPost) {
      console.error('Failed to fetch updated post after update:', {
        originalSlug: params.slug,
        newSlug: data.slug.toLowerCase().trim(),
        updateResult: result
      });
      return NextResponse.json(
        { error: 'Failed to fetch updated post' },
        { status: 500 }
      );
    }
    
    console.log('Post updated successfully:', {
      slug: updatedPost.slug,
      title: updatedPost.title,
      lastModified: updatedPost.lastModified
    });
    return NextResponse.json({ 
      message: 'Post updated successfully',
      slug: data.slug 
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating post' },
      { status: 500 }
    );
  }
}
