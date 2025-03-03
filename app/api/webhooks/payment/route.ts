import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // For raw body in App Router:
    const rawBody = await request.text();
    const data = JSON.parse(rawBody);
    
    // Extract invoice ID from payload
    const { invoiceId } = data;
    
    if (!invoiceId) {
      return NextResponse.json({ success: false, message: 'Invoice ID is required' }, { status: 400 });
    }
    
    // Log the webhook received
    console.log('Payment webhook received:', data);
    
    // Process the webhook
    // Add your logic here to update order status, etc.
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 