'use client';

import { useState, useEffect } from 'react';

export default function OrderUpdatePage() {
  const [orderId, setOrderId] = useState('');
  const [username, setUsername] = useState('');
  const [serviceId, setServiceId] = useState('1479');
  const [quantity, setQuantity] = useState(500);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formatInstagram, setFormatInstagram] = useState(false);

  // Common services
  const services = [
    { id: '1479', name: 'Instagram Followers' },
    { id: '951', name: 'Instagram Likes' },
    { id: '1481', name: 'Instagram Views' },
    { id: '1482', name: 'Instagram Comments' }
  ];

  const fetchOrder = async () => {
    if (!orderId) {
      setMessage('Please enter an order ID');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/test-firebase?orderId=${orderId}&action=read`);
      const data = await response.json();
      
      if (data.success && data.operations && data.operations.length > 0) {
        const orderOp = data.operations.find((op: any) => op.type === 'read' && op.target.includes('orders/'));
        if (orderOp && orderOp.exists && orderOp.data) {
          setOrderData(orderOp.data);
          setUsername(orderOp.data.targetUrl || '');
          setServiceId(orderOp.data.serviceId || '1479');
          setQuantity(orderOp.data.quantity || 500);
          setMessage('Order found');
          setMessageType('success');
          
          // Check if order already has an SMM order ID
          if (orderOp.data.smmOrderId) {
            setMessage(`Order found - Already has SMM order ID: ${orderOp.data.smmOrderId}`);
            setMessageType('warning');
          }
        } else {
          setOrderData(null);
          setMessage('Order not found');
          setMessageType('error');
        }
      } else {
        setOrderData(null);
        setMessage('Order not found');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setMessage('Error fetching order');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async () => {
    if (!orderId) {
      setMessage('Please enter an order ID');
      setMessageType('error');
      return;
    }

    if (!username) {
      setMessage('Please enter a username/profile URL');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          targetUrl: username,
          serviceId,
          quantity
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderData(data.order);
        setMessage('Order updated successfully');
        setMessageType('success');
      } else {
        setMessage(`Failed to update order: ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage('Error updating order');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const resendWebhook = async () => {
    if (!orderId) {
      setMessage('Please enter an order ID');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/payments/test-webhook?orderId=${orderId}&targetUrl=${encodeURIComponent(username)}&serviceId=${serviceId}&quantity=${quantity}&formatInstagram=${formatInstagram}`);
      const data = await response.json();
      
      if (data.success) {
        setMessage('Webhook sent successfully');
        setMessageType('success');
        
        // Fetch the order again to get updated data
        setTimeout(fetchOrder, 1000);
      } else {
        setMessage(`Failed to send webhook: ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
      setMessage('Error sending webhook');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Clear SMM order ID to allow reprocessing
  const clearSmmOrderId = async () => {
    if (!orderId) {
      setMessage('Please enter an order ID');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          smmOrderId: null,
          status: 'paid' // Reset to paid status
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderData(data.order);
        setMessage('SMM order ID cleared successfully');
        setMessageType('success');
        // Fetch the order again
        setTimeout(fetchOrder, 500);
      } else {
        setMessage(`Failed to clear SMM order ID: ${data.message}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error clearing SMM order ID:', error);
      setMessage('Error clearing SMM order ID');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Extract orderId from URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('orderId');
      if (id) {
        setOrderId(id);
        // Fetch order if ID is in URL
        setTimeout(() => {
          fetchOrder();
        }, 100);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Update Tool</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Order ID</label>
          <div className="flex">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded mr-2"
              placeholder="order-1234567890"
            />
            <button
              onClick={fetchOrder}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Find Order'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 mb-4 rounded ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : messageType === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {orderData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
              <pre className="text-sm">{JSON.stringify(orderData, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username / Profile URL</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://instagram.com/username or just username"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Service</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} (ID: {service.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              checked={formatInstagram}
              onChange={(e) => setFormatInstagram(e.target.checked)}
              className="mr-2"
            />
            Auto-format Instagram username (add instagram.com/)
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {formatInstagram 
              ? "Username will be sent as: https://instagram.com/" + username 
              : "Username will be sent exactly as entered: " + username}
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={updateOrder}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 flex-1"
          >
            {loading ? 'Updating...' : 'Update Order'}
          </button>
          
          <button
            onClick={resendWebhook}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400 flex-1"
          >
            {loading ? 'Processing...' : 'Process Order'}
          </button>
        </div>

        {/* Only show the clear button if order has an SMM order ID */}
        {orderData?.smmOrderId && (
          <div className="mt-4">
            <button
              onClick={clearSmmOrderId}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 w-full"
            >
              {loading ? 'Clearing...' : `Clear SMM Order ID (${orderData.smmOrderId})`}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              This will allow the order to be processed again
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 