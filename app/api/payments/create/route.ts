import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// PaymentData interface for our API input
interface PaymentData {
  amount: number;
  description?: string;
  orderId: string;
  customerEmail?: string;
  serviceType?: string;
  serviceName?: string;
  targetUrl?: string;
}

// BYL Checkout API request interface
interface BylCheckoutRequest {
  success_url: string;
  cancel_url: string;
  client_reference_id: string;
  items: Array<{
    price_data: {
      unit_amount: number;
      product_data: {
        name: string;
        client_reference_id: string;
      }
    };
    quantity: number;
  }>;
  customer_email?: string; // Optional property for customer email
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Log the request for debugging
    console.log('Payment creation request:', body);
    
    // Check for required fields - updated to match actual request format
    if (!body.amount || !body.orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: amount and orderId are required' 
      }, { status: 400 });
    }

    // Get BYL API credentials from environment variables
    const BYL_PROJECT_ID = process.env.BYL_PROJECT_ID || '99'; // Fallback for testing
    const BYL_TOKEN = process.env.BYL_API_KEY; // Use the key that's in the .env file

    // Log credentials presence (not values) for debugging
    console.log('BYL credentials check:', {
      projectIdExists: !!BYL_PROJECT_ID,
      tokenExists: !!BYL_TOKEN
    });

    // IMPORTANT: Create the order in Firebase first to ensure it exists
    try {
      console.log(`Creating/updating order in Firebase: ${body.orderId}`);
      
      // Create a properly structured order document
      const orderData = {
        id: body.orderId,
        orderId: body.orderId, // Duplicate for consistency
        amount: body.amount,
        description: body.description || 'Payment',
        serviceType: body.serviceType || 'unknown',
        serviceName: body.serviceName || body.description || 'Service',
        targetUrl: body.targetUrl || '',
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save the order to Firebase
      await adminDb.collection('orders').doc(body.orderId).set(orderData);
      console.log(`Successfully saved order ${body.orderId} to Firebase`);
      
      // Verify order was created
      const orderDoc = await adminDb.collection('orders').doc(body.orderId).get();
      if (!orderDoc.exists) {
        console.error(`Failed to create order ${body.orderId} in Firebase!`);
      } else {
        console.log(`Verified order ${body.orderId} exists in Firebase`);
      }
    } catch (error) {
      console.error(`Error saving order to Firebase: ${error instanceof Error ? error.message : String(error)}`);
      // Continue with payment creation even if Firebase save fails
    }

    // Allow for development/testing without API keys
    if (process.env.NODE_ENV === 'development' && (!BYL_PROJECT_ID || !BYL_TOKEN)) {
      console.log('Using development mock for BYL checkout');
      
      // Create a mock checkout response
      return NextResponse.json({
        success: true,
        paymentUrl: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/mock-payment?orderId=${body.orderId}`,
        orderId: body.orderId,
        checkoutId: `mock-${Date.now()}`
      });
    }

    try {
      // Prepare the BYL API request with proper typing
      const bylRequestData: BylCheckoutRequest = {
        success_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL}/payment/success?orderId=${body.orderId}`,
        cancel_url: `${request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel?orderId=${body.orderId}`,
        client_reference_id: body.orderId,
        items: [
          {
            price_data: {
              unit_amount: body.amount,
              product_data: {
                name: body.description || 'Social Media Marketing Service',
                client_reference_id: body.orderId
              }
            },
            quantity: 1
          }
        ]
      };

      // If customer email is provided, include it
      if (body.customerEmail) {
        bylRequestData.customer_email = body.customerEmail;
      }

      // Make the API call to BYL.mn
      const response = await fetch(`https://byl.mn/api/v1/projects/${BYL_PROJECT_ID}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BYL_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bylRequestData)
      });

      // Parse the BYL response
      const bylResponse = await response.json();

      if (!response.ok) {
        throw new Error(`BYL API error: ${JSON.stringify(bylResponse)}`);
      }

      // Update the order with payment information
      try {
        await adminDb.collection('orders').doc(body.orderId).update({
          paymentDetails: {
            provider: 'byl.mn',
            checkoutId: bylResponse.data.id,
            createdAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error updating order with payment details: ${error instanceof Error ? error.message : String(error)}`);
        // Continue even if update fails
      }

      // Return the checkout URL to the client
      return NextResponse.json({
        success: true,
        paymentUrl: bylResponse.data.url,
        orderId: body.orderId,
        checkoutId: bylResponse.data.id
      });
      
    } catch (error) {
      console.error(`BYL checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return NextResponse.json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create checkout',
        orderId: body.orderId
      }, { status: 500 });
    }
  } catch (error) {
    console.error(`Payment API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return NextResponse.json({
      success: false,
      message: 'Error processing payment request',
    }, { status: 500 });
  }
}

export async function GET() {
  // Simple endpoint to confirm the API is working
  return NextResponse.json({
    success: true,
    message: 'Payments API is active',
    timestamp: new Date().toISOString()
  });
} 