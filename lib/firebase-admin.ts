// Mock Firebase admin implementation

class MockFirestore {
  collection(path: string) {
    return {
      doc: (id: string) => ({
        get: async () => ({
          exists: false,
          data: () => null,
          id
        }),
        update: async (data: any) => console.log(`Would update doc ${id} with:`, data),
        set: async (data: any) => console.log(`Would set doc ${id} with:`, data),
      }),
      where: () => this.collection(path),
      orderBy: () => this.collection(path),
      limit: () => this.collection(path),
      get: async () => ({
        empty: true,
        docs: [],
        forEach: (callback: Function) => {}
      })
    };
  }
}

export const adminDb = new MockFirestore();

export const getAdminAuth = () => ({
  verifyIdToken: async () => ({
    uid: 'mock-user-id',
    email: 'mock@example.com'
  })
});

console.log('Using mock Firebase Admin SDK'); 