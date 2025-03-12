import { adminDb } from '@/lib/firebase-admin';

export async function createCheckout(data: {
  amount: number;
  description: string;
  orderId: string;
  customerEmail?: string;
  targetLink: string;
  serviceId?: string;
  quantity?: number;
}) {
  try {
    // Check if BYL API credentials are set
    const projectIdExists = !!process.env.BYL_PROJECT_ID;
    const tokenExists = !!process.env.BYL_API_KEY;
    
    console.log('BYL credentials check:', { projectIdExists, tokenExists });
    
    // Create metadata object that will be stored with the order
    const orderMetadata = {
      targetLink: data.targetLink || 'https://instagram.com/default_user',
      serviceId: data.serviceId || '1435',
      quantity: data.quantity || 100
    };
    
    // Store the metadata in Firebase first
    await adminDb.collection('orders').doc(data.orderId).set({
      orderId: data.orderId,
      status: 'pending',
      targetLink: orderMetadata.targetLink,
      serviceId: orderMetadata.serviceId,
      quantity: orderMetadata.quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Create BYL.mn checkout
    const response = await fetch('https://byl.mn/api/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`
      },
      body: JSON.stringify({
        amount: data.amount,
        description: data.description,
        client_reference_id: data.orderId,
        customer_email: data.customerEmail,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${data.orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?orderId=${data.orderId}`,
        items: [
          {
            name: data.description,
            price: data.amount,
            quantity: 1,
            metadata: orderMetadata
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`BYL API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
} 