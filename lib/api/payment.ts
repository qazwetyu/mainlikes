// import axios from 'axios';

interface PaymentRequest {
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

export async function createPaymentInvoice(data: PaymentRequest): Promise<PaymentResponse> {
  try {
    if (!process.env.BYL_API_URL) {
      throw new Error('BYL_API_URL is not defined');
    }
    
    const response = await fetch(process.env.BYL_API_URL, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          currency: 'MNT',
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`
        })
      }
    );
    
    return response.json();
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw new Error('Payment creation failed');
  }
}

export async function verifyPayment(invoiceId: string) {
  try {
    console.log(`Verifying payment for invoice ${invoiceId}`);
    
    const BYL_API_URL = 'https://byl.mn/api/v1';
    const BYL_PROJECT_ID = '99'; // Your project ID
    
    const response = await fetch(`${BYL_API_URL}/projects/${BYL_PROJECT_ID}/invoices/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    // Check if the invoice is paid
    const isPaid = data.data && data.data.status === 'paid';
    
    return {
      verified: isPaid,
      orderId: data.data?.client_reference_id || null
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false, orderId: null };
  }
} 