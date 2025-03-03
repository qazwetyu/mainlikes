import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Define the webhook payload interface
interface BylWebhookPayload {
  data: {
    client_reference_id: string;
    status: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await request.text();
    console.log('BYL webhook received:', rawBody);
    
    // Parse the webhook payload
    const payload: BylWebhookPayload = JSON.parse(rawBody);
    
    // Basic validation
    if (!payload || !payload.data || !payload.data.client_reference_id) {
      console.error('Invalid webhook payload');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid webhook payload' 
      }, { status: 400 });
    }
    
    // Extract order information
    const { client_reference_id: orderId, status } = payload.data;
    console.log(`Processing payment webhook for order ${orderId}, status: ${status}`);
    
    // Process based on payment status
    if (status === 'complete') {
      // Payment is successful, update order status
      try {
        // Here you would update the order in your database
        // For now, just log that we would update it
        console.log(`Would update order ${orderId} to status 'paid'`);
        
        // Return success
        return NextResponse.json({ 
          success: true, 
          message: 'Payment confirmed', 
          orderId 
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to update order status',
          error: dbError instanceof Error ? dbError.message : String(dbError)
        }, { status: 500 });
      }
    } else if (status === 'expired') {
      // Payment has expired
      console.log(`Order ${orderId} payment has expired`);
      return NextResponse.json({ 
        success: true, 
        message: 'Payment expired', 
        orderId 
      });
    } else {
      // Other statuses
      console.log(`Order ${orderId} payment status: ${status}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Payment status received', 
        orderId, 
        status 
      });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Захиалга баталгаажуулахад алдаа гарлаа',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  // Return a simple response for GET requests to this endpoint
  return NextResponse.json({
    success: true,
    message: 'BYL webhook receiver is active',
    timestamp: new Date().toISOString()
  });
} 