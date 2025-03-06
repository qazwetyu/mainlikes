import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get params
    const orderId = request.nextUrl.searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Missing orderId parameter'
      }, { status: 400 });
    }
    
    // Create a sample BYL webhook payload
    const webhookPayload = {
      id: Math.floor(Math.random() * 100000),
      project_id: 99,
      type: "checkout.completed",
      object: "checkout",
      data: {
        object: {
          id: Math.floor(Math.random() * 100000),
          url: `https://byl.mn/h/checkout/12345/abc123`,
          mode: "payment",
          status: "complete",
          client_reference_id: orderId,
          items: [
            {
              price: {
                unit_amount: 2000,
                product_data: {
                  name: "Instagram Followers",
                  metadata: {
                    serviceId: "1479",
                    targetUrl: "https://instagram.com/example",
                    quantity: 1000
                  }
                }
              },
              quantity: 1
            }
          ]
        }
      }
    };
    
    // Call our own webhook endpoint
    console.log(`Sending test webhook for order: ${orderId}`);
    
    const response = await fetch(
      `${request.nextUrl.origin}/api/payments/webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookPayload)
      }
    );
    
    const webhookResponse = await response.json();
    
    return NextResponse.json({
      success: true,
      orderId,
      webhookPayload,
      webhookResponse,
      status: response.status
    });
  } catch (error) {
    console.error('Error simulating webhook:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 