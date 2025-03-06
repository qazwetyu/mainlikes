/**
 * Mock Firebase Admin SDK for builds and development environments
 */

console.log('Using mock Firebase Admin SDK for build');

// Mock Firestore operations
export const adminDb = {
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