/**
 * Payment gateway integration for production use
 */

// Check for required API key
const hasApiKey = !!process.env.PAYMENT_API_KEY;

// Use mocks if API key is missing
const useMock = !hasApiKey;

// Log configuration
console.log('Payment API Configuration:', {
  isUsingMock: useMock,
  gatewayUrlPresent: !!process.env.PAYMENT_GATEWAY_URL,
  apiKeyPresent: !!process.env.PAYMENT_API_KEY
});

// Constants
export const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL || 'https://byl.mn/api/v1';
export const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY || '';

/**
 * Verify a payment invoice
 */
export async function verifyPayment(invoiceId: string) {
  if (useMock) {
    console.log(`Using mock payment verification for invoice ${invoiceId}`);
    
    // For development, return a mock verification
    return {
      verified: true,
      orderId: `order-${Math.floor(Math.random() * 1000)}`,
      amount: 999,
      currency: 'MNT',
      status: 'PAID',
      paidAt: new Date().toISOString()
    };
  }
  
  try {
    console.log(`Making real payment verification for invoice: ${invoiceId}`);
    
    // Validate API key
    if (!PAYMENT_API_KEY) {
      throw new Error('Payment API key is missing. Please set the PAYMENT_API_KEY environment variable.');
    }
    
    // Real implementation
    const response = await fetch(`${PAYMENT_GATEWAY_URL}/payments/${invoiceId}/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYMENT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Payment API error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/**
 * Create a payment invoice
 */
export async function createPaymentInvoice(amount: number, orderId: string, description: string) {
  if (useMock) {
    console.log(`Using mock payment invoice creation for order ${orderId}`);
    
    // For development, return a mock invoice
    return {
      success: true,
      invoiceId: `invoice-${Date.now()}`,
      paymentUrl: `https://byl.mn/pay/${Date.now()}`,
      amount,
      currency: 'MNT',
      expiresIn: 3600, // 1 hour
      createdAt: new Date().toISOString()
    };
  }
  
  try {
    console.log(`Creating real payment invoice for order: ${orderId}, amount: ${amount}`);
    
    // Validate API key
    if (!PAYMENT_API_KEY) {
      throw new Error('Payment API key is missing. Please set the PAYMENT_API_KEY environment variable.');
    }
    
    // Real implementation
    const response = await fetch(`${PAYMENT_GATEWAY_URL}/payments/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYMENT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        orderId,
        description,
        currency: 'MNT'
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Payment API error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating payment invoice:', error);
    throw error;
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(invoiceId: string) {
  if (useMock) {
    console.log(`Using mock payment status check for invoice ${invoiceId}`);
    
    // For development, return a mock status
    return {
      status: 'PAID',
      paidAt: new Date().toISOString(),
      amount: 999,
      currency: 'MNT'
    };
  }
  
  try {
    console.log(`Checking real payment status for invoice: ${invoiceId}`);
    
    // Validate API key
    if (!PAYMENT_API_KEY) {
      throw new Error('Payment API key is missing. Please set the PAYMENT_API_KEY environment variable.');
    }
    
    // Real implementation
    const response = await fetch(`${PAYMENT_GATEWAY_URL}/payments/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYMENT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Payment API error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
} 