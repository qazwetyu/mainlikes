"use client";

import { useState } from 'react';
import { Button } from '../components/ui/button';

interface PaymentButtonProps {
  serviceId: string;
  serviceName: string;
  price: number;
  buttonText?: string;
}

export default function PaymentButton({ 
  serviceId, 
  serviceName, 
  price, 
  buttonText = "Buy Now" 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order in your backend
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          serviceName,
          price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      // Redirect to payment page
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
} 