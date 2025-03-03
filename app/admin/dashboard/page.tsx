"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StaticNotificationPanel from "../components/StaticNotificationPanel";

// Define the Order interface for TypeScript
interface Order {
  id: string;
  createdAt: string;
  status: string;
  amount: number;
  serviceType?: string;
  serviceDetails?: any;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Use the orders-bypass API endpoint to fetch orders
        const response = await fetch("/api/admin/orders-bypass");
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          
          // Calculate dashboard stats
          const completed = data.orders.filter((order: Order) => order.status === 'completed').length;
          const pending = data.orders.filter((order: Order) => order.status === 'pending').length;
          const totalAmount = data.orders.reduce((sum: number, order: Order) => sum + (order.amount || 0), 0);
          
          setStats({
            totalOrders: data.orders.length,
            pendingOrders: pending,
            completedOrders: completed,
            totalRevenue: totalAmount
          });
        } else {
          throw new Error(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Manage your orders and monitor system status</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalRevenue.toLocaleString()} ₮</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-bold text-xl">Recent Orders</h2>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">Loading orders...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.amount} ₮
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="px-6 py-4 border-t">
                  <Link href="/admin/orders" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                    View all orders →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <StaticNotificationPanel />
          
          <div className="bg-white rounded-lg shadow mt-6 p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link 
                href="/admin/orders/create" 
                className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Order
              </Link>
              <Link 
                href="/admin/users" 
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Manage Users
              </Link>
              <Link 
                href="/admin/settings" 
                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 