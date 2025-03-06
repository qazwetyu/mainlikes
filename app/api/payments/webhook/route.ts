import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { createSMMOrder } from '../../../lib/api/smm';

export const dynamic = 'force-dynamic';

interface BylWebhookPayload {
  data: {
    client_reference_id: string;
    status: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Define the order data interface
interface OrderData {
  id?: string;
  status?: string;
  smmOrderId?: string;
  paymentStatus?: string;
  serviceType?: string;
  serviceDetails?: {
    serviceId: number | string;
    targetUrl: string;
    quantity: number;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    console.log(`Webhook payload received: ${rawBody.substring(0, 200)}...`);
    
    const payload: BylWebhookPayload = JSON.parse(rawBody);
    
    if (!payload?.data?.client_reference_id) {
      console.error('Invalid webhook payload: missing client_reference_id');
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }
    
    const { client_reference_id: orderId, status } = payload.data;
    
    console.log(`Processing webhook for order: ${orderId}, status: ${status}`);
    
    // First, check if the order exists in our database
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (status === 'complete') {
      try {
        // Variables for SMM handling
        let smmOrderId;
        let serviceId = payload.data.serviceId;
        let username = payload.data.username;
        let amount = payload.data.amount;
        
        // If order doesn't exist, create it
        if (!orderDoc.exists) {
          console.log(`Order ${orderId} not found in database, creating new order`);
          
          // Create a new order with payment data
          await orderRef.set({
            id: orderId,
            orderId: orderId,
            status: 'pending',
            paymentStatus: 'paid',
            paymentData: payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } else {
          console.log(`Order ${orderId} found in database, updating payment status`);
          
          // Get existing order data for SMM processing
          const orderData: any = orderDoc.data();
          
          // Use order data if available
          serviceId = serviceId || orderData.serviceId || orderData.serviceDetails?.serviceId;
          username = username || orderData.targetUrl || orderData.username;
          amount = amount || orderData.amount || 1000;
          
          // Update order with payment information
          await orderRef.update({
            paymentStatus: 'paid',
            paymentData: payload,
            paidAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        // Create a new SMM order if we have enough information
        if (serviceId && username) {
          console.log(`Creating SMM order for ${orderId} with serviceId: ${serviceId}, username: ${username}`);
          
          try {
            const smmResult = await createSMMOrder(serviceId, username, amount);
            smmOrderId = smmResult.orderId;
            
            console.log(`SMM order created successfully: ${smmOrderId}`);
            
            // Update order with SMM order ID
            await orderRef.update({
              smmOrderId: smmOrderId,
              status: 'processing',
              updatedAt: new Date().toISOString()
            });
          } catch (smmError) {
            console.error(`Error creating SMM order: ${smmError instanceof Error ? smmError.message : 'Unknown error'}`);
            
            // Still update the order but mark as 'smm-error'
            await orderRef.update({
              status: 'smm-error',
              smmError: smmError instanceof Error ? smmError.message : 'Unknown SMM error',
              updatedAt: new Date().toISOString()
            });
          }
        } else {
          console.warn(`Cannot create SMM order for ${orderId}: missing serviceId or username`);
          
          // Update order status to indicate we need more information
          await orderRef.update({
            status: 'needs-info',
            updatedAt: new Date().toISOString()
          });
        }
        
        return NextResponse.json({ 
          success: true,
          orderId,
          smmOrderId
        });
      } catch (error) {
        console.error(`Error processing webhook for order ${orderId}:`, error);
        return NextResponse.json({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      // Handle other statuses (not complete)
      console.log(`Order ${orderId} has status ${status}, updating in database`);
      
      try {
        // If order doesn't exist, create it
        if (!orderDoc.exists) {
          await orderRef.set({
            id: orderId,
            orderId: orderId,
            status: 'pending',
            paymentStatus: status === 'expired' ? 'expired' : 'pending',
            paymentData: payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } else {
          // Update existing order
          await orderRef.update({
            paymentStatus: status === 'expired' ? 'expired' : 'pending',
            paymentData: payload,
            updatedAt: new Date().toISOString()
          });
        }
        
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error(`Error updating order ${orderId} with status ${status}:`, error);
        return NextResponse.json({ success: false }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}