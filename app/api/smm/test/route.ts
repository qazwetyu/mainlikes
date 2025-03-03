import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('SMM API Key:', process.env.SMM_API_KEY);
    console.log('SMM API URL:', process.env.SMM_API_URL);
    
    return NextResponse.json({
      success: true,
      message: 'Environment variables are set',
      apiKeyLength: process.env.SMM_API_KEY?.length || 0,
      apiUrlSet: !!process.env.SMM_API_URL
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error checking SMM API config',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 