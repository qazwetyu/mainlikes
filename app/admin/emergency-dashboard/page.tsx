"use client";

import { useState } from "react";
import Link from "next/link";
import StaticNotificationPanel from "../components/StaticNotificationPanel";

export default function EmergencyDashboard() {
  const [systemStatus] = useState({
    database: "Unknown",
    api: "Active",
    paymentGateway: "Active",
    lastCheck: new Date().toLocaleString()
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Emergency Dashboard</h1>
        <p className="text-gray-500 mb-2">Use this dashboard when the primary admin panel is unavailable</p>
        <div className="flex space-x-2">
          <Link 
            href="/admin/dashboard" 
            className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
          >
            Try Standard Dashboard
          </Link>
          <Link 
            href="/admin/direct-login" 
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database Connection:</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  systemStatus.database === "Active" ? "bg-green-100 text-green-800" :
                  systemStatus.database === "Degraded" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {systemStatus.database}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Status:</span>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {systemStatus.api}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Gateway:</span>
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {systemStatus.paymentGateway}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                Last updated: {systemStatus.lastCheck}
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => alert("This is a static emergency dashboard. Refresh functionality would be implemented in a real emergency system.")}
              >
                Refresh Status
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Emergency Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50"
                onClick={() => alert("This would export all current orders to a CSV file.")}
              >
                <h3 className="font-medium">Export All Orders</h3>
                <p className="text-sm text-gray-500">Download all order data as CSV</p>
              </button>
              
              <button
                className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50"
                onClick={() => alert("This would process pending payments manually.")}
              >
                <h3 className="font-medium">Manual Payment Processing</h3>
                <p className="text-sm text-gray-500">Process payments that are stuck</p>
              </button>
              
              <button
                className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50"
                onClick={() => alert("This would restore database from a backup.")}
              >
                <h3 className="font-medium">Restore Backup</h3>
                <p className="text-sm text-gray-500">Restore from most recent backup</p>
              </button>
              
              <button
                className="p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50"
                onClick={() => alert("This would enable/disable maintenance mode.")}
              >
                <h3 className="font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Put site in maintenance mode</p>
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <StaticNotificationPanel />
          
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Emergency Contacts</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">Technical Support:</span>
                <span className="font-medium">+123-456-7890</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Database Admin:</span>
                <span className="font-medium">admin@example.com</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Payment Gateway:</span>
                <span className="font-medium">+123-456-7890</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 