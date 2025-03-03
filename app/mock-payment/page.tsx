"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams?.get("amount") || "0";
  const orderId = searchParams?.get("orderId") || "";
  const [processing, setProcessing] = useState(false);
  
  // Add this useEffect to handle navigation if we're on the wrong URL
  useEffect(() => {
    // Check if we're on the wrong URL path (contains /undefined/)
    if (window.location.pathname.includes('/undefined/')) {
      // Extract the correct path and redirect
      const correctPath = window.location.pathname.replace('/undefined/', '/');
      const fullUrl = `${window.location.origin}${correctPath}${window.location.search}`;
      console.log('Redirecting to correct URL:', fullUrl);
      window.location.href = fullUrl;
    }
  }, []);

  const handleSuccess = () => {
    setProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      router.push(`/orders/${orderId}/status?status=success`);
    }, 2000);
  };

  const handleCancel = () => {
    router.push(`/orders/${orderId}/status?status=cancelled`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Test Payment Page
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              This is a mock payment page for testing
            </p>
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-blue-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    This page simulates an external payment gateway.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Order ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={orderId}
                    disabled
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount to Pay
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₮</span>
                  </div>
                  <input
                    type="text"
                    value={amount}
                    disabled
                    className="appearance-none block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSuccess}
                  disabled={processing}
                  className={`flex justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    processing 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  }`}
                >
                  {processing ? "Processing..." : "Complete Payment"}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={processing}
                  className="flex justify-center w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 