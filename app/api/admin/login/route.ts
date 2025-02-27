import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

// Create a secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Check against environment variables
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a JWT token
      const token = sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
      );
      
      // Set cookie
      const cookie = serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60, // 8 hours
        path: '/'
      });
      
      return NextResponse.json(
        { success: true, message: 'Login successful' },
        { 
          status: 200,
          headers: { 'Set-Cookie': cookie }
        }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 