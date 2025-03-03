'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Төлбөр цуцлагдсан</h1>
        <p className="mb-4">Таны захиалга цуцлагдсан байна.</p>
        <p className="mb-4">Захиалгын дугаар: {orderId || 'N/A'}</p>
        <p className="mb-8 text-gray-600">Та дахин захиалга хийх боломжтой.</p>
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
} 