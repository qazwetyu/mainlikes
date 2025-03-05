"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, Firestore } from 'firebase/firestore';

interface Order {
  id: string;
  status: string;
  createdAt: any;
  // add other fields as needed
}

export default function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if we're not in browser or if db is not available
    if (typeof window === 'undefined' || !db) {
      setIsLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const orderList: Order[] = [];
        querySnapshot.forEach((doc) => {
          orderList.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(orderList);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load recent orders");
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up order tracker:", error);
      setError("Failed to initialize order tracking");
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading recent orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-gray-500">No recent orders</div>;
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="p-3 bg-white rounded shadow-sm border-l-4 border-blue-500"
        >
          <div className="flex justify-between">
            <span className="font-medium">{order.id}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' : 
              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {order.createdAt?.toDate().toLocaleString() || 'Unknown date'}
          </div>
        </div>
      ))}
    </div>
  );
} 