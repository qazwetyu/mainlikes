/**
 * Firebase Admin SDK implementation for production use
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Function to properly format Firebase private key
const formatPrivateKey = (key: string | undefined): string => {
  console.log('PRIVATE KEY DEBUG INFO:');
  console.log('- Key provided:', !!key);
  console.log('- Key length:', key?.length || 0);
  console.log('- Has real newlines:', key?.includes('\n') || false);
  console.log('- Has escaped newlines:', key?.includes('\\n') || false);
  console.log('- First 10 chars:', key?.substring(0, 10));
  console.log('- Last 10 chars:', key?.substring(key.length - 10));
  
  if (!key) {
    console.error('No private key provided');
    return '';
  }
  
  // Return the key if it already contains actual newlines
  if (key.includes('\n') && !key.includes('\\n')) {
    console.log('Key already has proper newlines, using as-is');
    return key;
  }
  
  // Handle various formats of private key
  const cleanKey = key
    .replace(/\\n/g, '\n')      // Replace literal \n with actual newlines
    .replace(/"/g, '')          // Remove quotes if present
    .replace(/^\s+|\s+$/g, ''); // Trim whitespace
  
  console.log('- After cleaning:');
  console.log('  - Key length:', cleanKey.length);
  console.log('  - Has real newlines:', cleanKey.includes('\n'));
  console.log('  - First 20 chars:', cleanKey.substring(0, 20));
  console.log('  - Last 20 chars:', cleanKey.substring(cleanKey.length - 20));
  
  // Ensure it has the right format
  if (!cleanKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    console.error('Invalid private key format: Key does not start with BEGIN PRIVATE KEY');
    console.log('Actual start:', cleanKey.substring(0, 30));
    return '';
  }
  
  if (!cleanKey.endsWith('-----END PRIVATE KEY-----')) {
    console.error('Invalid private key format: Key does not end with END PRIVATE KEY');
    console.log('Actual end:', cleanKey.substring(cleanKey.length - 30));
    return '';
  }
  
  return cleanKey;
};

// Try with alternative formatting approaches if the initial one fails
const tryFormatPrivateKey = (key: string | undefined): string => {
  if (!key) return '';
  
  // Try multiple approaches to format the key
  const attempts = [
    // Original approach
    formatPrivateKey(key),
    
    // Try with double backslashes replaced
    key.includes('\\\\n') ? formatPrivateKey(key.replace(/\\\\n/g, '\\n')) : '',
    
    // Try with quotes removed first
    formatPrivateKey(key.replace(/^"|"$/g, '')),
    
    // Try with a more aggressive approach
    key.replace(/\\n/g, '\n').replace(/"/g, '').trim(),
    
    // Last resort: manually rebuild the key with proper structure
    `-----BEGIN PRIVATE KEY-----\n${
      key.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '')
         .replace(/\\n/g, '')
         .replace(/"/g, '')
         .trim()
    }\n-----END PRIVATE KEY-----`
  ];
  
  // Return the first non-empty result
  for (const attempt of attempts) {
    if (attempt && 
        attempt.startsWith('-----BEGIN PRIVATE KEY-----') && 
        attempt.endsWith('-----END PRIVATE KEY-----')) {
      console.log('Successful key formatting with attempt #', attempts.indexOf(attempt) + 1);
      return attempt;
    }
  }
  
  console.error('All private key formatting attempts failed');
  return '';
};

// Log detailed info for debugging
console.log('Firebase Credentials Check:', {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID?.slice(0, 3) + '...',
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.slice(0, 6) + '...',
  keyProvided: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  keyLength: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.length || 0
});

// Check for required credentials
const hasFirebaseCredentials = 
  !!process.env.FIREBASE_ADMIN_PROJECT_ID && 
  !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
  !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Use mocks if credentials are missing
const useMock = !hasFirebaseCredentials;

// Log configuration
console.log('Firebase Admin Configuration:', {
  isUsingMock: useMock,
  hasFirebaseKeys: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  projectIdPresent: !!process.env.FIREBASE_ADMIN_PROJECT_ID
});

// Initialize the admin database
let adminDb: any;

if (useMock) {
  console.log('Using mock Firebase Admin SDK (credentials not available)');
  
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
  try {
    console.log('Initializing real Firebase Admin SDK');
    
    // Format the private key correctly
    console.log('Raw env var for debugging:');
    console.log(process.env.FIREBASE_ADMIN_PRIVATE_KEY?.substring(0, 50) + '...');
    
    // Use our enhanced multi-attempt formatter
    const privateKey = tryFormatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
    
    if (!privateKey) {
      console.error('Private key formatting failed - using mock implementation');
      
      // Fall back to mock implementation
      adminDb = {
        collection: (path: string) => ({
          doc: (id: string) => ({
            get: async () => ({
              exists: true,
              data: () => {
                console.log(`(Fallback) Would fetch document ${id} from ${path}`);
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
              console.log(`(Fallback) Would set document ${id} in ${path} with:`, data);
              return { id };
            },
            update: async (data: any) => {
              console.log(`(Fallback) Would update document ${id} in ${path} with:`, data);
              return { id };
            },
            delete: async () => {
              console.log(`(Fallback) Would delete document ${id} from ${path}`);
              return true;
            },
          }),
          add: async (data: any) => {
            const id = `mock-${Date.now()}`;
            console.log(`(Fallback) Would add document to ${path} with:`, data);
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
      // Log key length for debugging (don't log the actual key!)
      console.log(`Private key formatted. Length: ${privateKey.length}`);
      
      // Initialize the Firebase Admin SDK
      if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
            privateKey: privateKey,
          }),
          databaseURL: process.env.FIREBASE_ADMIN_DATABASE_URL,
        });
        
        console.log('Firebase Admin initialized successfully');
      }
      
      // Set the Firestore database
      adminDb = getFirestore();
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    
    // Fall back to mock implementation
    console.log('Falling back to mock implementation due to initialization error');
    
    adminDb = {
      collection: (path: string) => ({
        doc: (id: string) => ({
          get: async () => ({
            exists: true,
            data: () => {
              console.log(`(Error fallback) Would fetch document ${id} from ${path}`);
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
            console.log(`(Error fallback) Would set document ${id} in ${path} with:`, data);
            return { id };
          },
          update: async (data: any) => {
            console.log(`(Error fallback) Would update document ${id} in ${path} with:`, data);
            return { id };
          },
          delete: async () => {
            console.log(`(Error fallback) Would delete document ${id} from ${path}`);
            return true;
          },
        }),
        add: async (data: any) => {
          const id = `mock-${Date.now()}`;
          console.log(`(Error fallback) Would add document to ${path} with:`, data);
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
  }
}

// Export the admin database
export { adminDb }; 