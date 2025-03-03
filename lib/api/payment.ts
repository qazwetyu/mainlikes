import axios from 'axios';

interface PaymentInvoiceParams {
  amount: number;
  description: string;
  returnUrl: string;
  orderId: string;
  customerEmail?: string;
}

interface PaymentResponse {
  invoiceId: string;
  paymentUrl: string;
  status: string;
}

export async function createPaymentInvoice({
  amount,
  description,
  returnUrl,
  orderId,
  customerEmail
}: PaymentInvoiceParams): Promise<PaymentResponse> {
  try {
    console.log('Creating BYL.mn checkout for:', { amount, orderId, description });
    
    // Check for required config
    if (!process.env.BYL_API_KEY) {
      throw new Error('BYL API key is missing');
    }
    
    // Get project ID from environment variables
    const BYL_PROJECT_ID = process.env.BYL_PROJECT_ID || '99';
    
    // Construct the proper URL for the Checkout API
    const checkoutEndpoint = `https://byl.mn/api/v1/projects/${BYL_PROJECT_ID}/checkouts`;
    
    console.log('Calling BYL Checkout API at:', checkoutEndpoint);
    
    // Set up success and cancel URLs
    // Make sure these are absolute URLs with https://
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://likes.mn';
    const successUrl = `${baseUrl}/payment/success?orderId=${orderId}`;
    const cancelUrl = `${baseUrl}/payment/cancel?orderId=${orderId}`;
    
    // Log the URLs for debugging
    console.log('Using success URL:', successUrl);
    console.log('Using cancel URL:', cancelUrl);
    
    // Call the BYL Checkout API
    const response = await fetch(checkoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: orderId,
        customer_email: customerEmail || undefined,
        items: [
          {
            price_data: {
              unit_amount: amount,
              product_data: {
                name: description,
                client_reference_id: orderId
              }
            },
            quantity: 1
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('BYL Checkout API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`BYL Payment API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('BYL Checkout API response:', JSON.stringify(data, null, 2));
    
    // Extract checkout ID and payment URL
    let checkoutId = null;
    let paymentUrl = null;
    
    if (data.data && data.data.id) {
      checkoutId = data.data.id;
    }
    
    if (data.data && data.data.url) {
      paymentUrl = data.data.url;
    }
    
    if (!checkoutId || !paymentUrl) {
      console.error('Invalid BYL Checkout response structure:', data);
      throw new Error('BYL payment gateway returned an invalid response');
    }
    
    console.log('BYL Checkout created:', { checkoutId, paymentUrl });
    
    return {
      invoiceId: checkoutId.toString(),
      paymentUrl,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating BYL checkout:', error);
    throw error;
  }
}

// Update the verification function to work with checkouts
export async function verifyPayment(checkoutId: string) {
  try {
    console.log(`Verifying BYL checkout: ${checkoutId}`);
    
    const BYL_PROJECT_ID = process.env.BYL_PROJECT_ID || '99';
    const checkoutEndpoint = `https://byl.mn/api/v1/projects/${BYL_PROJECT_ID}/checkouts/${checkoutId}`;
    
    const response = await fetch(checkoutEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`BYL API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('BYL checkout verification response:', data);
    
    // Check if the checkout is complete
    const isComplete = data.data && data.data.status === 'complete';
    const clientReferenceId = data.data?.client_reference_id;
    
    return {
      verified: isComplete,
      orderId: clientReferenceId
    };
  } catch (error) {
    console.error('BYL checkout verification error:', error);
    return { verified: false, orderId: null };
  }
} 