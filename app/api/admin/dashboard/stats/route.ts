import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/app/utils/mockData';

export async function GET(request: NextRequest) {
  try {
    // Calculate mock statistics
    const totalOrders = mockOrders.length;
    const completedOrders = mockOrders.filter(order => order.status === 'completed').length;
    const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
    const processingOrders = mockOrders.filter(order => order.status === 'processing').length;
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.price, 0);
    
    // Return dashboard statistics
    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        processingOrders,
        totalRevenue,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating dashboard stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate dashboard statistics',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 