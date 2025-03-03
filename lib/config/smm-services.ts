interface SMMService {
  id: number;
  name: string;
  type: string;
  description: string;
  minQuantity: number;
  maxQuantity: number;
  price: number; // Price per 1000 units in MNT
}

// Configuration for SMMA Pro services
export const smmServices: Record<string, SMMService> = {
  instagramFollow: {
    id: 1479,
    name: "Instagram Followers",
    type: "follow",
    description: "High-quality Instagram followers",
    minQuantity: 100,
    maxQuantity: 10000,
    price: 8000 // 8000 MNT per 1000 followers
  },
  instagramLike: {
    id: 8117,
    name: "Instagram Likes",
    type: "like",
    description: "High-quality Instagram likes",
    minQuantity: 50,
    maxQuantity: 5000,
    price: 5000 // 5000 MNT per 1000 likes
  },
  // Add more services as needed
};

// Helper function to calculate price based on quantity
export function calculatePrice(serviceKey: string, quantity: number): number {
  const service = smmServices[serviceKey];
  if (!service) {
    throw new Error(`Service "${serviceKey}" not found`);
  }
  
  return Math.ceil((service.price * quantity) / 1000);
}

export function getServiceByType(type: string): SMMService[] {
  return Object.values(smmServices).filter(service => service.type === type);
}

export function getServiceById(id: number): SMMService | undefined {
  return Object.values(smmServices).find(service => service.id === id);
} 