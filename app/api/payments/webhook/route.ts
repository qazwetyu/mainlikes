import { NextRequest, NextResponse } from 'next/server';
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
        const smmResult = await createSMMOrder({
          service: payload.data.serviceId,
          link: payload.data.username,
          quantity: payload.data.amount
        });

        return NextResponse.json({ 
          success: true,
          smmOrderId: smmResult.order
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