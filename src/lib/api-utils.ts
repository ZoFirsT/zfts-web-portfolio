import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './security';

type RouteHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

interface ApiOptions {
  rateLimit?: {
    limit: number;
    windowMs: number;
  };
}

/**
 * API route wrapper with security features
 * 
 * @param handler The API route handler function
 * @param options Configuration options
 * @returns The wrapped handler function
 */
export function withApiSecurity(handler: RouteHandler, options: ApiOptions = {}) {
  return async function secureHandler(req: NextRequest) {
    try {
      // Apply rate limiting if configured
      if (options.rateLimit) {
        const limiter = rateLimit({
          limit: options.rateLimit.limit,
          windowMs: options.rateLimit.windowMs
        });
        
        const rateLimitResult = await limiter(req);
        if (rateLimitResult) {
          return rateLimitResult; // Return rate limit response
        }
      }
      
      // Call the original handler
      return await handler(req);
    } catch (error) {
      console.error('API error:', error);
      
      // Return a generic error response
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
} 