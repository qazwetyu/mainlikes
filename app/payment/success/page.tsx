'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const [status, setStatus] = useState('checking');
  
  useEffect(() => {
    if (!orderId) return;
    
    // Check order status
    const checkOrderStatus = async () => {
      try {
        // Here you would make an API call to check the order status
        // For now, we'll just simulate a successful order
        setStatus('success');
      } catch (error) {
        console.error('Error checking order status:', error);
        setStatus('error');
      }
    };
    
    checkOrderStatus();
  }, [orderId]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
        {status === 'checking' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Төлбөр шалгаж байна...</h1>
            <p className="mb-4">Таны захиалгын дугаар: {orderId || 'N/A'}</p>
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
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