import { NextRequest, NextResponse } from 'next/server';

// Simplified mock data for the build process
const mockOrders = [
  {
    id: 'order-1',
    service: 'Instagram Followers',
    status: 'completed',
  },
  {
    id: 'order-2',
    service: 'TikTok Likes',
    status: 'processing',
  },
  {
    id: 'order-3',
    service: 'YouTube Views',
    status: 'pending',
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would:
    // 1. Query orders with status 'processing' from the database
    // 2. Check the status of each order with the SMM API
    // 3. Update orders that are complete

    // For the mock implementation, just log what we would do
    console.log('Running mock order status check cron job');
    
    // Log how many orders would be checked
    const processingOrders = mockOrders.filter((order) => order.status === 'processing');
    console.log(`Would check ${processingOrders.length} processing orders`);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      checked: processingOrders.length,
      updated: 0 // In a real implementation, this would be the count of updated orders
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({
      success: false,
      message: 'Error executing cron job',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 