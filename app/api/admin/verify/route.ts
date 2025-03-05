import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '../../../lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const isValid = await verifyAdminToken(request);
    
    if (isValid) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error verifying token',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 