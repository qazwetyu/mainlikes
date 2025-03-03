import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  // Log all cookies for debugging
  console.log('All cookies:', request.cookies);
  
  try {
    const isAdmin = verifyAdminToken(request);
    
    console.log('Auth verification result:', isAdmin);
    
    return NextResponse.json({ 
      success: true, 
      isAuthenticated: isAdmin,
      cookies: {
        hasAdminToken: !!request.cookies.get('admin_token')
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Auth verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 