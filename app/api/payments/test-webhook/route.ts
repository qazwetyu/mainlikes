import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get params
    const orderId = request.nextUrl.searchParams.get('orderId');
    const formatInstagram = request.nextUrl.searchParams.get('formatInstagram') === 'true';
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Missing orderId parameter'
      }, { status: 400 });
    }
    
    // Try to get existing order data first
    let targetUrl = request.nextUrl.searchParams.get('targetUrl') || 'https://instagram.com/example';
    let serviceId = request.nextUrl.searchParams.get('serviceId') || '1479';
    let amount = parseInt(request.nextUrl.searchParams.get('amount') || '2000', 10);
    let quantity = parseInt(request.nextUrl.searchParams.get('quantity') || '1000', 10);
    
    try {
      // Get the order if it exists
      const orderDoc = await adminDb.collection('orders').doc(orderId).get();
      
      if (orderDoc.exists) {
        const orderData = orderDoc.data();
        console.log(`Found existing order: ${JSON.stringify(orderData)}`);
        
        // Use order data if available
        targetUrl = targetUrl || orderData.targetUrl || 'https://instagram.com/example';
        serviceId = serviceId || orderData.serviceId || '1479';
        amount = amount || orderData.amount || 2000;
        quantity = quantity || orderData.quantity || 100;
        
        console.log(`Using order data: targetUrl=${targetUrl}, serviceId=${serviceId}, amount=${amount}, quantity=${quantity}, formatInstagram=${formatInstagram}`);
      } else {
        console.log(`Order ${orderId} not found, using default values`);
      }
    } catch (error) {
      console.error(`Error getting order data: ${error instanceof Error ? error.message : String(error)}`);
      // Continue with defaults
    }

    // If formatInstagram is true, don't pre-format the targetUrl as it will be done by the SMM API
    // This way the user can test both formats
    const metadataTargetUrl = targetUrl;
    
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
                unit_amount: amount,
                product_data: {
                  name: "Instagram Followers",
                  metadata: {
                    serviceId: serviceId,
                    targetUrl: metadataTargetUrl,
                    quantity: quantity
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
    console.log(`Sending test webhook for order: ${orderId} with targetUrl: ${targetUrl}`);
    
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
      targetUrl,
      serviceId,
      amount,
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