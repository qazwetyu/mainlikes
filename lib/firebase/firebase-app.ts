// Special Firebase app initialization that won't break static builds

// Detect if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a safe Firebase initialization system
const createFirebaseApp = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase initializing in development mode');
  }
  
  // Check for static build/SSR environment
  if (!isBrowser) {
    console.log('Using mock Firebase implementation for server/static build');
    return {
      // Mock implementation
      name: '[DEFAULT]',
      options: { apiKey: 'mock-key' }
    };
  }
  
  try {
    console.log('Initializing Firebase in browser environment');
    // In browser, we would normally initialize Firebase here
    // but for now, still return mock implementation
    return {
      name: '[DEFAULT]',
      options: { apiKey: 'mock-key' }
    };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return {
      name: '[DEFAULT]',
      options: { apiKey: 'mock-key' }
    };
  }
};

// Export the app
export const app = createFirebaseApp();

// Create a safe authentication system
export const createAuth = () => {
  return {
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Call with null user
      if (isBrowser) {
        setTimeout(() => callback(null), 0);
      } else {
        callback(null);
      }
      return () => {}; // Unsubscribe function
    },
    signInWithEmailAndPassword: async (email: string, password: string) => ({
      user: { uid: 'mock-user-id', email }
    }),
    signOut: async () => {}
  };
};

// Export auth
export const auth = createAuth(); 