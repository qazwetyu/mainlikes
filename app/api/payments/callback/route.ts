import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/api/payment';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { invoiceId } = data;
    
    if (!invoiceId) {
      return NextResponse.json({ success: false, message: 'Invoice ID is required' }, { status: 400 });
    }
    
    // Verify payment with BYL.mn
    const { verified, orderId } = await verifyPayment(invoiceId);
    
    if (verified && orderId) {
      // Update order status in Firestore
      const orderRef = adminDb.collection('orders').doc(orderId);
      await orderRef.update({
        paymentStatus: 'paid',
        paidAt: new Date().toISOString(),
        paymentDetails: { invoiceId, provider: 'byl.mn' }
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 