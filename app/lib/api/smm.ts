/**
 * SMM API integration for production use
 */

import { smmServices } from '../config/smm-services';

// Check for required API key
const hasApiKey = !!process.env.SMM_API_KEY;

// Use mocks if API key is missing
const useMock = !hasApiKey;

// Log configuration
console.log('SMM API Configuration:', {
  isUsingMock: useMock,
  apiKeyPresent: !!process.env.SMM_API_KEY,
  apiUrlPresent: !!process.env.SMM_API_URL
});

// Configuration
export const smmApiConfig = {
  apiKey: process.env.SMM_API_KEY || '',
  apiUrl: process.env.SMM_API_URL || 'https://smmapro.com/api/v2',
};

// Check order status
export async function checkSMMOrder(orderId: string) {
  if (useMock) {
    console.log(`Using mock SMM API for order status check: ${orderId}`);
    
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
    
    // Validate API key
    if (!smmApiConfig.apiKey) {
      throw new Error('SMM API key is missing. Please set the SMM_API_KEY environment variable.');
    }
    
    // Real implementation for production
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
    console.log(`Using mock SMM API for order creation: service=${serviceId}, link=${link}, quantity=${quantity}`);
    
    // In development/build, return a mock response
    return {
      orderId: `smm-${Date.now()}`,
      status: 'pending'
    };
  }
  
  try {
    console.log(`Making real SMM API order: service=${serviceId}, link=${link}, quantity=${quantity}`);
    
    // Validate API key
    if (!smmApiConfig.apiKey) {
      throw new Error('SMM API key is missing. Please set the SMM_API_KEY environment variable.');
    }
    
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
    console.log('Using mock SMM API for getting services');
    
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
    
    // Validate API key
    if (!smmApiConfig.apiKey) {
      throw new Error('SMM API key is missing. Please set the SMM_API_KEY environment variable.');
    }
    
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