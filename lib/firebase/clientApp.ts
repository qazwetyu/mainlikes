/**
 * Mock Firebase Client SDK for builds and development environments
 */

console.log('Using mock Firebase Client SDK for build');

// Mock Firebase Auth
const auth = {
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
const firestore = {
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

// Export the mock Firebase client
export const firebaseClient = {
  auth,
  db: firestore,
}; 