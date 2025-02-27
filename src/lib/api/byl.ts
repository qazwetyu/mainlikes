export interface BylInvoice {
  amount: number;
  orderId: string;
  description: string;
  callbackUrl: string;
}

// Constants for BYL.mn integration
const BYL_API_URL = 'https://byl.mn/api/v1';
const BYL_PROJECT_ID = '99'; // Your project ID
const BYL_MERCHANT_ID = '17301345-d3ac-4fd7-b8f3-de89f9dec677'; // Store this for reference

export async function createBylInvoice(invoice: BylInvoice) {
  try {
    console.log('Creating BYL.mn invoice with data:', JSON.stringify(invoice));
    
    // Using the correct endpoint with your project ID
    const response = await fetch(`${BYL_API_URL}/projects/${BYL_PROJECT_ID}/invoices`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: invoice.amount,
        description: invoice.description || `Order: ${invoice.orderId}`,
        auto_advance: true, // Automatically advance the invoice to "open" status
        client_reference_id: invoice.orderId // Store your order ID for reference
      })
    });
    
    const responseText = await response.text();
    console.log('BYL.mn API response:', responseText);
    
    if (!response.ok) {
      throw new Error(`BYL.mn API returned ${response.status}: ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    return {
      invoiceId: data.data.id,
      invoiceUrl: data.data.url,
      amount: data.data.amount,
      status: data.data.status
    };
  } catch (error) {
    console.error('Detailed BYL.mn error:', error);
    throw new Error('Failed to create byl.mn invoice');
  }
}

export async function verifyBylPayment(invoiceId: string) {
  try {
    console.log(`Verifying BYL payment for invoice ${invoiceId}`);
    
    // Check the invoice status using your project ID
    const response = await fetch(`${BYL_API_URL}/projects/${BYL_PROJECT_ID}/invoices/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log(`BYL verification API response for invoice ${invoiceId}:`, responseText);

    if (!response.ok) {
      throw new Error(`Failed to verify byl.mn payment: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from BYL API: ${responseText}`);
    }
    
    // Check if the invoice is paid
    const isPaid = data.data && data.data.status === 'paid';
    console.log(`Invoice ${invoiceId} payment status: ${data.data?.status}, isPaid: ${isPaid}`);
    
    return {
      verified: isPaid,
      orderId: data.data?.client_reference_id || null,
      invoiceData: data.data
    };
  } catch (error) {
    console.error('Byl.mn verification error:', error);
    throw error;
  }
} 