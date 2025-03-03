import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint') || 'https://byl.mn/api/v1/invoices';
    
    // Perform a basic fetch to the API to check authentication
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BYL_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    // Get the response text - could be JSON or HTML
    const responseText = await response.text();
    
    // Try to parse it as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = null;
    }
    
    // Return the relevant information
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      isJson: responseData !== null,
      data: responseData,
      textPreview: responseData ? null : responseText.substring(0, 300) + '...',
      headers: Object.fromEntries(response.headers),
      apiKeyExists: !!process.env.BYL_API_KEY,
      apiKeyLength: process.env.BYL_API_KEY ? process.env.BYL_API_KEY.length : 0
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
} 