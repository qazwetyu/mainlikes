import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  try {
    // Create a simple test token
    const token = sign(
      { username: 'test', role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Set cookie with basic settings
    const cookie = serialize('admin_token', token, {
      httpOnly: false, // Not httpOnly so JS can read it for testing
      secure: false,   // Works on non-HTTPS for testing
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });
    
    // Return the response with the cookie
    return NextResponse.json(
      { 
        success: true, 
        message: 'Test login cookie set',
        token: token.substring(0, 20) + '...' // For debugging
      },
      { 
        status: 200,
        headers: { 'Set-Cookie': cookie }
      }
    );
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create test login',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 