import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if environment has individual credential parts
const useIndividualCredentials = process.env.FIREBASE_PROJECT_ID && 
                               process.env.FIREBASE_PRIVATE_KEY && 
                               process.env.FIREBASE_CLIENT_EMAIL;

let serviceAccount;

if (useIndividualCredentials) {
  // Use individual environment variables
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Use the JSON string approach
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    console.error('Error parsing Firebase service account:', error);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format');
  }
} else {
  throw new Error('Firebase credentials not found in environment variables');
}

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (error) {
    console.error('Error initializing Firebase admin:', error);
    throw error;
  }
}

const adminDb = getFirestore();

export { adminDb }; 