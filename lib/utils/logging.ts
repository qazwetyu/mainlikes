export function logInfo(context: string, message: string, data?: any) {
  console.log(`[${context}] ${message}`, data || '');
} 