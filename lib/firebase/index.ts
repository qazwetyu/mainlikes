// Re-export the safer client implementation
import { firebaseClient } from './clientApp';

// Export the auth from our safer client implementation
export const auth = firebaseClient.auth;

// Export other Firebase services as needed
export const db = {
  // Mock implementation for database operations
  collection: (path: string) => ({
    doc: (id: string) => ({
      get: async () => ({
        exists: false,
        data: () => null,
        id
      }),
      set: async (data: any) => console.log(`Mock set to ${path}/${id}:`, data),
      update: async (data: any) => console.log(`Mock update to ${path}/${id}:`, data),
    }),
    // Add other methods as needed
  })
}; 