import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Create a test order document
    const testOrderId = `test-order-${Date.now()}`;
    
    console.log(`Creating test order: ${testOrderId}`);
    
    // This will automatically create the "orders" collection if it doesn't exist
    await adminDb.collection('orders').doc(testOrderId).set({
      orderId: testOrderId,
      status: 'test',
      targetLink: 'https://instagram.com/test_user',
      serviceId: '1479',
      quantity: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTest: true
    });
    
    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      orderId: testOrderId,
      instructions: 'Check your Firestore console to see if the order was created'
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating test order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 