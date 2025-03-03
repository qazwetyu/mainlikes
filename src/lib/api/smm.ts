const SMM_API_URL = 'https://www.smmraja.com/api/v3';
const SMM_API_KEY = process.env.SMM_RAJA_API_KEY;

// Service IDs for different types of services
export const SMM_SERVICES = {
  FOLLOWERS: '3901', // Instagram Followers service ID
  LIKES: '1192'      // Instagram Likes service ID
};

interface SMMOrder {
  service: string; // Service ID from SMM Raja
  link: string;    // Instagram username or post URL
  quantity: number;
}

export async function createSMMOrder(data: { 
  service?: string,  // Optional - we'll use the default if not provided
  link: string, 
  quantity: number 
}) {
  const apiKey = process.env.SMMRAJA_API_KEY || "10Nw(e(j@6d@s(Q@1@Se(mb*";
  const endpoint = process.env.SMMRAJA_API_URL || "https://www.smmraja.com/api/v3";
  
  // Use service ID 3901 for followers if not specified
  const serviceId = data.service || "3901";

  console.log('Creating SMM order with data:', {
    service: serviceId,
    link: data.link,
    quantity: data.quantity
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: apiKey,
        action: 'add',
        service: serviceId,
        link: data.link,
        quantity: data.quantity
      })
    });

    const responseText = await response.text();
    console.log('SMM API raw response:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from SMM API: ${responseText}`);
    }

    if (result.error) {
      throw new Error(`SMM API Error: ${JSON.stringify(result)}`);
    }

    return result;
  } catch (error) {
    console.error('SMM Order creation error:', error);
    throw error;
  }
}

export async function checkSMMOrder(orderId: string) {
  const apiKey = process.env.SMMRAJA_API_KEY || "10Nw(e(j@6d@s(Q@1@Se(mb*";
  const endpoint = process.env.SMMRAJA_API_URL || "https://smmraja.com/api/v2";

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: apiKey,
        action: 'status',
        order: orderId
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error checking SMM order ${orderId}:`, error);
    throw error;
  }
} 