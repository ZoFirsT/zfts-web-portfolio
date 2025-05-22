import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { jwtVerify } from 'jose';

// Only authenticated users should access security data
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
  
  // Get time range from query params
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get('timeRange') || '24h'; // Default to 24h
  
  try {
    const { db } = await connectToDatabase();
    const now = new Date();
    
    // Calculate time range
    let startDate;
    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // Get total attack attempts in time range
    const totalAttempts = await db.collection('analytics_ddos').countDocuments({
      timestamp: { $gte: startDate }
    });
    
    // Get count of unique blocked IPs
    const blockedIPsResult = await db.collection('analytics_ddos').aggregate([
      { $match: { timestamp: { $gte: startDate }, blocked: true } },
      { $group: { _id: '$ip' } },
      { $count: 'count' }
    ]).toArray();
    const blockedIPs = blockedIPsResult[0]?.count || 0;
    
    // Get recent attack attempts
    const recentAttempts = await db.collection('analytics_ddos')
      .find({ timestamp: { $gte: startDate } })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    // Get top attacker IPs
    const topAttackerIPsResult = await db.collection('analytics_ddos').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$ip', attemptCount: { $sum: 1 } } },
      { $sort: { attemptCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          ip: '$_id',
          attemptCount: 1
        }
      }
    ]).toArray();
    
    return NextResponse.json({
      totalAttempts,
      blockedIPs,
      recentAttempts: recentAttempts.map(attempt => ({
        ip: attempt.ip,
        timestamp: attempt.timestamp,
        requestCount: attempt.requestCount,
        paths: attempt.paths,
        blocked: attempt.blocked
      })),
      topAttackerIPs: topAttackerIPsResult,
      timeRange
    });
  } catch (error) {
    console.error('Failed to get security stats:', error);
    return NextResponse.json(
      { error: 'Failed to get security stats' },
      { status: 500 }
    );
  }
}
