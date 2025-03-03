"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  createdAt: string;
  status: string;
  amount: number;
  serviceType?: string;
  serviceDetails?: any;
  paymentStatus?: string;
  [key: string]: any;
}

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const router = useRouter();
  const { id } = params;
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // First fetch all orders
        const response = await fetch("/api/admin/orders-bypass");
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.orders)) {
          // Find the specific order
          const foundOrder = data.orders.find((o: Order) => o.id === id);
          
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setError("Order not found");
          }
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      setStatusUpdating(true);
      // This would be a real API call in production
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the order in the state
      if (order) {
        setOrder({
          ...order,
          status: newStatus
        });
      }
      
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setStatusUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold text-red-500 mb-4">{error || "Order not found"}</h1>
          <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-900">
            &larr; Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-900">
          &larr; Back to Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Order #{order.id.substring(0, 8)}</h1>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status}
          </span>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Order Information</h2>
              <table className="min-w-full">
                <tbody>
                  <tr>
                    <td className="py-2 text-sm text-gray-500">Order ID</td>
                    <td className="py-2 text-sm font-medium">{order.id}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sm text-gray-500">Date</td>
                    <td className="py-2 text-sm font-medium">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sm text-gray-500">Service Type</td>
                    <td className="py-2 text-sm font-medium">{order.serviceType || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sm text-gray-500">Amount</td>
                    <td className="py-2 text-sm font-medium">{order.amount} ₮</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-sm text-gray-500">Payment Status</td>
                    <td className="py-2 text-sm font-medium">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus || 'N/A'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Service Details</h2>
              {order.serviceDetails ? (
                <pre className="p-4 bg-gray-50 rounded overflow-x-auto text-sm">
                  {JSON.stringify(order.serviceDetails, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">No service details available</p>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={order.status === 'pending' || statusUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  order.status === 'pending'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                Mark as Pending
              </button>
              
              <button
                onClick={() => handleStatusChange('processing')}
                disabled={order.status === 'processing' || statusUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  order.status === 'processing'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                Mark as Processing
              </button>
              
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={order.status === 'completed' || statusUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  order.status === 'completed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Mark as Completed
              </button>
              
              <button
                onClick={() => handleStatusChange('failed')}
                disabled={order.status === 'failed' || statusUpdating}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  order.status === 'failed'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Mark as Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 