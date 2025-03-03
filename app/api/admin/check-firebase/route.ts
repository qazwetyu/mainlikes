import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get environment variables for Firebase configuration (but hide sensitive parts)
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 
        `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5)}...` : 'not set',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'not set',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not set',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 
        `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID.substring(0, 10)}...` : 'not set',
    };
    
    // Check if service account key is set
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    
    return NextResponse.json({
      success: true,
      message: "Firebase configuration check",
      firebaseConfig,
      hasServiceAccount,
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 