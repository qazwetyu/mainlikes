import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the URL search parameters
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'balance';
    
    // Check if API key and URL are set
    if (!process.env.SMM_API_KEY || !process.env.SMM_API_URL) {
      throw new Error('SMM API configuration is missing');
    }
    
    console.log('Testing SMMA Pro API with:', { 
      url: process.env.SMM_API_URL,
      key: process.env.SMM_API_KEY.substring(0, 5) + '...',
      action
    });
    
    // Build the request data
    const requestData = {
      key: process.env.SMM_API_KEY,
      action: action
    };
    
    // Make the API request
    const response = await axios.post(process.env.SMM_API_URL, requestData);
    
    console.log('SMMA Pro response:', response.data);
    
    return NextResponse.json({
      success: true,
      apiConfig: {
        url: process.env.SMM_API_URL,
        keyLength: process.env.SMM_API_KEY.length
      },
      data: response.data
    });
  } catch (error) {
    console.error('Error testing SMMA Pro API:', error);
    
    // Extract error details for better debugging
    let errorMessage = 'Unknown error';
    let errorResponse = null;
    
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = `SMMA Pro API error: ${error.response.status} ${error.response.statusText}`;
      errorResponse = error.response.data;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: errorResponse,
      apiConfig: {
        url: process.env.SMM_API_URL,
        keyLength: process.env.SMM_API_KEY?.length || 0
      }
    }, { status: 500 });
  }
} 