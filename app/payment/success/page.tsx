'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trackEvent } from '@/app/lib/utils/analytics'; // Fix import path

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const [status, setStatus] = useState('checking');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  useEffect(() => {
    if (!orderId) return;
    
    // Track the payment success event - only on client side
    if (typeof window !== 'undefined') {
      try {
        trackEvent('payment_success', { orderId });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    }
    
    // Check order status
    const checkOrderStatus = async () => {
      try {
        console.log('Checking order status for:', orderId);
        
        // Call API to check order status
        const response = await fetch(`/api/orders/${orderId}/status`);
        
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Order status response:', data);
        
        if (data.success && data.order) {
          setOrderDetails(data.order);
          setStatus('success');
        } else {
          console.error('Error fetching order details:', data);
          setStatus('error');
        }
      } catch (error) {
        console.error('Error checking order status:', error);
        setStatus('error');
      }
    };
    
    // Poll for order status initially and then every 10 seconds
    checkOrderStatus();
    const intervalId = setInterval(checkOrderStatus, 10000);
    
    return () => clearInterval(intervalId);
  }, [orderId]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
        {status === 'checking' && (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Захиалга шалгаж байна...</h1>
            <p>Таны төлбөрийг баталгаажуулж байна. Энэ хэдэн секунд үргэлжилнэ.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Төлбөр амжилттай!</h1>
            <p className="mb-4">Таны захиалга амжилттай баталгаажлаа.</p>
            <p className="mb-4">Захиалгын дугаар: {orderId || 'N/A'}</p>
            <p className="mb-8 text-gray-600">Таны захиалга боловсруулагдаж эхэлсэн. Үйлчилгээ идэвхжихэд 5-30 минут болно.</p>
            
            {orderDetails && orderDetails.smmOrderId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">SMM захиалгын дугаар: {orderDetails.smmOrderId}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Энэ дугаараар та захиалгынхаа явцыг шалгах боломжтой.
                </p>
              </div>
            )}
            
            <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
              Нүүр хуудас руу буцах
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Захиалга баталгаажуулахад алдаа гарлаа</h1>
            <p className="mb-4">Захиалгын мэдээллийг баталгаажуулахад алдаа гарлаа. Дахин оролдоно уу.</p>
            <p className="mb-8">Захиалгын дугаар: {orderId || 'N/A'}</p>
            <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
              Нүүр хуудас руу буцах
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 