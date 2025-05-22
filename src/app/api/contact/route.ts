import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

// Simple rate limiting
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const emailRequests = new Map<string, number>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const lastRequest = emailRequests.get(email) || 0;
  
  if (now - lastRequest < RATE_LIMIT_DURATION) {
    return true;
  }
  
  emailRequests.set(email, now);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Check rate limiting
    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: 'Please wait a minute before sending another message' },
        { status: 429 }
      );
    }

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const result = await sendContactEmail({ name, email, subject, message });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
