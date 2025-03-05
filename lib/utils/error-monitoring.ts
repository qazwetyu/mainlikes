// Simple error monitoring utility
export function logError(context: string, error: any) {
  console.error(`[${context}] Error:`, error);
  
  // In production, you could send this to a monitoring service
  // like Sentry, LogRocket, etc.
} 