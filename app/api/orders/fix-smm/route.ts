import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    const serviceId = url.searchParams.get('serviceId');
    const targetUrl = url.searchParams.get('targetUrl');
    const quantity = url.searchParams.get('quantity');
    
    if (!orderId || !serviceId || !targetUrl || !quantity) {
      return NextResponse.json({
        success: false,
        message: 'Missing required parameters'
      }, { status: 400 });
    }
    
    // Update the order with SMM details
    await adminDb.collection('orders').doc(orderId).update({
      serviceType: 'smm',
      serviceDetails: {
        serviceId: serviceId,
        targetUrl: targetUrl,
        quantity: parseInt(quantity),
        name: 'Instagram Followers' // Or whatever service name applies
      },
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: `Order ${orderId} updated with SMM details`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error updating order',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 