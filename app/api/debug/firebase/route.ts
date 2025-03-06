import { NextResponse } from 'next/server';
import { getApps } from 'firebase-admin/app';
import { adminDb } from '../../../../lib/firebase-admin';

/**
 * Debug endpoint to check Firebase credentials
 * This is only for troubleshooting and should be removed in production
 */
export async function GET() {
  // Check environment variables without exposing sensitive data
  const envInfo = {
    FIREBASE_ADMIN_PROJECT_ID: {
      exists: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
      value: process.env.FIREBASE_ADMIN_PROJECT_ID 
             ? `${process.env.FIREBASE_ADMIN_PROJECT_ID.substring(0, 3)}...` 
             : null,
      length: process.env.FIREBASE_ADMIN_PROJECT_ID?.length || 0
    },
    FIREBASE_ADMIN_CLIENT_EMAIL: {
      exists: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      value: process.env.FIREBASE_ADMIN_CLIENT_EMAIL 
             ? `${process.env.FIREBASE_ADMIN_CLIENT_EMAIL.substring(0, 6)}...` 
             : null,
      length: process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.length || 0
    },
    FIREBASE_ADMIN_PRIVATE_KEY: {
      exists: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      length: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.length || 0,
      containsRealNewlines: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.includes('\n') || false,
      containsEscapedNewlines: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.includes('\\n') || false,
      startsWithQuote: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.startsWith('"') || false,
      endsWithQuote: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.endsWith('"') || false,
      // Show a safe preview of the key
      preview: process.env.FIREBASE_ADMIN_PRIVATE_KEY 
               ? `${process.env.FIREBASE_ADMIN_PRIVATE_KEY.substring(0, 20)}...${process.env.FIREBASE_ADMIN_PRIVATE_KEY.substring(process.env.FIREBASE_ADMIN_PRIVATE_KEY.length - 20)}` 
               : null
    }
  };

  // Check Firebase Admin SDK state
  const firebaseInfo = {
    isInitialized: getApps().length > 0,
    adminDbType: adminDb.collection ? typeof adminDb.collection : 'not available'
  };

  // Ping test to check if DB can be accessed
  let dbTestResult = 'not attempted';
  try {
    const testRef = adminDb.collection('debug_tests').doc('test');
    await testRef.set({ timestamp: new Date().toISOString(), test: true });
    const doc = await testRef.get();
    dbTestResult = doc.exists ? 'success' : 'doc not found';
  } catch (error: any) {
    dbTestResult = `error: ${error?.message || 'Unknown error'}`;
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    environmentVariables: envInfo,
    firebase: firebaseInfo,
    dbTest: dbTestResult,
    isMockImplementation: dbTestResult.includes('Would') || 
                          (typeof adminDb.collection === 'function' && 
                           !getApps().length)
  });
} 