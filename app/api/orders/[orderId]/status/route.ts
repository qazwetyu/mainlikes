import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import { checkSMMOrder } from '../../../../lib/api/smm';

// Define the order data interface
interface OrderData {
  id?: string;
  status?: string;
  smmOrderId?: string;
  paymentStatus?: string;
  serviceType?: string;
  serviceDetails?: any;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow for any other properties
}

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    
    console.log(`Checking status for order: ${orderId}`);
    
    // Check if order exists in Firebase
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      console.log(`Order ${orderId} not found in database`);
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }
    
    const orderData = orderDoc.data() as OrderData;
    console.log(`Found order data:`, orderData);
    
    // If we have an SMM order ID, check the status
    if (orderData?.smmOrderId) {
      try {
        const smmStatus = await checkSMMOrder(orderData.smmOrderId);
        
        // Update the order with latest status
        await orderRef.update({
          status: smmStatus.status,
          updatedAt: new Date().toISOString(),
          smmStatusData: smmStatus
        });
        
        // Return the full order with status info
        return NextResponse.json({
          success: true,
          order: {
            ...orderData,
            status: smmStatus.status,
            smmStatusData: smmStatus
          }
        });
      } catch (smmError) {
        console.error('Error checking SMM status:', smmError);
        // Return existing order data if SMM API fails
        return NextResponse.json({
          success: true,
          order: orderData
        });
      }
    }
    
    // Return the order data if no SMM order ID
    return NextResponse.json({
      success: true,
      order: orderData
    });
  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json({
      success: false,
      message: 'Error checking order status',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 