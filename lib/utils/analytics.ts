"use client";

// Basic analytics functions
export const trackPageView = (page: string) => {
  // Implement your analytics logic here
  if (typeof window !== 'undefined') {
    console.log(`Page view tracked: ${page}`);
    // You would typically send this to a service like Google Analytics
  }
};

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  // Implement your analytics logic here
  if (typeof window !== 'undefined') {
    console.log(`Event tracked: ${eventName}`, properties);
    // You would typically send this to a service like Google Analytics or Mixpanel
  }
};

export const trackConversion = (orderValue: number, orderId: string) => {
  // Implement your conversion tracking logic here
  if (typeof window !== 'undefined') {
    console.log(`Conversion tracked: ${orderId} with value ${orderValue}`);
    // You would typically send this to a service like Google Analytics E-commerce
  }
}; 