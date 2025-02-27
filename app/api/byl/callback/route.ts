import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/api/payment';
import { adminDb } from '@/lib/firebase-admin';
import { createSMMOrder } from '@/lib/api/smm';

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
      // Get order details
      console.log(`Fetching order details for ${orderId}`);
      const orderDoc = await adminDb.collection('orders').doc(orderId).get();
      
      if (!orderDoc.exists) {
        console.error(`Order ${orderId} not found but payment verified`);
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
      
      const orderData = orderDoc.data();
      console.log('Order data for paid invoice:', orderData);
      
      // TypeScript safety check - add this line before accessing orderData properties
      if (!orderData) {
        console.error(`Order data is null for order ${orderId}`);
        return NextResponse.json({ success: false, message: 'Order data missing' }, { status: 500 });
      }
      
      // Log successful payment
      console.log(`Payment successful for order ${orderId}, invoice ${invoiceId}`);
      
      // Update order status in Firestore
      console.log('Updating order payment status to paid');
      await adminDb.collection('orders').doc(orderId).update({
        paymentStatus: 'paid',
        paidAt: new Date().toISOString(),
        paymentDetails: { invoiceId, provider: 'byl.mn' }
      });
      
      // If order is for SMM service, create the SMM order automatically
      if (orderData.serviceType === 'smm' && orderData.serviceDetails) {
        try {
          const smmResponse = await createSMMOrder({
            service: orderData.serviceDetails.serviceId,
            link: orderData.serviceDetails.targetUrl,
            quantity: orderData.serviceDetails.quantity
          });
          
          // Update order with SMM order ID
          await adminDb.collection('orders').doc(orderId).update({
            smmOrderId: smmResponse.order,
            status: 'processing',
            updatedAt: new Date().toISOString()
          });
        } catch (smmError) {
          console.error('Failed to create SMM order:', smmError);
          // We still consider payment successful even if SMM order creation fails
        }
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
  } catch (error) {
    console.error('BYL callback error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 