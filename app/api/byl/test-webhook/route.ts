import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createSMMOrder } from '@/lib/api/smm';

export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await request.json();
    
    // Log the payload for debugging
    console.log('Test webhook received:', payload);
    
    // In a real implementation, this would verify and process the webhook data
    // For now, just return a success response
    
    return NextResponse.json({
      success: true,
      message: 'Test webhook received successfully',
      payload
    });
  } catch (error) {
    console.error('Error processing test webhook:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process test webhook',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  // Return a simple status page for the webhook endpoint
  return NextResponse.json({
    success: true,
    message: 'Test webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
} 