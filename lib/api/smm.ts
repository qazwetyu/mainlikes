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

const API_URL = process.env.SMM_API_URL || 'https://smmapro.com/api/v2';
const API_KEY = process.env.SMM_API_KEY;

export interface SMMOrderStatus {
  status: 'pending' | 'processing' | 'completed' | 'canceled' | 'failed';
  remains?: number;
  start_count?: number;
  current_count?: number;
  charge?: number;
  currency?: string;
}

export async function checkSMMOrder(orderId: string): Promise<SMMOrderStatus> {
  // In a real implementation, you would call the SMM provider's API
  // For example:
  // const response = await fetch(`${SMM_API_URL}/status`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${SMM_API_KEY}`
  //   },
  //   body: JSON.stringify({ order: orderId })
  // });
  // return await response.json();
  
  // For now, return mock data based on order ID
  console.log(`Checking SMM order status for order: ${orderId}`);
  
  // Simulate random status based on order ID last digit
  const lastDigit = parseInt(orderId.slice(-1)) || 0;
  
  if (lastDigit < 3) {
    return {
      status: 'pending',
      charge: 0,
    };
  } else if (lastDigit < 6) {
    return {
      status: 'processing',
      start_count: 0,
      current_count: Math.floor(Math.random() * 500),
      remains: Math.floor(Math.random() * 500),
      charge: Math.random() * 10,
      currency: 'USD'
    };
  } else if (lastDigit < 9) {
    return {
      status: 'completed',
      start_count: 0,
      current_count: 1000,
      remains: 0,
      charge: Math.random() * 20,
      currency: 'USD'
    };
  } else {
    return {
      status: 'failed',
      charge: 0,
    };
  }
}

export async function createSMMOrder(params: {
  service: string;
  link: string;
  quantity: number;
}): Promise<{ orderId: string }> {
  // In a real implementation, you would call the SMM provider's API
  // For now, return a mock order ID
  const orderId = `SMM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  console.log(`Created SMM order: ${orderId} for service: ${params.service}, link: ${params.link}, quantity: ${params.quantity}`);
  
  return { orderId };
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