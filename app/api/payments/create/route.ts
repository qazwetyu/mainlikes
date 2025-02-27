import { NextRequest, NextResponse } from 'next/server';
import { createPaymentInvoice } from '@/lib/api/payment';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { amount, description, orderId, customerEmail } = data;
    
    if (!amount || !description || !orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Generate payment URL
    const paymentData = await createPaymentInvoice({
      amount,
      description,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}/status`,
      orderId,
      customerEmail
    });
    
    // Update order with invoice ID
    await adminDb.collection('orders').doc(orderId).update({
      invoiceId: paymentData.invoiceId,
      paymentStatus: 'pending',
      paymentUrl: paymentData.paymentUrl,
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      paymentUrl: paymentData.paymentUrl 
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create payment' 
    }, { status: 500 });
  }
} 