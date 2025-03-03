import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  const testCookie = serialize('test_cookie', 'working', {
    httpOnly: false, // Visible to JS for testing
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/'
  });
  
  return NextResponse.json(
    { success: true, message: 'Test cookie set' },
    { 
      status: 200,
      headers: { 'Set-Cookie': testCookie }
    }
  );
} 