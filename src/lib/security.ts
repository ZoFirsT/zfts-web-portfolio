import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter
// Note: This is not persistent across serverless function invocations
// For production, use Redis or another distributed cache
const ipRequests: Record<string, { count: number, timestamp: number }> = {};

interface RateLimitOptions {
  limit: number;       // Maximum number of requests
  windowMs: number;    // Time window in milliseconds
  message?: string;    // Custom message for rate limit exceeded
}

/**
 * Rate limiter middleware for API routes
 */
export function rateLimit(options: RateLimitOptions = { limit: 100, windowMs: 60000 }) {
  return async function rateLimitMiddleware(req: NextRequest) {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    // Initialize or reset if window has passed
    if (!ipRequests[ip] || now - ipRequests[ip].timestamp > options.windowMs) {
      ipRequests[ip] = { count: 1, timestamp: now };
      return null; // No rate limit hit
    }
    
    // Increment request count
    ipRequests[ip].count++;
    
    // Check if rate limit exceeded
    if (ipRequests[ip].count > options.limit) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      
      // Return rate limit response
      return NextResponse.json(
        { error: options.message || 'Too many requests, please try again later' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(options.windowMs / 1000).toString(),
            'X-RateLimit-Limit': options.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil((ipRequests[ip].timestamp + options.windowMs) / 1000).toString()
          }
        }
      );
    }
    
    return null; // No rate limit hit
  };
}

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://analytics.google.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "connect-src 'self' https://api.cloudinary.com https://analytics.google.com",
    "frame-src 'self' https://www.youtube.com",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; ');

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS (Strict-Transport-Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  return response;
}

/**
 * Check if a request is potentially malicious
 * This is a simple implementation that can be expanded
 */
export function checkMaliciousRequest(req: NextRequest): boolean {
  const url = req.nextUrl.toString();
  const userAgent = req.headers.get('user-agent') || '';
  
  // Check for common attack patterns in URL
  const maliciousPatterns = [
    /\.\.\//g,                // Directory traversal
    /\bselect\b.*\bfrom\b/gi, // SQL injection
    /\bunion\b.*\bselect\b/gi, // SQL injection
    /\bscript\b/gi,           // XSS
    /\balert\b.*\(/gi,        // XSS
    /\beval\b.*\(/gi,         // XSS
    /\bexec\b.*\(/gi,         // Command injection
    /\bsystem\b.*\(/gi,       // Command injection
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(url)) {
      return true;
    }
  }
  
  // Check for suspicious user agents
  const suspiciousAgents = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /nmap/i,
    /masscan/i,
    /zgrab/i,
    /gobuster/i,
    /dirbuster/i,
  ];
  
  for (const agent of suspiciousAgents) {
    if (agent.test(userAgent)) {
      return true;
    }
  }
  
  return false;
} 