import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload
    const payload = await request.json();
    
    // Log the payload for debugging
    console.log('BYL webhook received:', payload);
    
    // In a real implementation, this would update payment status in Firebase
    // For now, just return a success response
    
    return NextResponse.json({
      success: true,
      message: 'BYL webhook processed successfully',
      received: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing BYL webhook:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process BYL webhook',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  // Return a simple status page for the webhook endpoint
  return NextResponse.json({
    success: true,
    message: 'BYL webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
} 