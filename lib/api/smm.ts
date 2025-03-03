import axios from 'axios';

// Types for SMM API
interface SMMOrder {
  service: number;   // Service ID
  link: string;      // Target URL
  quantity: number;  // Number of likes/followers/etc.
}

interface SMMOrderResponse {
  order: number;     // Order ID
}

interface SMMStatusCheck {
  order: number;     // Order ID from previous response
}

interface SMMStatusResponse {
  status: string;    // Status (e.g., "completed", "processing", "pending")
  remains: number;   // Remaining items to be delivered
  start_count?: number; // Starting count (field name might differ between providers)
  charge?: string;    // Amount charged
}

// Define interface for createSMMOrder parameters
interface SMMOrderParams {
  service: string;
  link: string;
  quantity: number;
}

interface SMMResponse {
  order: number;
  status: string;
}

// Mock implementation of SMM API

export async function createSMMOrder(params: SMMOrderParams) {
  console.log('Creating mock SMM order:', params);
  
  const orderId = Math.floor(Math.random() * 1000000).toString();
  
  return {
    success: true,
    order: orderId,
    balance: "5000.000"
  };
}

export async function checkSMMOrder(orderId: string) {
  console.log('Checking mock SMM order status:', orderId);
  
  const statuses = ['Pending', 'In progress', 'Completed', 'Failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    success: true,
    status: randomStatus,
    remains: randomStatus === 'Completed' ? 0 : Math.floor(Math.random() * 100)
  };
}

// Get available services
export async function getSMMServices() {
  try {
    const apiKey = process.env.SMM_API_KEY;
    const endpoint = process.env.SMM_API_URL;
    
    if (!apiKey || !endpoint) {
      throw new Error('SMM API configuration is missing');
    }
    
    const response = await axios.post(endpoint, {
      key: apiKey,
      action: 'services'
    });
    
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch SMM services:', error);
    throw new Error('Failed to fetch SMM services');
  }
} 