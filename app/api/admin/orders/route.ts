import { NextRequest, NextResponse } from 'next/server';

// Reuse the same mock data from the orders-bypass endpoint
const mockOrders = [
  {
    id: 'order1',
    createdAt: new Date().toISOString(),
    status: 'pending',
    amount: 5000,
    serviceType: 'likes',
    username: 'user1',
    price: 10000
  },
  {
    id: 'order2',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'completed',
    amount: 10000,
    serviceType: 'followers',
    username: 'user2',
    price: 25000
  },
  {
    id: 'order3',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'processing',
    amount: 2000,
    serviceType: 'likes',
    username: 'user3',
    price: 5000
  },
  {
    id: 'order4',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: 'failed',
    amount: 15000,
    serviceType: 'followers',
    username: 'user4',
    price: 35000
  },
  {
    id: 'order5',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    status: 'completed',
    amount: 3000,
    serviceType: 'likes',
    username: 'user5',
    price: 7500
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      orders: mockOrders
    });
  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // In a real implementation, this would create an order in the database
    // For now, just return success with a mock ID
    
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: 'new-order-' + Date.now(),
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'pending'
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