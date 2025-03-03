import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get cookies
    const cookies = request.cookies.getAll();
    const cookieInfo = cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.name === 'admin_token' 
        ? `${cookie.value.substring(0, 10)}...` 
        : cookie.value
    }));
    
    // Get admin token
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // Try to verify token if present
    let tokenVerification = null;
    if (adminToken) {
      try {
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = verify(adminToken, jwtSecret);
        tokenVerification = {
          valid: true,
          decoded
        };
      } catch (e) {
        // Fix error handling for unknown type
        tokenVerification = {
          valid: false,
          error: e instanceof Error ? e.message : String(e)
        };
      }
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    return NextResponse.json({
      success: true,
      cookies: cookieInfo,
      headers: {
        hasAuthorization: !!authHeader,
        authorization: authHeader ? `${authHeader.substring(0, 15)}...` : null
      },
      token: {
        exists: !!adminToken,
        verification: tokenVerification
      },
      environment: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        // Also include these for debugging
        adminUsername: process.env.ADMIN_USERNAME ? 'set' : 'not set',
        adminPassword: process.env.ADMIN_PASSWORD ? 'set' : 'not set'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 