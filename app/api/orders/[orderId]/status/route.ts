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

// Helper to detect mock order IDs
const isMockOrderId = (orderId: string): boolean => {
  return orderId?.startsWith('smm-mock-') || orderId?.startsWith('mock-');
};

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
        // If it's a mock order ID, handle it differently
        if (isMockOrderId(orderData.smmOrderId)) {
          console.log(`Using mock status for mock order ID: ${orderData.smmOrderId}`);
          
          // For mock orders, generate a random status based on time
          const statuses = ['pending', 'processing', 'in_progress', 'completed'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          const mockStatus = {
            status: randomStatus,
            remains: Math.floor(Math.random() * 1000),
            start_count: 0,
            currency: 'USD'
          };
          
          // Update the order with mock status
          await orderRef.update({
            status: mockStatus.status,
            updatedAt: new Date().toISOString(),
            smmStatusData: mockStatus
          });
          
          // Return the updated order
          return NextResponse.json({
            success: true,
            order: {
              ...orderData,
              status: mockStatus.status,
              smmStatusData: mockStatus
            }
          });
        }
        
        // For real order IDs, check with the SMM API
        const smmStatus = await checkSMMOrder(orderData.smmOrderId);
        
        // Check if the response contains an error
        if (smmStatus.error || smmStatus.status === 'error') {
          console.warn(`SMM API returned an error for order ${orderData.smmOrderId}:`, smmStatus.error);
          
          // Still update the database with the error info
          await orderRef.update({
            updatedAt: new Date().toISOString(),
            smmStatusData: smmStatus
          });
          
          // Return the data with error info
          return NextResponse.json({
            success: true,
            order: {
              ...orderData,
              smmStatusData: smmStatus
            },
            warning: `SMM API error: ${smmStatus.error}`
          });
        }
        
        // Happy path - update the order with latest status
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
          order: orderData,
          error: smmError instanceof Error ? smmError.message : String(smmError)
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