// Remove any axios import at the top of the file
// import axios from 'axios'; <- Remove this line

// Types for SMM Raja API
interface SMMOrder {
  service: number;   // Service ID
  link: string;      // Target URL
  quantity: number;  // Number of likes/followers/etc.
}

interface SMMOrderResponse {
  order: number;     // Order ID
  status: string;    // Order status
}

interface SMMStatusCheck {
  order: number;     // Order ID from previous response
}

interface SMMStatusResponse {
  status: string;    // Status (e.g., "completed", "processing", "pending")
  remains: number;   // Remaining items to be delivered
  startCount: number; // Starting count
  charge: string;    // Amount charged
}

// Define interface for createSMMOrder parameters
interface CreateSMMOrderParams {
  service: string | number;
  link: string;
  quantity: number;
}

// Create new SMM order
export async function createSMMOrder({service, link, quantity}: CreateSMMOrderParams) {
  const apiKey = process.env.SMMRAJA_API_KEY || "10Nw(e(j@6d@s(Q@1@Se(mb*";
  const endpoint = process.env.SMMRAJA_API_URL || "https://smmraja.com/api/v2";
  
  console.log('Creating SMM order with:', { service, link, quantity });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: apiKey,
        action: 'add',
        service: service || "3901", // Default to followers service
        link: link,
        quantity: quantity
      })
    });

    const result = await response.json();
    console.log('SMM API response:', result);

    if (result.error) {
      throw new Error(`SMM API Error: ${JSON.stringify(result)}`);
    }

    return result;
  } catch (error) {
    console.error('SMM Order creation error:', error);
    throw error;
  }
}

// Check order status
export async function checkSMMOrderStatus(orderData: SMMStatusCheck): Promise<SMMStatusResponse> {
  try {
    const apiKey = process.env.SMMRAJA_API_KEY || "10Nw(e(j@6d@s(Q@1@Se(mb*";
    const endpoint = process.env.SMMRAJA_API_URL || "https://smmraja.com/api/v2";
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: apiKey,
        action: 'status',
        ...orderData
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    console.error('SMM status check failed:', error);
    throw new Error('SMM status check failed');
  }
}

// Get available services
export async function getSMMServices() {
  try {
    const apiKey = process.env.SMMRAJA_API_KEY || "10Nw(e(j@6d@s(Q@1@Se(mb*";
    const endpoint = process.env.SMMRAJA_API_URL || "https://smmraja.com/api/v2";
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: apiKey,
        action: 'services'
      })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Failed to fetch SMM services:', error);
    throw new Error('Failed to fetch SMM services');
  }
} 