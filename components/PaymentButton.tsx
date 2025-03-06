"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
  buttonText = "Худалдаж авах" 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order in your backend
      const response = await fetch('/api/orders/create', {
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
        throw new Error(data.message || 'Төлбөр үүсгэхэд алдаа гарлаа');
      }

      // Redirect to payment page
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Төлбөр боловсруулахад алдаа гарлаа. Дахин оролдоно уу.');
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
      {loading ? 'Боловсруулж байна...' : buttonText}
    </Button>
  );
} 