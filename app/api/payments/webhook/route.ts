import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createSMMOrder } from '@/lib/api/smm';

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

// Define the order data interface
interface OrderData {
  id?: string;
  status?: string;
  smmOrderId?: string;
  paymentStatus?: string;
  serviceType?: string;
  serviceDetails?: {
    serviceId: number | string;
    targetUrl: string;
    quantity: number;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    // Log the raw request for debugging
    const rawBody = await request.text();
    console.log('Webhook raw payload:', rawBody);
    
    // Parse the request body
    const payload = JSON.parse(rawBody);
    console.log('Payment webhook received:', payload);
    
    // Extract order ID from the payload
    const orderId = payload.data?.client_reference_id || payload.order_id || payload.reference;
    
    if (!orderId) {
      console.error('No order ID found in webhook payload');
      return NextResponse.json({ 
        success: false, 
        message: 'Missing order ID in webhook' 
      }, { status: 400 });
    }
    
    console.log(`Processing webhook for order: ${orderId}`);
    
    // Save order to Firebase
    const orderRef = adminDb.collection('orders').doc(orderId);
    
    // First, check if the order already exists
    const orderDoc = await orderRef.get();
    if (orderDoc.exists) {
      console.log(`Order ${orderId} already exists in database`);
      return NextResponse.json({ 
        success: true,
        message: 'Order already processed',
        orderId: orderId
      });
    }
    
    // Process order with SMM provider
    const smmOrderResult = await createSMMOrder({
      service: payload.service_id || '1479', // Instagram Followers service ID
      link: payload.target_link || 'https://instagram.com/default_user',
      quantity: payload.quantity || 100
    });
    
    // Save order details to Firebase
    await orderRef.set({
      orderId: orderId,
      paymentData: payload,
      smmOrderId: smmOrderResult.orderId,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('Created SMM order and saved to database:', smmOrderResult);
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully',
      orderId: orderId,
      smmOrderId: smmOrderResult.orderId
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
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