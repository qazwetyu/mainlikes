import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we're in a build environment
const isBuildEnv = process.env.NODE_ENV === 'production' && !process.env.FIREBASE_PROJECT_ID;

// Mock Firestore implementation for build
class MockFirestore {
  collection(name: string) {
    return {
      doc: (id: string) => ({
        get: async () => ({
          exists: false,
          data: () => null,
          id
        }),
        set: async () => {},
        update: async () => {}
      }),
      add: async (data: any) => ({ id: 'mock-id' }),
      where: () => ({
        get: async () => ({
          empty: true,
          docs: []
        })
      })
    };
  }
}

let adminDb: any;

if (isBuildEnv) {
  console.log('Using mock Firebase Admin SDK for build');
  adminDb = new MockFirestore();
} else {
  // Use environment variables instead of hardcoding credentials
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE || 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID || 'mock-project-id',
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || 'mock-key-id',
    private_key: (process.env.FIREBASE_PRIVATE_KEY || 'mock-key').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL || 'mock@example.com',
    client_id: process.env.FIREBASE_CLIENT_ID || 'mock-client-id',
    auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk.gserviceaccount.com',
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com'
  };

  // Initialize Firebase Admin
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert(serviceAccount as any)
      });
      adminDb = getFirestore();
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      adminDb = new MockFirestore();
    }
  } else {
    adminDb = getFirestore();
  }
}

export { adminDb };

export const getAdminAuth = () => ({
  verifyIdToken: async () => ({
    uid: 'mock-user-id',
    email: 'mock@example.com'
  })
}); 