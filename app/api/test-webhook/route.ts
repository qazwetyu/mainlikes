import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('TEST WEBHOOK RECEIVED');
  try {
    const body = await request.text();
    console.log('Test webhook body:', body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json({ success: false });
  }
} 