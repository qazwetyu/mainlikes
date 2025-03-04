import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createSMMOrder } from '@/lib/api/smm';

export const dynamic = 'force-dynamic';

interface BylWebhookPayload {
  data: {
    client_reference_id: string;
    status: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface OrderData {
  serviceDetails: {
    serviceId: string;
    targetUrl?: string;
    quantity: number;
  };
  username: string;
  amount: number;
  status: string;
  paymentStatus: string;
  updatedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload: BylWebhookPayload = JSON.parse(rawBody);
    
    if (!payload?.data?.client_reference_id) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }
    
    const { client_reference_id: orderId, status } = payload.data;
    
    if (status === 'complete') {
      try {
        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();
        const orderData = orderDoc.data();
        
        if (!orderData) {
          throw new Error('Order not found');
        }

        const order = orderData as OrderData;

        if (!order) {
          throw new Error('Order not found');
        }

        // SMM ДЭЭР ЗАХИАЛГА ПСДАГ ҮҮСГЭНЭ
        const smmResult = await createSMMOrder({
          service: order.serviceDetails.serviceId,
          link: order.username,
          quantity: order.amount
        });

        // ҮҮСГЭСЭН ЗАХИАЛГЫГ БАТАЛГААЖУУЛЖ ШААНА
        await orderRef.update({
          status: 'processing',
          smmOrderId: smmResult.order,
          paymentStatus: 'paid',
          updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json({ success: false }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}