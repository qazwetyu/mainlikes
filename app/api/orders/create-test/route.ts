import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get order ID from query parameters or generate a new one
    const orderId = request.nextUrl.searchParams.get('orderId') || `order-test-${Date.now()}`;
    const serviceType = request.nextUrl.searchParams.get('serviceType') || 'followers';
    const serviceName = request.nextUrl.searchParams.get('serviceName') || 'Instagram Followers';
    const amount = parseInt(request.nextUrl.searchParams.get('amount') || '2000', 10);
    const targetUrl = request.nextUrl.searchParams.get('targetUrl') || 'https://instagram.com/example';
    
    console.log(`Creating test order: ${orderId}`);
    
    // Create a test order document
    const orderData = {
      id: orderId,
      orderId: orderId, // Duplicate for consistency with some code paths
      status: 'pending',
      serviceType,
      serviceName,
      amount,
      targetUrl,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Write the order to Firestore
    await adminDb.collection('orders').doc(orderId).set(orderData);
    
    // Verify the order was created
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();
    const exists = orderDoc.exists;
    
    return NextResponse.json({
      success: true,
      orderId,
      exists,
      orderData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 