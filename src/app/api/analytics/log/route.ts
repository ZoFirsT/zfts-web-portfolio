import { NextRequest, NextResponse } from 'next/server';
import { logVisit } from '@/lib/analytics';

// Maximum request body size to avoid "packet length too long" errors
const MAX_BODY_SIZE = 10 * 1024; // 10KB should be plenty for analytics data

/**
 * Process analytics requests with SSL error prevention
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure the request size is not too large
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      console.warn(`Analytics request size too large: ${contentLength} bytes`);
      return NextResponse.json({ success: false, error: 'Request body too large' }, { status: 413 });
    }
    
    // Get the request body with a timeout to avoid hanging the API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
    
    let data;
    try {
      data = await request.json();
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('Failed to parse analytics JSON:', error);
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
    
    // Validate required data
    if (!data.path || !data.method) {
      return NextResponse.json({ success: false, error: 'Missing required analytics data' }, { status: 400 });
    }
    
    // Create a mock request object with the data we need
    const mockRequest = {
      ip: data.ip || request.ip || 'unknown',
      headers: {
        get: (header: string) => {
          if (header === 'user-agent') return data.userAgent || request.headers.get('user-agent');
          if (header === 'referer') return data.referer || request.headers.get('referer');
          if (header === 'x-forwarded-for') return data.ip || request.headers.get('x-forwarded-for');
          return null;
        }
      },
      nextUrl: {
        pathname: data.path
      },
      method: data.method
    };
    
    // Log the visit using our existing function
    await logVisit(mockRequest as any);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json(
      { error: 'Failed to log visit', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// For compatibility with GET requests
export async function GET(request: NextRequest) {
  // Extract the data from the request and create a manually formed payload
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Prepare the analytics data
  const analyticsData = {
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    path: path,
    method: 'GET',
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer')
  };
  
  try {
    // Create a mock request object with the data we need
    const mockRequest = {
      ip: analyticsData.ip,
      headers: {
        get: (header: string) => {
          if (header === 'user-agent') return analyticsData.userAgent;
          if (header === 'referer') return analyticsData.referer;
          if (header === 'x-forwarded-for') return analyticsData.ip;
          return null;
        }
      },
      nextUrl: {
        pathname: analyticsData.path
      },
      method: analyticsData.method
    };
    
    // Log the visit using our existing function
    await logVisit(mockRequest as any);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in GET analytics handler:', error);
    return NextResponse.json({ success: false, error: 'Analytics processing error' }, { status: 500 });
  }
}
