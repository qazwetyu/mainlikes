import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { createSMMOrder } from '../../../lib/api/smm';

export const dynamic = 'force-dynamic';

// Updated BYL Webhook payload interface to match actual structure
interface BylWebhookPayload {
  id: number;
  project_id: number;
  type: string; // e.g., "checkout.completed"
  object: string; // e.g., "checkout"
  data: {
    object: {
      id: number;
      url: string;
      mode: string;
      status: string;
      client_reference_id?: string;
      metadata?: {
        [key: string]: any;
      };
      items: any[];
      [key: string]: any;
    };
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
    console.log(`Webhook payload received: ${rawBody.substring(0, 300)}...`);
    
    const payload: BylWebhookPayload = JSON.parse(rawBody);
    console.log(`Webhook type: ${payload.type}`);
    
    // Extract the client reference ID from the correct location in the payload
    // Try multiple locations where it might be stored
    let orderId = null;
    
    // First try the standard location
    if (payload?.data?.object?.client_reference_id) {
      orderId = payload.data.object.client_reference_id;
    } 
    // Try to find it in metadata
    else if (payload?.data?.object?.metadata?.client_reference_id) {
      orderId = payload.data.object.metadata.client_reference_id;
    }
    // Try to find it in the items array
    else if (payload?.data?.object?.items?.[0]?.price?.product_data?.client_reference_id) {
      orderId = payload.data.object.items[0].price.product_data.client_reference_id;
    }
    
    const status = payload?.data?.object?.status;
    
    // Log the entire object structure to help debugging
    console.log('Payload structure:', JSON.stringify({
      id: payload.id,
      type: payload.type,
      dataKeys: Object.keys(payload.data || {}),
      objectKeys: Object.keys(payload.data?.object || {}),
      itemsLength: payload.data?.object?.items?.length
    }));
    
    if (!orderId) {
      console.error('Invalid webhook payload: missing client_reference_id');
      // Try to extract any useful information from the payload for debugging
      const checkoutId = payload?.data?.object?.id;
      console.log(`Checkout ID from payload: ${checkoutId}`);
      console.log(`Raw payload for debugging: ${JSON.stringify(payload)}`);
      
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid payload: missing client_reference_id',
        checkoutId
      }, { status: 400 });
    }
    
    console.log(`Processing webhook for order: ${orderId}, status: ${status}`);
    
    // First, check if the order exists in our database
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    // Handle different webhook types
    if (payload.type === 'checkout.completed' || status === 'complete') {
      try {
        // Variables for SMM handling
        let smmOrderId;
        let serviceId = null;
        let username = null;
        let amount = null;
        
        // Try to extract service details from various places in the payload
        
        // 1. Check in the items array and product metadata
        if (payload.data?.object?.items?.length > 0) {
          const item = payload.data.object.items[0];
          if (item.price?.product_data?.metadata) {
            const metadata = item.price.product_data.metadata;
            serviceId = metadata.serviceId;
            username = metadata.targetUrl || metadata.username;
          }
          amount = item.price?.unit_amount;
        }
        
        // 2. Check directly in the object's metadata
        if (!serviceId && payload.data?.object?.metadata) {
          serviceId = payload.data.object.metadata.serviceId;
          username = payload.data.object.metadata.targetUrl || payload.data.object.metadata.username;
        }
        
        console.log(`Extracted from webhook: serviceId=${serviceId}, username=${username}, amount=${amount}`);
        
        // If order doesn't exist, create it
        if (!orderDoc.exists) {
          console.log(`Order ${orderId} not found in database, creating new order`);
          
          // Create a new order with payment data
          await orderRef.set({
            id: orderId,
            orderId: orderId,
            status: 'pending',
            paymentStatus: 'paid',
            serviceId: serviceId,
            targetUrl: username,
            amount: amount,
            paymentData: {
              checkoutId: payload.data?.object?.id,
              status: status,
              items: payload.data?.object?.items
            },
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
            paymentData: {
              checkoutId: payload.data?.object?.id,
              status: status,
              items: payload.data?.object?.items
            },
            paidAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        // Create a new SMM order if we have enough information
        if (serviceId && username) {
          // Get the quantity from the order data, not the payment amount
          const orderData = orderDoc.exists ? orderDoc.data() : null;
          const orderQuantity = orderData?.quantity || 100; // Default to 100 if not specified
          
          // Check if we should use auto-formatting for Instagram usernames
          // By default, we want to format Instagram usernames (add instagram.com/)
          const formatInstagram = orderData?.formatInstagram !== false; // Default to true unless explicitly set to false
          
          console.log(`Creating SMM order for ${orderId} with serviceId: ${serviceId}, username: ${username}, quantity: ${orderQuantity}, formatInstagram: ${formatInstagram}`);
          
          try {
            // Pass the username, quantity, and format option
            const smmResult = await createSMMOrder(
              serviceId, 
              username, 
              orderQuantity
            );
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
      // Handle other webhook types (not checkout.completed)
      console.log(`Order ${orderId} has status ${status}, webhook type: ${payload.type}`);
      
      try {
        // If order doesn't exist, create it
        if (!orderDoc.exists) {
          await orderRef.set({
            id: orderId,
            orderId: orderId,
            status: 'pending',
            paymentStatus: payload.type === 'checkout.expired' ? 'expired' : 'pending',
            paymentData: {
              checkoutId: payload.data?.object?.id,
              status: status,
              items: payload.data?.object?.items
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } else {
          // Update existing order
          await orderRef.update({
            paymentStatus: payload.type === 'checkout.expired' ? 'expired' : 'pending',
            paymentData: {
              checkoutId: payload.data?.object?.id,
              status: status,
              items: payload.data?.object?.items
            },
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