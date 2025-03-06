import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check for required fields
    if (!body.orderId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required field: orderId'
      }, { status: 400 });
    }
    
    // Get the order reference
    const orderRef = adminDb.collection('orders').doc(body.orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return NextResponse.json({
        success: false,
        message: `Order ${body.orderId} not found`
      }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };
    
    // Only include fields that are provided
    if (body.targetUrl) updateData.targetUrl = body.targetUrl;
    if (body.username) updateData.targetUrl = body.username; // Also use username as targetUrl
    if (body.serviceId) updateData.serviceId = body.serviceId;
    if (body.quantity) updateData.quantity = body.quantity;
    if (body.status) updateData.status = body.status;
    
    // Update the order
    await orderRef.update(updateData);
    
    // Get the updated order
    const updatedOrderDoc = await orderRef.get();
    
    return NextResponse.json({
      success: true,
      message: `Order ${body.orderId} updated successfully`,
      order: updatedOrderDoc.data()
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

export async function POST(request: NextRequest) {
  // Allow POST to work the same as PATCH for flexibility
  return PATCH(request);
} 