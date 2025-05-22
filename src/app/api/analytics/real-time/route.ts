import { NextRequest, NextResponse } from 'next/server';
import { getRealTimeVisitors } from '@/lib/analytics';
import { jwtVerify } from 'jose';

// Only authenticated users should access analytics
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
    const realTimeData = await getRealTimeVisitors();
    return NextResponse.json(realTimeData);
  } catch (error) {
    console.error('Failed to get real-time visitors data:', error);
    return NextResponse.json(
      { error: 'Failed to get real-time visitor data' },
      { status: 500 }
    );
  }
}
