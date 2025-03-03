// Mock implementation of Firebase client SDK
console.log('Using mock Firebase client SDK');

export const app = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false
};

export const db = {
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
    where: () => ({
      get: async () => ({
        empty: true,
        docs: [],
        forEach: (cb: any) => {}
      }),
      orderBy: () => ({
        limit: () => ({
          get: async () => ({
            empty: true,
            docs: []
          })
        })
      })
    }),
    orderBy: () => ({
      limit: () => ({
        get: async () => ({
          empty: true,
          docs: []
        })
      })
    })
  })
};

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {}; // unsubscribe function
  },
  signInWithEmailAndPassword: async () => ({
    user: {
      uid: 'mock-user-id',
      email: 'mock@example.com'
    }
  }),
  signOut: async () => {}
}; 