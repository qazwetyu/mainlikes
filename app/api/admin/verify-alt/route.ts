import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    // Debug information - don't include in production
    console.log('Admin token from cookie:', token ? 'exists' : 'missing');
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json({ 
        success: false, 
        message: 'No authentication token found' 
      }, { status: 401 });
    }
    
    try {
      // Try to verify with environment secret
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Token verified successfully with env secret');
      return NextResponse.json({ 
        success: true,
        decoded 
      });
    } catch (envError) {
      console.error('Failed to verify with env secret:', envError);
      
      // Fallback: try with hardcoded secret for testing
      try {
        const decoded = verify(token, 'your-secret-key');
        console.log('Token verified with fallback secret');
        return NextResponse.json({ 
          success: true,
          decoded,
          note: 'Verified with fallback secret'
        });
      } catch (fallbackError) {
        console.error('Failed with fallback secret too:', fallbackError);
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid authentication token',
          envError: envError instanceof Error ? envError.message : 'Unknown error',
          fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Unknown error'
        }, { status: 401 });
      }
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Auth verification failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 