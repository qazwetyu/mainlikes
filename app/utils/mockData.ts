// Common mock orders data for all admin endpoints
export const mockOrders = [
  {
    id: 'order-1',
    service: 'Instagram Followers',
    link: 'https://instagram.com/user123',
    username: 'user123',
    quantity: 1000,
    price: 29.99,
    status: 'completed',
    createdAt: '2023-08-15T09:30:00Z',
    updatedAt: '2023-08-15T10:30:00Z'
  },
  {
    id: 'order-2',
    service: 'TikTok Likes',
    link: 'https://tiktok.com/@user456/video/123',
    username: 'user456',
    quantity: 2000,
    price: 19.99,
    status: 'processing',
    createdAt: '2023-08-16T14:20:00Z',
    updatedAt: '2023-08-16T14:25:00Z'
  },
  {
    id: 'order-3',
    service: 'YouTube Views',
    link: 'https://youtube.com/watch?v=abc123',
    username: 'user789',
    quantity: 5000,
    price: 49.99,
    status: 'pending',
    createdAt: '2023-08-17T11:15:00Z',
    updatedAt: '2023-08-17T11:15:00Z'
  }
];

export const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00Z'
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'Instagram Followers',
    description: 'High-quality Instagram followers',
    type: 'instagram',
    category: 'followers',
    packages: [
      { id: '1-1', amount: 500, price: 14.99 },
      { id: '1-2', amount: 1000, price: 29.99 },
      { id: '1-3', amount: 5000, price: 99.99 }
    ]
  },
  {
    id: '2',
    name: 'Instagram Likes',
    description: 'Instant Instagram likes',
    type: 'instagram',
    category: 'likes',
    packages: [
      { id: '2-1', amount: 100, price: 4.99 },
      { id: '2-2', amount: 500, price: 19.99 },
      { id: '2-3', amount: 1000, price: 34.99 }
    ]
  },
  {
    id: '3',
    name: 'TikTok Followers',
    description: 'Real TikTok followers',
    type: 'tiktok',
    category: 'followers',
    packages: [
      { id: '3-1', amount: 1000, price: 19.99 },
      { id: '3-2', amount: 2500, price: 39.99 },
      { id: '3-3', amount: 5000, price: 69.99 }
    ]
  }
];

// Add more mock data sets as needed for other endpoints 