import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  // Clear the auth token cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth-token');
  
  return response;
}
