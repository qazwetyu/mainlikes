// Mock implementation of BYL payment API

interface BylInvoiceParams {
  amount: number;
  orderId: string;
  description: string;
  callbackUrl: string;
}

export async function createBylInvoice(params: BylInvoiceParams) {
  console.log('Creating mock BYL invoice:', params);
  
  const mockInvoiceId = `byl-${Date.now()}`;
  const mockInvoiceUrl = `https://byl.mn/invoice/${mockInvoiceId}`;
  
  return {
    success: true,
    invoiceId: mockInvoiceId,
    invoiceUrl: mockInvoiceUrl
  };
}

export async function checkBylInvoiceStatus(invoiceId: string) {
  console.log('Checking mock BYL invoice status:', invoiceId);
  
  // Generate a random status
  const statuses = ['pending', 'paid', 'expired', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    success: true,
    status: randomStatus,
    invoiceId
  };
} 