import { NextRequest, NextResponse } from 'next/server';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    
    console.log(`Login attempt: ${username}`);
    
    if (username === expectedUsername && password === expectedPassword) {
      // Create JWT token with 24-hour expiration
      const token = sign(
        { username, role: 'admin' },
        jwtSecret,
        { expiresIn: '24h' }
      );
      
      // Set the token as a cookie
      const cookieStore = cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400, // 24 hours
        path: '/'
      });
      
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        redirectTo: '/super-admin'
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid credentials'
    }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 