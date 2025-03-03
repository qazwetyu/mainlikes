import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    
    // Remove the admin token cookie
    cookieStore.delete('admin_token');
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error logging out',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 