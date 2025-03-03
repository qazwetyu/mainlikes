import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the invoice ID from the query parameters
    const url = new URL(request.url);
    const invoiceId = url.searchParams.get('invoiceId');
    
    if (!invoiceId) {
      return NextResponse.json({
        success: false,
        message: 'Invoice ID is required'
      }, { status: 400 });
    }
    
    // Generate a random status
    const statuses = ['pending', 'paid', 'expired', 'failed'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[randomIndex];
    
    // Return a mock status response
    return NextResponse.json({
      success: true,
      invoiceId,
      status,
      checked: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking invoice status:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check invoice status',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 