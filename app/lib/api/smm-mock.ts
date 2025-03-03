// Mock implementation of the SMM API integration

interface SMMOrderParams {
  service: string;
  link: string;
  quantity: number;
}

export async function createSMMMockOrder(params: SMMOrderParams) {
  // Log the order parameters
  console.log('Creating mock SMM order:', params);
  
  // Generate a random order ID
  const orderId = Math.floor(Math.random() * 1000000).toString();
  
  // Return a mock response that mimics the real API
  return {
    success: true,
    order: orderId,
    balance: "5000.000"
  };
}

export async function checkSMMMockStatus(orderId: string) {
  // Generate a random status
  const statuses = ['pending', 'processing', 'completed', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Return a mock status response
  return {
    success: true,
    status: randomStatus,
    remains: randomStatus === 'completed' ? 0 : Math.floor(Math.random() * 100)
  };
} 