"use client";

import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export default function StaticNotificationPanel() {
  // Static notifications data that doesn't rely on Firebase
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Welcome to the emergency admin panel',
      type: 'info',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      message: 'Firebase-free system is active',
      type: 'success',
      timestamp: new Date(),
      read: false
    },
    {
      id: '3',
      message: 'Remember to check new orders',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false
    }
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Recent Notifications</h2>
      
      {notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li 
              key={notification.id}
              className={`p-2 rounded ${
                notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                notification.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex justify-between">
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 