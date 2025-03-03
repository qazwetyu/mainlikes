import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log('Login attempt with:', { username });
    
    // Use environment variables with fallbacks
    const validUsername = process.env.ADMIN_USERNAME || "qazwetyu";
    const validPassword = process.env.ADMIN_PASSWORD || "Bayraasuga12";
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    
    // Verify credentials
    if (username === validUsername && password === validPassword) {
      console.log('Credentials verified successfully');
      
      // Create a JWT token
      const token = sign(
        { username, role: 'admin' },
        jwtSecret,
        { expiresIn: '8h' }
      );
      
      console.log('Token generated successfully');
      
      // Set cookie with more permissive settings for testing
      const cookie = serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Try 'lax' instead of 'none'
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/'
      });
      
      console.log('Cookie prepared:', cookie.substring(0, 50) + '...');
      
      // Return the response with the cookie
      return NextResponse.json(
        { success: true, message: 'Login successful' },
        { 
          status: 200,
          headers: { 'Set-Cookie': cookie }
        }
      );
    }
    
    console.log('Invalid credentials provided');
    
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 