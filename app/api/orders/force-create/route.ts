import { NextRequest, NextResponse } from 'next/server';
import { createSMMOrder } from '../../../lib/api/smm';

export async function GET(request: NextRequest) {
  try {
    // Get order ID and service from query parameters
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    const service = url.searchParams.get('service') || '1479'; // Default to Instagram Followers
    const link = url.searchParams.get('link') || 'https://instagram.com/default_user';
    const quantity = parseInt(url.searchParams.get('quantity') || '100');
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Missing order ID parameter'
      }, { status: 400 });
    }
    
    // Create the order in the SMM system
    const result = await createSMMOrder({
      service,
      link,
      quantity
    });
    
    // For debugging
    console.log(`Manually created SMM order for ${orderId}:`, result);
    
    return NextResponse.json({
      success: true,
      message: 'SMM order created successfully',
      orderId,
      smmOrderId: result.orderId
    });
  } catch (error) {
    console.error('Error creating SMM order:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create SMM order',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 