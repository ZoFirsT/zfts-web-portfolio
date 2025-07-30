import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { applySecurityHeaders, checkMaliciousRequest } from './lib/security';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  // Create the base response that we'll potentially modify and return
  let response = NextResponse.next();
  
  // Apply security headers to all responses
  response = applySecurityHeaders(response);
  
  // Check if this is an API request
  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  
  // Check for malicious requests
  if (checkMaliciousRequest(request)) {
    console.warn(`Potentially malicious request detected from IP: ${request.ip} to ${request.nextUrl.pathname}`);
    
    // Log the suspicious activity to analytics_ddos collection
    try {
      const analyticsData = {
        ip: request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown',
        userAgent: request.headers.get('user-agent') ?? '',
        path: request.nextUrl.pathname,
        referer: request.headers.get('referer') ?? '',
        method: request.method,
        isMalicious: true
      };
      
      // Use fetch with AbortController to avoid blocking the response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout
      
      fetch(new URL('/api/analytics/log', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData),
        signal: controller.signal,
        cache: 'no-store',
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      // Don't let analytics errors affect the response
      console.error('Failed to log malicious request:', error);
    }
    
    // For API requests, return a JSON error; for page requests, redirect to 403
    if (isApiRequest) {
      return NextResponse.json(
        { error: 'Access denied', status: 403 },
        { status: 403 }
      );
    } else {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
  }
  
  // Restrict /test paths to localhost only
  if (request.nextUrl.pathname.startsWith('/test')) {
    const hostname = request.headers.get('host') || '';
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    
    if (!isLocalhost) {
      // For API requests, return a JSON error; for page requests, redirect to 403
      if (isApiRequest) {
        return NextResponse.json(
          { 
            error: 'Access Denied',
            message: 'This API endpoint is only accessible from localhost environments',
            status: 403
          },
          { status: 403 }
        );
      } else {
        return NextResponse.redirect(new URL('/forbidden', request.url));
      }
    }
  }
  
  // Log analytics data for all non-asset, non-API requests
  const path = request.nextUrl.pathname;
  if (
    !path.includes('.') &&      // Skip files like .js, .css, .jpg
    !path.startsWith('/api/') && // Skip API calls
    path !== '/robots.txt' &&   // Skip robots.txt
    path !== '/favicon.ico'     // Skip favicon
  ) {
    // Prepare analytics data
    const analyticsData = {
      ip: request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown',
      userAgent: request.headers.get('user-agent') ?? '',
      path: request.nextUrl.pathname,
      referer: request.headers.get('referer') ?? '',
      method: request.method
    };
    
    try {
      // Log analytics data directly at the edge
      // Use fetch with AbortController to avoid blocking the response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s timeout
      
      fetch(new URL('/api/analytics/log', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData),
        signal: controller.signal,
        cache: 'no-store',
      }).catch(err => {
        // Only log if it's not an abort error
        if (err.name !== 'AbortError') {
          console.error('Analytics fetch failed:', err);
        }
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
    } catch (error) {
      // Don't let analytics errors affect the response
      console.error('Failed to log analytics:', error);
    }
  }
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');

    if (!token) {
      // If accessing admin root, redirect to login
      if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname === '/admin/') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      // For other admin routes, redirect to admin root which will handle auth
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      await jwtVerify(token.value, key);
      return response; // Return the response
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // For Cloudinary test page, we don't redirect but let the client-side PIN protection handle it
  // This is because we want to show our custom PIN entry UI rather than redirecting to login
  // The actual protection happens in the page component

  return response; // Return the response
}

export const config = {
  matcher: ['/admin/:path*', '/test/:path*', '/((?!api|_next|static|public|favicon.ico).*)']
};
