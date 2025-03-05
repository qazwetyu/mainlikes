/**
 * Configuration for SMM services
 */

// Mock SMM services data for build and development
export const smmServices = {
  instagram_followers: {
    id: '1',
    name: 'Instagram Followers',
    type: 'instagram',
    category: 'followers',
    description: 'High quality Instagram followers',
    min: 100,
    max: 10000,
    rate: 0.01, // $0.01 per follower
    packages: [
      { amount: 100, price: 1.99 },
      { amount: 500, price: 8.99 },
      { amount: 1000, price: 15.99 },
      { amount: 5000, price: 69.99 },
    ]
  },
  instagram_likes: {
    id: '2',
    name: 'Instagram Likes',
    type: 'instagram',
    category: 'likes',
    description: 'High quality Instagram likes',
    min: 50,
    max: 5000,
    rate: 0.005, // $0.005 per like
    packages: [
      { amount: 100, price: 0.99 },
      { amount: 500, price: 3.99 },
      { amount: 1000, price: 6.99 },
      { amount: 5000, price: 29.99 },
    ]
  },
  tiktok_followers: {
    id: '3',
    name: 'TikTok Followers',
    type: 'tiktok',
    category: 'followers',
    description: 'Real TikTok followers',
    min: 100,
    max: 10000,
    rate: 0.015, // $0.015 per follower
    packages: [
      { amount: 100, price: 2.99 },
      { amount: 500, price: 11.99 },
      { amount: 1000, price: 19.99 },
      { amount: 5000, price: 79.99 },
    ]
  },
  tiktok_likes: {
    id: '4',
    name: 'TikTok Likes',
    type: 'tiktok',
    category: 'likes',
    description: 'Real TikTok likes',
    min: 50,
    max: 10000,
    rate: 0.01, // $0.01 per like
    packages: [
      { amount: 100, price: 1.99 },
      { amount: 500, price: 7.99 },
      { amount: 1000, price: 13.99 },
      { amount: 5000, price: 59.99 },
    ]
  }
}; 