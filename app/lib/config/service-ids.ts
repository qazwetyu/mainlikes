/**
 * Map service types to SMM provider-specific service IDs
 */

// Service type to SMM provider service ID mapping
export const SERVICE_ID_MAP: Record<string, string> = {
  // Instagram services
  followers: '1479',  // Instagram Followers
  likes: '951',       // Instagram Likes (correct ID for likes)
  views: '1481',      // Instagram Views
  comments: '1482',   // Instagram Comments
  
  // Default fallbacks
  default_followers: '1479',
  default_likes: '951'
};

/**
 * Get the service ID based on service type
 * @param serviceType The type of service (followers, likes, etc)
 * @returns The service ID for the specified provider
 */
export function getServiceId(serviceType: string): string {
  // Convert to lowercase for consistent matching
  const type = serviceType.toLowerCase();
  
  // Return the mapped service ID or default to followers if not found
  return SERVICE_ID_MAP[type] || SERVICE_ID_MAP.default_followers;
} 