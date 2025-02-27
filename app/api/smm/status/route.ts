import { NextRequest, NextResponse } from 'next/server';
import { checkSMMOrderStatus } from '@/lib/api/smm';
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
    const { smmOrderId, orderId } = data;
    
    if (!smmOrderId || !orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check SMM order status
    const statusResponse = await checkSMMOrderStatus({ order: smmOrderId });
    
    // Update order status in database
    let orderStatus = 'processing';
    if (statusResponse.status === 'completed') {
      orderStatus = 'completed';
    } else if (statusResponse.status === 'canceled' || statusResponse.status === 'failed') {
      orderStatus = 'failed';
    }
    
    await adminDb.collection('orders').doc(orderId).update({
      smmStatus: statusResponse.status,
      smmDetails: statusResponse,
      status: orderStatus,
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      status: statusResponse
    });
  } catch (error) {
    console.error('SMM status check error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to check SMM order status' 
    }, { status: 500 });
  }
} 