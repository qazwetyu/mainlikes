/**
 * Firebase Client SDK implementation for production use
 */

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Always use real implementation by default
const useMock = false; // Set to false to force real implementation

// Log configuration
console.log('Firebase Client Configuration:', {
  isUsingMock: useMock,
  firebaseConfigPresent: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
});

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
let db;
let authInstance;

if (useMock) {
  console.log('WARNING: Using mock Firebase Client SDK (should only be used for development)');
  
  // Create a mock auth implementation
  const mockAuth = {
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Simulate no user for builds
      callback(null);
      // Return mock unsubscribe function
      return () => {};
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      console.log(`Mock sign in with email: ${email}`);
      return { user: { email, uid: 'mock-uid' } };
    },
    signOut: async () => {
      console.log('Mock sign out');
    }
  };
  
  // Mock Firestore
  db = {
    collection: (path: string) => ({
      doc: (id: string) => ({
        get: async () => ({
          exists: true,
          data: () => {
            console.log(`Would fetch document ${id} from ${path}`);
            return {
              id,
              createdAt: new Date().toISOString(),
            };
          },
        }),
        set: async (data: any) => {
          console.log(`Would set document ${id} in ${path} with:`, data);
          return { id };
        },
        update: async (data: any) => {
          console.log(`Would update document ${id} in ${path} with:`, data);
          return { id };
        },
      }),
      add: async (data: any) => {
        const id = `mock-${Date.now()}`;
        console.log(`Would add document to ${path} with:`, data);
        return { id };
      },
      where: () => ({
        get: async () => ({
          empty: false,
          docs: [
            {
              id: 'mock-doc',
              data: () => ({ id: 'mock-doc' }),
            },
          ],
        }),
      }),
    }),
  };
  
  authInstance = mockAuth;
} else {
  console.log('Initializing real Firebase Client SDK');
  
  try {
    // Check if Firebase is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Get Auth instance
    const auth = getAuth(app);
    
    // Create a wrapper with the same interface as the mock
    authInstance = {
      onAuthStateChanged: (callback: (user: any) => void) => {
        return firebaseAuthStateChanged(auth, callback);
      },
      signInWithEmailAndPassword: async (email: string, password: string) => {
        return firebaseSignIn(auth, email, password);
      },
      signOut: async () => {
        return firebaseSignOut(auth);
      }
    };
    
    console.log('Firebase Client SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Client SDK:', error);
    throw new Error('Failed to initialize Firebase Client. Check your environment variables.');
  }
}

// Export the Firebase client
export const firebaseClient = {
  auth: authInstance,
  db: db,
}; 