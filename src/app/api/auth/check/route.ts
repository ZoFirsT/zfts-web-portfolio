import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { rateLimit } from '@/lib/security';

// Get PIN from environment variable, with fallback for development
const CLOUDINARY_TEST_PIN = process.env.CLOUDINARY_TEST_PIN || '1234';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.json(
      { authenticated: false, message: 'No authentication token found' },
      { status: 401 }
    );
  }
  
  try {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const key = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token.value, key);
    
    // Extract username if available
    const username = payload.username || 'admin';
    
    // Successfully verified
    return NextResponse.json({ 
      authenticated: true,
      username
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, message: 'Invalid authentication token' },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Apply rate limiting - 5 attempts per minute
  const rateLimitResult = await rateLimit({ 
    limit: 5, 
    windowMs: 60 * 1000,
    message: 'Too many PIN verification attempts, please try again later'
  })(req);
  
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const data = await req.json();
    
    // Check if this is a PIN verification request
    if (data.type === 'cloudinary_test_pin') {
      if (data.pin === CLOUDINARY_TEST_PIN) {
        return NextResponse.json({ 
          success: true, 
          message: 'PIN verified successfully' 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid PIN' 
        }, { status: 401 });
      }
    }
    
    // For other auth checks, handle accordingly
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid authentication request' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication check failed' 
    }, { status: 500 });
  }
}
