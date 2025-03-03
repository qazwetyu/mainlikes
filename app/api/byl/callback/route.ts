import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createSMMOrder } from '@/lib/api/smm';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log('Received callback payload:', payload);
    
    // In a real implementation, this would:
    // 1. Verify the callback signature
    // 2. Update order status in the database
    // 3. Trigger any necessary notifications
    
    // Mock implementation just logs the request and returns success
    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
      reference: payload.reference || 'unknown'
    });
  } catch (error) {
    console.error('Error processing callback:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process callback',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // For testing purposes, just return a basic success message
  return NextResponse.json({
    success: true,
    message: 'Callback endpoint is active',
    timestamp: new Date().toISOString()
  });
} 