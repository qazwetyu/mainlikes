import { NextRequest, NextResponse } from 'next/server';

// Reuse the same mock data
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
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    amount: 10000,
    serviceType: 'followers',
    username: 'user2',
    price: 25000
  },
  {
    id: 'order3',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'processing',
    amount: 2000,
    serviceType: 'likes',
    username: 'user3',
    price: 5000
  },
  {
    id: 'order4',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'failed',
    amount: 15000,
    serviceType: 'followers',
    username: 'user4',
    price: 35000
  },
  {
    id: 'order5',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    status: 'completed',
    amount: 3000,
    serviceType: 'likes',
    username: 'user5',
    price: 7500
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the order in our mock data
    const order = mockOrders.find(order => order.id === id);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // In a real implementation, this would update the order in the database
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: {
        id,
        ...updates,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real implementation, this would delete the order from the database
    
    return NextResponse.json({
      success: true,
      message: `Order ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 