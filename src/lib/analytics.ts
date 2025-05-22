import { connectToDatabase } from './mongodb';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

// Types for analytics data
export type VisitLogEntry = {
  ip: string | null;
  userAgent: string | null;
  path: string;
  referer: string | null;
  timestamp: Date;
  method: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  sessionId?: string;
};

export type DDoSLogEntry = {
  ip: string | null;
  timestamp: Date;
  requestCount: number;
  timeWindow: number; // in seconds
  paths: string[];
  blocked: boolean;
};

/**
 * Log a visit to the website
 */
export async function logVisit(request: NextRequest): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    
    // Extract basic data from request
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const userAgent = request.headers.get('user-agent');
    const path = request.nextUrl.pathname;
    const referer = request.headers.get('referer');
    const method = request.method;
    
    // Simple device/browser/os detection
    const device = getDeviceInfo(userAgent);
    const browser = getBrowserInfo(userAgent);
    const os = getOSInfo(userAgent);
    
    // Create visit log entry
    const visitLog: VisitLogEntry = {
      ip,
      userAgent,
      path,
      referer,
      timestamp: new Date(),
      method,
      device,
      browser,
      os
    };
    
    // Store in database
    await db.collection('analytics_visits').insertOne(visitLog);
    
    // Check for potential DDoS
    await checkForDDoS(ip, path, db);
  } catch (error) {
    console.error('Failed to log visit:', error);
  }
}

/**
 * Check for potential DDoS attacks
 * This is a simple implementation that checks if an IP makes too many requests in a short time
 */
async function checkForDDoS(ip: string, path: string, db: any): Promise<void> {
  try {
    // Configure these values based on your tolerance
    const TIME_WINDOW = 60; // 60 seconds
    const REQUEST_THRESHOLD = 100; // 100 requests within the time window is suspicious
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - TIME_WINDOW * 1000);
    
    // Count requests from this IP within the time window
    const requestCount = await db.collection('analytics_visits').countDocuments({
      ip,
      timestamp: { $gte: windowStart }
    });
    
    // If request count exceeds threshold, log a potential DDoS attempt
    if (requestCount >= REQUEST_THRESHOLD) {
      // Get all paths requested by this IP
      const pathsResult = await db.collection('analytics_visits').aggregate([
        { $match: { ip, timestamp: { $gte: windowStart } } },
        { $group: { _id: '$path' } },
        { $project: { _id: 0, path: '$_id' } }
      ]).toArray();
      
      const paths = pathsResult.map((item: any) => item.path);
      
      // Log DDoS attempt
      const ddosLog: DDoSLogEntry = {
        ip,
        timestamp: now,
        requestCount,
        timeWindow: TIME_WINDOW,
        paths,
        blocked: true // You can implement actual blocking logic
      };
      
      await db.collection('analytics_ddos').insertOne(ddosLog);
      
      console.warn(`Potential DDoS detected from IP: ${ip}, ${requestCount} requests in ${TIME_WINDOW} seconds`);
    }
  } catch (error) {
    console.error('Failed to check for DDoS:', error);
  }
}

/**
 * Get analytics data for a dashboard
 */
export async function getAnalyticsData(timeRange: string = '24h'): Promise<any> {
  try {
    const { db } = await connectToDatabase();
    const now = new Date();
    
    // Calculate time range
    let startDate;
    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
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
    
    // Get total visits in time range
    const totalVisits = await db.collection('analytics_visits').countDocuments({
      timestamp: { $gte: startDate }
    });
    
    // Get unique visitors (by IP)
    const uniqueVisitorsResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$ip' } },
      { $count: 'count' }
    ]).toArray();
    const uniqueVisitors = uniqueVisitorsResult[0]?.count || 0;
    
    // Get top pages
    const topPagesResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, path: '$_id', count: 1 } }
    ]).toArray();
    
    // Get visits by browser
    const visitsByBrowserResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, browser: '$_id', count: 1 } }
    ]).toArray();
    
    // Get visits by device
    const visitsByDeviceResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { _id: 0, device: '$_id', count: 1 } }
    ]).toArray();
    
    // Get visits by operating system
    const visitsByOSResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, os: '$_id', count: 1 } }
    ]).toArray();
    
    // Get visits by referer
    const visitsByRefererResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate }, referer: { $ne: null } } },
      { $group: { _id: '$referer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, referer: '$_id', count: 1 } }
    ]).toArray();
    
    // Get visits by hour (for charts)
    const visitsByHourResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
              hour: '$_id.hour'
            }
          },
          count: 1
        }
      }
    ]).toArray();
    
    // Get DDoS attempts
    const ddosAttemptsResult = await db.collection('analytics_ddos')
      .find({ timestamp: { $gte: startDate } })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    
    // Return compiled analytics data
    return {
      totalVisits,
      uniqueVisitors,
      topPages: topPagesResult,
      visitsByBrowser: visitsByBrowserResult,
      visitsByDevice: visitsByDeviceResult,
      visitsByOS: visitsByOSResult,
      visitsByReferer: visitsByRefererResult,
      visitsByHour: visitsByHourResult,
      ddosAttempts: ddosAttemptsResult,
      timeRange,
    };
  } catch (error) {
    console.error('Failed to get analytics data:', error);
    throw error;
  }
}

/**
 * Get real-time visitors (last 5 minutes)
 */
export async function getRealTimeVisitors(): Promise<any> {
  try {
    const { db } = await connectToDatabase();
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Get active visitors in last 5 minutes
    const activeVisitorsResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: fiveMinutesAgo } } },
      { $group: { _id: '$ip' } },
      { $count: 'count' }
    ]).toArray();
    const activeVisitors = activeVisitorsResult[0]?.count || 0;
    
    // Get currently viewed pages
    const currentPagesResult = await db.collection('analytics_visits').aggregate([
      { $match: { timestamp: { $gte: fiveMinutesAgo } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$ip', lastView: { $first: '$path' } } },
      { $group: { _id: '$lastView', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, path: '$_id', count: 1 } }
    ]).toArray();
    
    return {
      activeVisitors,
      currentPages: currentPagesResult,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Failed to get real-time visitors:', error);
    throw error;
  }
}

/**
 * Helper function to detect device type from user agent
 */
function getDeviceInfo(userAgent: string | null): string {
  if (!userAgent) return 'unknown';
  
  if (userAgent.match(/iPad/i) || userAgent.match(/Tablet/i))
    return 'tablet';
  if (userAgent.match(/Mobile/i) || userAgent.match(/iPhone/i) || userAgent.match(/Android/i))
    return 'mobile';
  return 'desktop';
}

/**
 * Helper function to detect browser from user agent
 */
function getBrowserInfo(userAgent: string | null): string {
  if (!userAgent) return 'unknown';
  
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('SamsungBrowser') > -1) return 'Samsung Browser';
  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) return 'Opera';
  if (userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  return 'unknown';
}

/**
 * Helper function to detect OS from user agent
 */
function getOSInfo(userAgent: string | null): string {
  if (!userAgent) return 'unknown';
  
  if (userAgent.indexOf('Windows') > -1) return 'Windows';
  if (userAgent.indexOf('Mac OS') > -1) return 'MacOS';
  if (userAgent.indexOf('X11') > -1) return 'UNIX';
  if (userAgent.indexOf('Linux') > -1) return 'Linux';
  if (userAgent.indexOf('Android') > -1) return 'Android';
  if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) return 'iOS';
  return 'unknown';
}
