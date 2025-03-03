import { createSMMOrder } from '../src/lib/api/smm';
import { adminDb } from '../src/lib/firebase-admin';

async function processPendingOrders() {
  console.log('Finding paid orders without SMM order IDs...');
  
  const ordersSnapshot = await adminDb.collection('orders')
    .where('paymentStatus', '==', 'paid')
    .where('smmOrderId', '==', null)
    .get();
  
  console.log(`Found ${ordersSnapshot.size} orders to process`);
  
  for (const doc of ordersSnapshot.docs) {
    const order = doc.data();
    console.log(`Processing order ${doc.id}...`);
    
    try {
      if (!order.serviceDetails) {
        console.log(`Order ${doc.id} has no serviceDetails, skipping`);
        continue;
      }
      
      const smmResult = await createSMMOrder({
        service: order.serviceDetails.serviceId,
        link: order.serviceDetails.targetUrl,
        quantity: order.serviceDetails.quantity
      });
      
      console.log(`SMM order created: ${smmResult.order} for order ${doc.id}`);
      
      // Update order with SMM order ID
      await doc.ref.update({
        smmOrderId: smmResult.order,
        status: 'processing',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Failed to process order ${doc.id}:`, error);
    }
  }
}

processPendingOrders().catch(console.error); 