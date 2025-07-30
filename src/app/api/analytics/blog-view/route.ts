import { NextRequest, NextResponse } from 'next/server';
import { logBlogView } from '@/lib/analytics';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

/**
 * API route to log blog post views
 * Accepts both GET and POST requests
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { slug, title, readTime } = body;
    
    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: slug and title' },
        { status: 400 }
      );
    }
    
    // Log the blog view
    await logBlogView(slug, title, readTime, request);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging blog view:', error);
    return NextResponse.json(
      { error: 'Failed to log blog view', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// For compatibility with GET requests (e.g., from image pixels)
export async function GET(request: NextRequest) {
  try {
    // Get parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const title = searchParams.get('title');
    const readTime = searchParams.get('readTime') || undefined;
    
    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Missing required parameters: slug and title' },
        { status: 400 }
      );
    }
    
    // Log the blog view
    await logBlogView(slug, title, readTime || undefined, request);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in GET blog view handler:', error);
    return NextResponse.json(
      { error: 'Failed to log blog view', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 