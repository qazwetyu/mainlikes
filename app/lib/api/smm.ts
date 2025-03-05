/**
 * Mock SMM API integration for builds and development
 */

// Configuration
export const smmApiConfig = {
  apiKey: process.env.SMM_API_KEY || 'a4aec5771caf44d5de21c1f9a003296a', // Dummy key for development
  apiUrl: process.env.SMM_API_URL || 'https://smmapro.com/api/v2',
};

// Check order status
export async function checkSMMOrder(orderId: string) {
  console.log(`SMM API: Checking order status for ${orderId}`);
  
  // In development/build, return a mock response
  return {
    status: 'in_progress',
    remains: 500,
    start_count: 0,
    currency: 'USD'
  };
}

// Create a new order
export async function createSMMOrder(
  serviceId: string, 
  link: string, 
  quantity: number
) {
  console.log(`SMM API: Creating order with service=${serviceId}, link=${link}, quantity=${quantity}`);
  
  // In development/build, return a mock response
  return {
    orderId: `smm-${Date.now()}`,
    status: 'pending'
  };
}

// Get list of available services
export async function getSMMServices() {
  console.log('SMM API: Fetching available services');
  
  // In development/build, return a mock response
  return [
    {
      id: '1',
      name: 'Instagram Followers',
      type: 'Default',
      category: 'Instagram',
      rate: '100/$1',
      min: 100,
      max: 10000
    },
    {
      id: '2',
      name: 'TikTok Likes',
      type: 'Default',
      category: 'TikTok',
      rate: '200/$1',
      min: 50,
      max: 5000
    }
  ];
} 