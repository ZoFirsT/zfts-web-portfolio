import { NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/api-utils';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

async function handler(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Here you would normally send the email
    // For now, we'll just simulate a successful response
    console.log('Contact form submission:', data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}

// Export the handler with rate limiting
// Allow 5 submissions per hour per IP
export const POST = withApiSecurity(handler, {
  rateLimit: {
    limit: 5,
    windowMs: 60 * 60 * 1000 // 1 hour
  }
});
