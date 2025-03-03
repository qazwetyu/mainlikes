import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { adminDb } from '@/src/lib/firebase-admin';
import { createBylInvoice } from '@/src/lib/api/byl';
import { checkSMMOrder } from '@/src/lib/api/smm';
import { v4 as uuidv4 } from 'uuid';

// Function to generate unique IDs
function generateId() {
  return uuidv4();
  // Alternative: return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Generate a mock order ID
    const orderId = `order-${Date.now()}`;
    
    // Log the order data
    console.log('Creating new order:', orderData);
    
    // Return a success response with a mock order
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderId,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Add status check when fetching orders
export async function GET() {
  // This would normally list orders, but for our static version,
  // just return a message that this endpoint is working
  return NextResponse.json({
    success: true,
    message: 'Orders API endpoint is working',
    timestamp: new Date().toISOString()
  });
} 