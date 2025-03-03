import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, serviceType, username, orderDetails } = await request.json();
    
    // Log the received request data
    console.log('Checkout request received:', { amount, serviceType, username });
    
    // In a real implementation, this would create an order in Firebase
    // and generate a checkout URL with the BYL.mn API
    
    // Create a mock order
    const orderId = `order-${Date.now()}`;
    
    // Generate a mock checkout URL
    const checkoutUrl = `https://byl.mn/checkout/mock-${orderId}?amount=${amount}`;
    
    // Return the mock checkout info
    return NextResponse.json({
      success: true,
      orderId: orderId,
      checkoutUrl: checkoutUrl,
      amount: amount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create checkout',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 