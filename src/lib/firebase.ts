import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Updated Firebase configuration using the correct values for likesmn-1cafc project
const firebaseConfig = {
  apiKey: "AIzaSyA1aCgv6YhJNQ9fpuBIY_b__AcDSewcNY8", // This matches the error logs
  authDomain: "likesmn-1cafc.firebaseapp.com",
  projectId: "likesmn-1cafc", // From your service account
  storageBucket: "likesmn-1cafc.appspot.com",
  messagingSenderId: "733889583172", // From error logs
  appId: "1:733889583172:web:a17df8fdc2ac71aad9ea82", // From error logs
  measurementId: "G-0TTS7KBCB0" // From error logs
};

// Conditionally initialize Firebase only on the client side
let app;
let db;
let auth;
let analytics = null;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    analytics = getAnalytics(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else {
  // Server-side placeholder
  app = null;
  db = null;
  auth = null;
}

// Analytics helper function with error handling
const trackEvent = (eventName: string, eventParams?: any) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }
};

export { app, db, auth, signInWithEmailAndPassword, signOut, trackEvent }; 