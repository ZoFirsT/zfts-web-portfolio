import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  // Create the base response that we'll potentially modify and return
  let response = NextResponse.next();
  
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
  
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return response; // Return the response
  }

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

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next|static|public|favicon.ico).*)']
};
