import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { adminDb } from '@/src/lib/firebase-admin';
import { createBylInvoice } from '@/src/lib/api/byl';
import { checkSMMOrder } from '@/src/lib/api/smm';
import { v4 as uuidv4 } from 'uuid';

// Function to generate unique IDs
function generateId() {
  return uuidv4();
  // Alternative: return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received order data:', data);
    
    // Extract amount from package.price
    const amount = data.package?.price;
    
    // Check if amount is present
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Package price is required and must be a number' }, 
        { status: 400 }
      );
    }
    
    // Create the order in Firestore
    const orderId = generateId();
    const orderRef = adminDb.collection('orders').doc(orderId);
    
    await orderRef.set({
      ...data,
      id: orderId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    
    // Make sure to pass amount as a number
    const bylResponse = await createBylInvoice({
      amount: Number(amount),
      orderId: orderId,
      description: `${data.service} - ${data.package?.amount || ''} for ${data.username}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/byl/callback`
    });
    
    // Update the order with payment info
    await orderRef.update({
      bylPaymentUrl: bylResponse.invoiceUrl,
      bylInvoiceId: bylResponse.invoiceId,
      paymentStatus: 'pending',
      updatedAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      orderId,
      paymentUrl: bylResponse.invoiceUrl
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 });
  }
}

// Add status check when fetching orders
export async function GET(req: Request) {
  try {
    // Check status of processing orders on each request
    const processingOrders = await adminDb.collection('orders')
      .where('status', '==', 'processing')
      .get();

    // Update order statuses
    const updates = processingOrders.docs.map(async (doc) => {
      const order = doc.data();
      if (!order.smmOrderId) return;

      try {
        const smmStatus = await checkSMMOrder(order.smmOrderId);
        
        if (smmStatus.status === 'Completed' || smmStatus.status === 'Failed') {
          await doc.ref.update({
            status: smmStatus.status.toLowerCase(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Failed to check order ${doc.id}:`, error);
      }
    });

    await Promise.all(updates);

    // Return orders as normal
    return NextResponse.json({
      success: true,
      orders: processingOrders.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 