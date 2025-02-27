'use client';

import { useState, useEffect } from 'react';

export default function TestSMM() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [targetUrl, setTargetUrl] = useState('https://instagram.com/example');
  const [quantity, setQuantity] = useState(100);
  const [orderResult, setOrderResult] = useState<any>(null);

  useEffect(() => {
    // Fetch services when component mounts
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/smm/services');
        const data = await response.json();
        
        if (data.success && data.services) {
          setServices(data.services);
          if (data.services.length > 0) {
            setSelectedService(data.services[0].service);
          }
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const createOrder = async () => {
    if (!selectedService || !targetUrl || !quantity) {
      alert('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      // Create an SMM order directly (for testing)
      const response = await fetch('/api/smm/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService,
          link: targetUrl,
          quantity: quantity,
          orderId: 'test-' + Date.now() // This would normally come from a created order
        })
      });
      
      const data = await response.json();
      setOrderResult(data);
    } catch (error) {
      console.error('Order creation failed:', error);
      setOrderResult({ success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) {
    return <div className="p-6">Loading services...</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-xl font-bold mb-4">Test SMM Raja Integration</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Service</label>
        <select
          value={selectedService || ''}
          onChange={(e) => setSelectedService(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a service</option>
          {services.map((service: any) => (
            <option key={service.service} value={service.service}>
              {service.name} (${service.rate})
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Target URL</label>
        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://instagram.com/username"
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
        onClick={createOrder}
        disabled={loading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? 'Creating Order...' : 'Create SMM Order'}
      </button>
      
      {orderResult && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Order Result:</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {JSON.stringify(orderResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 