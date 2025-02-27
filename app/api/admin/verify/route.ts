import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const isValid = verifyAdminToken(request);
    
    if (isValid) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Auth verification failed' 
    }, { status: 500 });
  }
} 