"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define the Order interface for TypeScript
interface Order {
  id?: string;
  createdAt?: string;
  status?: string;
  amount?: number;
  serviceType?: string;
  serviceDetails?: any;
  [key: string]: any; // Allow for any other properties
}

export default function SuperAdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState({});
  
  // Force fetch orders without any authentication
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setDebug(prev => ({ ...prev, fetchStarted: true }));
        
        // Use the direct bypass endpoint
        const response = await fetch("/api/admin/orders-bypass");
        
        setDebug(prev => ({ 
          ...prev, 
          fetchCompleted: true,
          status: response.status,
          statusText: response.statusText
        }));
        
        const data = await response.json();
        console.log("Orders data:", data);
        
        setDebug(prev => ({ ...prev, responseData: data }));
        
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setError(data.message || "Failed to load orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Super Admin Dashboard</h1>
          <p className="text-red-600 mb-4">
            This is a direct access dashboard that bypasses all middleware and auth checks.
          </p>
          
          <div className="space-y-2">
            <h2 className="font-semibold">Quick Actions:</h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="/api/admin/bypass-login"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Bypass Login
              </a>
              <a
                href="/api/admin/debug-auth"
                className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                target="_blank"
              >
                Debug Auth
              </a>
              <Link
                href="/admin/emergency-dashboard"
                className="inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Go to Emergency Dashboard
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <h2 className="text-xl font-bold p-4 border-b">Orders</h2>
            {orders.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={order.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id || 'Unknown ID'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown date'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.amount ? `${order.amount} ₮` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.serviceType || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-4">No orders found</p>
            )}
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 