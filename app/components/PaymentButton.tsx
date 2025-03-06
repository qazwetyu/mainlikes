"use client";

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { getServiceId } from '../lib/config/service-ids';

interface PaymentButtonProps {
  serviceId: string;
  serviceName: string;
  price: number;
  buttonText?: string;
  username?: string;
  quantity?: number;
}

export default function PaymentButton({ 
  serviceId, 
  serviceName, 
  price, 
  buttonText = "Худалдаж авах",
  username = '',
  quantity = 0
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the correct SMM provider service ID based on our service type
      const smmServiceId = getServiceId(serviceId);
      
      console.log('Creating payment with:', { 
        serviceType: serviceId, 
        smmServiceId, 
        serviceName, 
        price, 
        username, 
        quantity 
      });
      
      // Create order in your backend
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          description: serviceName,
          orderId: `order-${Date.now()}`,
          serviceType: serviceId,
          serviceName: serviceName,
          targetUrl: username,
          quantity: quantity || (serviceId === 'followers' ? 1000 : 100),
          serviceId: smmServiceId // Use the mapped service ID
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Төлбөр үүсгэхэд алдаа гарлаа');
      }

      // Redirect to payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Төлбөрийн холбоос байхгүй байна');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Төлбөр боловсруулахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 font-medium
          bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
          hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600
          transform hover:scale-105 transition-all duration-200"
      >
        {loading ? 'Боловсруулж байна...' : buttonText}
      </button>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
} 