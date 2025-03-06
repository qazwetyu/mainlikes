/**
 * SMM API integration that uses a mock in build/development 
 * and real implementation in production
 */

import { smmServices } from '../config/smm-services';

// Check if we need to use the mock implementation
const useMock = process.env.NODE_ENV === 'development' || 
                process.env.VERCEL_ENV === 'preview' ||
                !process.env.SMM_API_KEY;

// Configuration
export const smmApiConfig = {
  apiKey: process.env.SMM_API_KEY || 'a4aec5771caf44d5de21c1f9a003296a', // Dummy key for development
  apiUrl: process.env.SMM_API_URL || 'https://smmapro.com/api/v2',
};

// Check order status
export async function checkSMMOrder(orderId: string) {
  if (useMock) {
    console.log(`SMM API: Checking order status for ${orderId}`);
    
    // In development/build, return a mock response
    return {
      status: 'in_progress',
      remains: 500,
      start_count: 0,
      currency: 'USD'
    };
  }
  
  try {
    // Real implementation for production
    const response = await fetch(`${smmApiConfig.apiUrl}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: smmApiConfig.apiKey,
        order: orderId
      })
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking SMM order status:', error);
    throw error;
  }
}

// Create a new order
export async function createSMMOrder(
  serviceId: string, 
  link: string, 
  quantity: number
) {
  if (useMock) {
    console.log(`SMM API: Creating order with service=${serviceId}, link=${link}, quantity=${quantity}`);
    
    // In development/build, return a mock response
    return {
      orderId: `smm-${Date.now()}`,
      status: 'pending'
    };
  }
  
  try {
    // Real implementation for production
    const response = await fetch(`${smmApiConfig.apiUrl}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: smmApiConfig.apiKey,
        service: serviceId,
        link: link,
        quantity: quantity
      })
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      orderId: data.order,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating SMM order:', error);
    throw error;
  }
}

// Get list of available services
export async function getSMMServices() {
  if (useMock) {
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
  
  try {
    // Real implementation for production
    const response = await fetch(`${smmApiConfig.apiUrl}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: smmApiConfig.apiKey
      })
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching SMM services:', error);
    throw error;
  }
} 