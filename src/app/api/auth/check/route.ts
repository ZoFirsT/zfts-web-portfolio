import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

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
