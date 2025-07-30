import { NextRequest, NextResponse } from 'next/server';
import { getBlogViewAnalytics } from '@/lib/analytics';
import { jwtVerify } from 'jose';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Function to check if a request is from an authenticated user
async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth-token');
  if (!token) return false;
  
  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const key = new TextEncoder().encode(secretKey);
    await jwtVerify(token.value, key);
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Get time range from query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // Only allow these time ranges
    if (!['1h', '24h', '7d', '30d', 'all'].includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time range' },
        { status: 400 }
      );
    }
    
    // Get analytics data
    const analyticsData = await getBlogViewAnalytics(timeRange);
    
    // Return the data
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Failed to get blog analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get blog analytics' },
      { status: 500 }
    );
  }
} 