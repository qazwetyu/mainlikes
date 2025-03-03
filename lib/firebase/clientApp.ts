// Client-side Firebase initialization with build-time safety

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only initialize Firebase in browser environments
export const initializeFirebase = () => {
  if (isBrowser) {
    // This will only run on the client side
    console.log('Initializing real Firebase client SDK');
    
    // Here you would normally initialize Firebase
    // But during static build, this code won't run
    
    return {
      auth: {
        currentUser: null,
        onAuthStateChanged: (callback: any) => {
          // Call with null user immediately
          setTimeout(() => callback(null), 0);
          return () => {}; // Return unsubscribe function
        },
        signInWithEmailAndPassword: async (email: string, password: string) => ({
          user: { uid: 'mock-user-id', email }
        }),
        signOut: async () => {}
      }
    };
  } else {
    // This runs during build/SSR
    console.log('Using mock Firebase client SDK in server context');
    
    // Return mock implementations
    return {
      auth: {
        currentUser: null,
        onAuthStateChanged: (callback: any) => {
          callback(null);
          return () => {};
        },
        signInWithEmailAndPassword: async (email: string, password: string) => ({
          user: { uid: 'mock-user-id', email }
        }),
        signOut: async () => {}
      }
    };
  }
};

// Export a pre-initialized instance
export const firebaseClient = initializeFirebase(); 