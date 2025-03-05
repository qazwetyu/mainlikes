import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from 'firebase/auth';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only in browser
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

if (isBrowser) {
  try {
    // Initialize Firebase only if it hasn't been initialized already
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize services
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Analytics works only in browser and is optional
    if (process.env.NODE_ENV !== 'development') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Analytics helper function
const trackEvent = (eventName: string, eventParams?: any) => {
  if (isBrowser && analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }
};

// Create empty stubs for server-side rendering
if (!isBrowser) {
  // Create stub implementations with proper types
  const mockApp = {} as FirebaseApp;
  const mockDb = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve()
      })
    })
  } as unknown as Firestore;
  
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
    signOut: () => Promise.resolve()
  } as unknown as Auth;
  
  app = mockApp;
  db = mockDb;
  auth = mockAuth;
}

export { app, db, auth, signInWithEmailAndPassword, signOut, trackEvent }; 