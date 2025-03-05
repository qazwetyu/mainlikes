/**
 * Mock payment gateway integration for builds and development
 */

// Constants
export const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL || 'https://byl.mn/api/v1';
export const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY || 'test_api_key';

/**
 * Verify a payment invoice
 */
export async function verifyPayment(invoiceId: string) {
  console.log(`Payment API: Verifying payment for invoice ${invoiceId}`);
  
  // For development/build, return a mock verification
  return {
    verified: true,
    orderId: `order-${Math.floor(Math.random() * 1000)}`,
    amount: 999,
    currency: 'MNT',
    status: 'PAID',
    paidAt: new Date().toISOString()
  };
}

/**
 * Create a payment invoice
 */
export async function createPaymentInvoice(amount: number, orderId: string, description: string) {
  console.log(`Payment API: Creating invoice for order ${orderId} with amount ${amount}`);
  
  // For development/build, return a mock invoice
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

/**
 * Check payment status
 */
export async function checkPaymentStatus(invoiceId: string) {
  console.log(`Payment API: Checking status for invoice ${invoiceId}`);
  
  // For development/build, return a mock status
  return {
    status: 'PAID',
    paidAt: new Date().toISOString(),
    amount: 999,
    currency: 'MNT'
  };
} 