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

// Helper to detect mock order IDs
const isMockOrderId = (orderId: string): boolean => {
  return orderId.startsWith('smm-mock-') || orderId.startsWith('mock-');
};

// Check order status
export async function checkSMMOrder(orderId: string) {
  // If this is a mock order ID, use mock implementation regardless of global setting
  if (isMockOrderId(orderId)) {
    console.log(`Using mock SMM API for mock order ID: ${orderId}`);
    
    // For mock order IDs, always return a mock response
    return {
      status: 'in_progress',
      remains: 500,
      start_count: 0,
      currency: 'USD'
    };
  }
  
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
    
    // Handle error response even if HTTP status is OK
    if (data.error) {
      console.error(`SMM API returned error: ${data.error}`);
      // Return a structured error object instead of throwing
      return { 
        error: data.error,
        status: 'error'
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error checking SMM order status:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
}

// Create a new order
export async function createSMMOrder(
  serviceId: string, 
  link: string, 
  quantity: number
) {
  // Format the link properly for Instagram services
  let formattedLink = link;
  
  // Check if this is an Instagram service and handle username formatting
  // For followers we need instagram.com/username format
  if (serviceId === '1479' || serviceId.includes('instagram') || serviceId.includes('follow')) {
    // Only add instagram.com prefix if it's not already there
    if (!formattedLink.includes('instagram.com/') && !formattedLink.includes('instagr.am/')) {
      // Remove @ if present
      if (formattedLink.startsWith('@')) {
        formattedLink = formattedLink.substring(1);
      }
      // Add the proper Instagram URL format
      formattedLink = `https://instagram.com/${formattedLink}`;
    }
  }
  // For likes, we need the post URL format
  else if (serviceId === '951' || serviceId.includes('like')) {
    // Check if it's a post URL or just a username
    if (!formattedLink.includes('instagram.com/p/') && !formattedLink.includes('instagr.am/p/')) {
      // If it's not already a post URL, log a warning
      console.warn(`Warning: Service ID ${serviceId} requires a post URL, but received: ${formattedLink}`);
    }
  }
  
  // Log the original and formatted links for debugging
  console.log(`Formatting link: "${link}" -> "${formattedLink}"`);
  
  if (useMock) {
    console.log(`Using mock SMM API for order creation: service=${serviceId}, link=${formattedLink}, quantity=${quantity}`);
    
    // In development/build, return a mock response with a clearly marked mock ID
    return {
      orderId: `smm-mock-${Date.now()}`,
      status: 'pending'
    };
  }
  
  try {
    console.log(`Making real SMM API order: service=${serviceId}, link=${formattedLink}, quantity=${quantity}`);
    
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
        link: formattedLink,
        quantity: quantity
      })
    });
    
    const data = await response.json();
    
    // Log response for debugging but hide sensitive data
    console.log(`SMM API order create response:`, {
      status: response.status,
      success: response.ok,
      dataReceived: !!data
    });
    
    if (!response.ok) {
      throw new Error(`SMM API error: ${response.status}`);
    }
    
    // Handle error response even if HTTP status is OK
    if (data.error) {
      console.error(`SMM API returned error: ${data.error}`);
      // Use a mock order ID for error cases to prevent further API calls
      return { 
        orderId: `smm-mock-error-${Date.now()}`,
        status: 'error',
        error: data.error
      };
    }
    
    return {
      orderId: data.order,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating SMM order:', error);
    // Return a mock order ID for error cases
  return {
      orderId: `smm-mock-error-${Date.now()}`,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
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
    
    // Handle error response even if HTTP status is OK
    if (data.error) {
      console.error(`SMM API returned error: ${data.error}`);
      // Fall back to mock data for error cases
      return [
        {
          id: '1',
          name: 'Instagram Followers (Fallback)',
          type: 'Default',
          category: 'Instagram',
          rate: '100/$1',
          min: 500,
          max: 10000
        }
      ];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching SMM services:', error);
    // Fall back to mock data for error cases
    return [
      {
        id: '1',
        name: 'Instagram Followers (Fallback)',
        type: 'Default',
        category: 'Instagram',
        rate: '100/$1',
        min: 500,
        max: 10000
      }
    ];
  }
} 