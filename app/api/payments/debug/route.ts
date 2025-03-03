import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    paymentGateway: {
      hasApiUrl: !!process.env.PAYMENT_GATEWAY_API_URL,
      hasApiKey: !!process.env.PAYMENT_GATEWAY_API_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    }
  });
} 