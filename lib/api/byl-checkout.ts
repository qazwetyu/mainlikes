/**
 * BYL.mn Checkout API integration
 */

interface CheckoutItem {
  price_data: {
    unit_amount: number;
    product_data: {
      name: string;
      client_reference_id?: string;
    };
  };
  quantity: number;
  adjustable_quantity?: {
    enabled: boolean;
    min?: number;
    max?: number;
  };
}

interface CheckoutOptions {
  success_url?: string;
  cancel_url?: string;
  items: CheckoutItem[];
  phone_number_collection?: boolean;
  delivery_address_collection?: boolean;
  customer_email?: string;
  client_reference_id?: string;
}

interface CheckoutResponse {
  id: number;
  url: string;
}

/**
 * Create a checkout session with BYL.mn
 */
export async function createCheckoutSession(options: CheckoutOptions): Promise<CheckoutResponse> {
  try {
    if (!process.env.BYL_API_KEY) {
      throw new Error('BYL_API_KEY is not defined');
    }
    
    const projectId = process.env.BYL_PROJECT_ID || '99'; // Use your project ID
    const apiUrl = `https://byl.mn/api/v1/projects/${projectId}/checkouts`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });

    const result = await response.json();
    
    if (!result.data) {
      throw new Error('Invalid response from BYL.mn');
    }
    
    return result.data;
  } catch (error) {
    console.error('BYL.mn checkout creation failed:', error);
    throw error;
  }
}

/**
 * Check status of a checkout session
 */
export async function getCheckoutSession(checkoutId: number): Promise<any> {
  try {
    if (!process.env.BYL_API_KEY) {
      throw new Error('BYL_API_KEY is not defined');
    }
    
    const projectId = process.env.BYL_PROJECT_ID || '99'; // Use your project ID
    const apiUrl = `https://byl.mn/api/v1/projects/${projectId}/checkouts/${checkoutId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const result = await response.json();
    
    if (!result.data) {
      throw new Error('Invalid response from BYL.mn');
    }
    
    return result.data;
  } catch (error) {
    console.error('BYL.mn checkout status check failed:', error);
    throw error;
  }
} 