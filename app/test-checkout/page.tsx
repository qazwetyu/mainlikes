'use client';

import { useState } from 'react';

export default function TestCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [productName, setProductName] = useState('Instagram Followers');
  const [productPrice, setProductPrice] = useState(10000);
  const [quantity, setQuantity] = useState(1);

  const createCheckout = async () => {
    setLoading(true);
    try {
      // Create an order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: 'smm',
          serviceDetails: {
            serviceId: 3901,  // Instagram Followers
            targetUrl: 'https://instagram.com/example',
            quantity: 100
          },
          customerEmail: 'test@example.com'
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }
      
      // Create checkout for this order
      const response = await fetch('/api/byl/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              price_data: {
                unit_amount: productPrice,
                product_data: {
                  name: productName
                }
              },
              quantity: quantity
            }
          ],
          orderId: orderData.orderId,
          customerEmail: 'test@example.com'
        })
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success && data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (error) {
      console.error('Checkout creation failed:', error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Test BYL.mn Checkout</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Price (MNT)</label>
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      <button
        onClick={createCheckout}
        disabled={loading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Creating Checkout...' : 'Create Checkout'}
      </button>
      
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Result:</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 