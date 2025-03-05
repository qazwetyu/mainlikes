import { NextRequest, NextResponse } from 'next/server';

// Simplified mock data for the build process
const mockOrders = [
  {
    id: 'order-1',
    service: 'Instagram Followers',
    link: 'https://instagram.com/user123',
    username: 'user123',
    quantity: 1000,
    price: 29.99,
    status: 'completed',
    createdAt: '2023-08-15T09:30:00Z',
    updatedAt: '2023-08-15T10:30:00Z'
  },
  {
    id: 'order-2',
    service: 'TikTok Likes',
    link: 'https://tiktok.com/@user456/video/123',
    username: 'user456',
    quantity: 2000,
    price: 19.99,
    status: 'processing',
    createdAt: '2023-08-16T14:20:00Z',
    updatedAt: '2023-08-16T14:25:00Z'
  }
];

interface OrderData {
  [key: string]: any;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    
    // Find the order in our mock data
    const order = mockOrders.find(order => order.id === orderId);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: `Order ${orderId} not found`
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
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const orderData: OrderData = await request.json();
    
    // In a real implementation, this would update the order in the database
    console.log(`Would update order ${orderId} with:`, orderData);
    
    return NextResponse.json({
      success: true,
      message: `Order ${orderId} updated successfully`,
      order: {
        id: orderId,
        ...orderData,
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
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    
    // In a real implementation, this would delete the order from the database
    console.log(`Would delete order ${orderId}`);
    
    return NextResponse.json({
      success: true,
      message: `Order ${orderId} deleted successfully`
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