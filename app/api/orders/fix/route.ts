import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { createSMMOrder } from '../../../lib/api/smm';

export async function GET(request: NextRequest) {
  try {
    // Get parameters from URL
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    const serviceId = url.searchParams.get('serviceId') || '1479';
    const targetLink = url.searchParams.get('targetLink') || 'https://instagram.com/default_user';
    const quantity = parseInt(url.searchParams.get('quantity') || '100');
    
    console.log(`Manually fixing order ${orderId} with service=${serviceId}, link=${targetLink}, quantity=${quantity}`);
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Missing orderId parameter'
      }, { status: 400 });
    }
    
    // Check if order exists
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    // If order already has an SMM ID, don't create a new one
    if (orderDoc.exists && orderDoc.data()?.smmOrderId) {
      return NextResponse.json({
        success: true,
        message: 'Order already has an SMM ID',
        orderId: orderId,
        smmOrderId: orderDoc.data()?.smmOrderId
      });
    }
    
    // Create SMM order
    const smmOrderResult = await createSMMOrder(
      serviceId,
      targetLink,
      quantity
    );
    
    console.log('SMM API response:', smmOrderResult);
    
    // Save or update the order in Firebase
    await orderRef.set({
      orderId: orderId,
      smmOrderId: smmOrderResult.orderId,
      status: 'processing',
      serviceId: serviceId,
      targetLink: targetLink,
      quantity: quantity,
      manuallyFixed: true,
      createdAt: orderDoc.exists ? orderDoc.data()?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return NextResponse.json({
      success: true,
      message: 'Order fixed successfully',
      orderId: orderId,
      smmOrderId: smmOrderResult.orderId
    });
  } catch (error) {
    console.error('Error fixing order:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fixing order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 