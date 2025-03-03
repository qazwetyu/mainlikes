import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await request.json();
    
    // Log the payload for debugging
    console.log('SMM webhook received:', payload);
    
    // In a real implementation, this would update order status based on the webhook
    // For now, just return a success response
    
    return NextResponse.json({
      success: true,
      message: 'SMM webhook processed successfully',
      received: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing SMM webhook:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process SMM webhook',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  // Return a simple status page for the webhook endpoint
  return NextResponse.json({
    success: true,
    message: 'SMM webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
} 