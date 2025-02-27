import { NextRequest, NextResponse } from 'next/server';
import { createSMMOrder } from '@/lib/api/smm';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin is making this request
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { service, link, quantity, orderId } = data;
    
    if (!service || !link || !quantity || !orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Create SMM order
    const smmResponse = await createSMMOrder({ service, link, quantity });
    
    // Update order with SMM order ID
    await adminDb.collection('orders').doc(orderId).update({
      smmOrderId: smmResponse.order,
      status: 'processing',
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      orderId: smmResponse.order
    });
  } catch (error) {
    console.error('SMM order creation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create SMM order' 
    }, { status: 500 });
  }
} 