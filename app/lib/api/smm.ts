/**
 * SMM API integration that uses a mock in build/development 
 * and real implementation in production
 */

import { smmServices } from '../config/smm-services';

// Check if we're running in Vercel production environment
const isVercelProduction = process.env.VERCEL_ENV === 'production';

// Log environment variables for debugging
console.log('SMM API environment:', {
  nodeEnv: process.env.NODE_ENV,
  vercelEnv: process.env.VERCEL_ENV,
  hasApiKey: !!process.env.SMM_API_KEY,
  isProduction: isVercelProduction
});

// Use mock unless we're explicitly in production with API key
const useMock = !isVercelProduction || !process.env.SMM_API_KEY;

// Configuration
export const smmApiConfig = {
  apiKey: process.env.SMM_API_KEY || 'a4aec5771caf44d5de21c1f9a003296a', // Dummy key for development
  apiUrl: process.env.SMM_API_URL || 'https://smmapro.com/api/v2',
};

// Log the API configuration (without showing the full key)
console.log('SMM API Configuration:', {
  apiUrl: smmApiConfig.apiUrl,
  apiKeyPresent: !!smmApiConfig.apiKey,
  apiKeyPrefix: smmApiConfig.apiKey ? smmApiConfig.apiKey.substring(0, 4) + '...' : 'none'
});

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
    console.log(`Making real SMM API status check for order: ${orderId}`);
    
    // Real implementation for production
    // Most SMM APIs use a single endpoint with action parameter
    const response = await fetch(smmApiConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: smmApiConfig.apiKey,
        action: 'status',
        order: orderId
      })
    });
    
    const data = await response.json();
    
    // Log response for debugging but hide sensitive data
    console.log(`SMM API status response for ${orderId}:`, {
      status: response.status,
      success: response.ok,
      dataReceived: !!data
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
    return data;
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
    console.log(`Making real SMM API order: service=${serviceId}, link=${link}, quantity=${quantity}`);
    
    // Real implementation for production
    const response = await fetch(smmApiConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: smmApiConfig.apiKey,
        action: 'add',
        service: serviceId,
        link: link,
        quantity: quantity
      })
    });
    
    const data = await response.json();
    
    // Log response for debugging but hide sensitive data
    console.log(`SMM API order create response:`, {
      status: response.status,
      success: response.ok,
      orderId: data?.order || 'none'
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
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
    console.log('Making real SMM API services request');
    
    // Real implementation for production
    const response = await fetch(smmApiConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: smmApiConfig.apiKey,
        action: 'services'
      })
    });
    
    const data = await response.json();
    
    // Log response for debugging but hide sensitive data
    console.log(`SMM API services response:`, {
      status: response.status,
      success: response.ok,
      servicesCount: data?.length || 0
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching SMM services:', error);
    throw error;
  }
} 