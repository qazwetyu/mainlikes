import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { createSMMOrder } from '../../../lib/api/smm';

export const dynamic = 'force-dynamic';

interface BylWebhookPayload {
  data: {
    client_reference_id: string;
    status: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Define the order data interface
interface OrderData {
  id?: string;
  status?: string;
  smmOrderId?: string;
  paymentStatus?: string;
  serviceType?: string;
  serviceDetails?: {
    serviceId: number | string;
    targetUrl: string;
    quantity: number;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
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
        // Шууд webhook сдагаас шинэ захиалга үүсгэнэ
        const smmResult = await createSMMOrder(
          payload.data.serviceId,
          payload.data.username,
          payload.data.amount
        );

        // Save order details to Firebase
        const orderRef = adminDb.collection('orders').doc(orderId);
        await orderRef.set({
          orderId: orderId,
          paymentData: payload,
          smmOrderId: smmResult.orderId,
          status: 'processing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return NextResponse.json({ 
          success: true,
          smmOrderId: smmResult.orderId
        });
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