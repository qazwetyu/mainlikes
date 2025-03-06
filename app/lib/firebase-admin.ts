/**
 * Firebase Admin SDK implementation for production use
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Always use real implementation by default
const useMock = false; // Set to false to force real implementation

// Log configuration
console.log('Firebase Admin Configuration:', {
  isUsingMock: useMock,
  hasFirebaseKeys: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  projectIdPresent: !!process.env.FIREBASE_ADMIN_PROJECT_ID
});

// Initialize the admin database
let adminDb: any;

if (useMock) {
  console.log('WARNING: Using mock Firebase Admin SDK (should only be used for development)');
  
  // Mock Firestore operations
  adminDb = {
    collection: (path: string) => ({
      doc: (id: string) => ({
        get: async () => ({
          exists: true,
          data: () => {
            console.log(`Would fetch document ${id} from ${path}`);
            return {
              id,
              status: 'processing',
              smmOrderId: path.includes('orders') ? `smm-mock-${Date.now()}` : undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          },
        }),
        set: async (data: any, options?: any) => {
          console.log(`Would set document ${id} in ${path} with:`, data);
          return { id };
        },
        update: async (data: any) => {
          console.log(`Would update document ${id} in ${path} with:`, data);
          return { id };
        },
        delete: async () => {
          console.log(`Would delete document ${id} from ${path}`);
          return true;
        },
      }),
      add: async (data: any) => {
        const id = `mock-${Date.now()}`;
        console.log(`Would add document to ${path} with:`, data);
        return { id };
      },
      where: (field: string, op: string, value: any) => ({
        get: async () => ({
          empty: false,
          docs: [
            {
              id: 'mock-doc',
              data: () => ({ id: 'mock-doc', [field]: value }),
              exists: true,
            },
          ],
        }),
      }),
    }),
  };
} else {
  console.log('Initializing real Firebase Admin SDK');
  
  // Initialize the Firebase Admin SDK
  if (!getApps().length) {
    try {
      // Format the private key correctly
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined;
        
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
      });
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw new Error('Failed to initialize Firebase Admin. Check your environment variables.');
    }
  }
  
  // Set the Firestore database
  adminDb = getFirestore();
}

// Export the admin database
export { adminDb }; 