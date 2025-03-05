/**
 * Simple analytics utility for tracking user actions and page views
 */

// Track a page view
export const trackPageView = (page: string) => {
  try {
    // In a real implementation, you would send this to your analytics service
    console.log(`Page view: ${page}`);
    
    // Example implementation with a service like Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: page,
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track a user action or event
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  try {
    // In a real implementation, you would send this to your analytics service
    console.log(`Event: ${eventName}`, properties);
    
    // Example implementation with a service like Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Track a conversion (e.g., completed purchase)
export const trackConversion = (conversionId: string, value?: number) => {
  try {
    // In a real implementation, you would send this to your analytics service
    console.log(`Conversion: ${conversionId}`, { value });
    
    // Example implementation with a service like Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: 'USD',
      });
    }
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}; 