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

// Mock data for dashboard and development
export const mockOrdersDetailed = [
  {
    id: 'order-1234',
    createdAt: '2024-05-01T08:30:00Z',
    serviceType: 'smm',
    serviceDetails: {
      name: 'Instagram Followers',
      quantity: 100,
    },
    amount: 5.99,
    status: 'completed',
  },
  {
    id: 'order-5678',
    createdAt: '2024-05-02T10:15:00Z',
    serviceType: 'smm',
    serviceDetails: {
      name: 'TikTok Likes',
      quantity: 500,
    },
    amount: 8.99,
    status: 'processing',
  },
  {
    id: 'order-9012',
    createdAt: '2024-05-03T14:45:00Z',
    serviceType: 'smm',
    serviceDetails: {
      name: 'YouTube Views',
      quantity: 1000,
    },
    amount: 12.99,
    status: 'processing',
  },
];

export const mockStats = {
  totalOrders: 347,
  totalRevenue: 4289.99,
  pendingOrders: 12,
  completedOrders: 335,
};

export const mockServicesDetailed = [
  {
    id: 'service-1',
    name: 'Instagram Followers',
    description: 'High quality Instagram followers for your profile',
    price: 5.99,
    category: 'instagram',
    popular: true,
  },
  {
    id: 'service-2',
    name: 'TikTok Likes',
    description: 'Boost your TikTok videos with likes',
    price: 8.99,
    category: 'tiktok',
    popular: true,
  },
  {
    id: 'service-3',
    name: 'YouTube Views',
    description: 'Increase your YouTube video views',
    price: 12.99,
    category: 'youtube',
    popular: false,
  },
];

// Dashboard statistics interface and generator
export interface DashboardStats {
  sales: {
    total: number;
    change: number;
    data: number[];
  };
  users: {
    total: number;
    change: number;
    data: number[];
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
  revenue: {
    daily: number[];
    monthly: number[];
    yearly: number[];
  };
}

export const generateMockStats = (): DashboardStats => {
  // Generate random data for demonstration
  const generateRandomData = (length: number, min: number, max: number) => 
    Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  
  return {
    sales: {
      total: Math.floor(Math.random() * 5000) + 1000,
      change: Math.floor(Math.random() * 30) - 10, // -10% to +20%
      data: generateRandomData(7, 100, 500),
    },
    users: {
      total: Math.floor(Math.random() * 2000) + 500,
      change: Math.floor(Math.random() * 20) + 5, // +5% to +25%
      data: generateRandomData(7, 20, 100),
    },
    orders: {
      total: Math.floor(Math.random() * 1000) + 200,
      pending: Math.floor(Math.random() * 50) + 10,
      completed: Math.floor(Math.random() * 950) + 150,
    },
    revenue: {
      daily: generateRandomData(7, 5000, 20000),
      monthly: generateRandomData(12, 50000, 200000),
      yearly: generateRandomData(5, 500000, 2000000),
    }
  };
}; 