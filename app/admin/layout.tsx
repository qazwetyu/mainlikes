"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || '';
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/admin/direct-login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-indigo-800 text-white w-64 fixed h-full transition-transform duration-300 ease-in-out z-30 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 border-b border-indigo-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/admin/dashboard"
                className={`block px-4 py-2 ${
                  pathname === '/admin/dashboard' ? 'bg-indigo-900' : 'hover:bg-indigo-700'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className={`block px-4 py-2 ${
                  pathname === '/admin/orders' || pathname.startsWith('/admin/orders/') 
                    ? 'bg-indigo-900' 
                    : 'hover:bg-indigo-700'
                }`}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className={`block px-4 py-2 ${
                  pathname === '/admin/users' ? 'bg-indigo-900' : 'hover:bg-indigo-700'
                }`}
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`block px-4 py-2 ${
                  pathname === '/admin/settings' ? 'bg-indigo-900' : 'hover:bg-indigo-700'
                }`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-center text-indigo-200 hover:text-white hover:bg-indigo-700 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="flex-1 flex items-center px-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            <div className="ml-4 text-lg font-semibold text-gray-800">
              {pathname === '/admin/dashboard' && 'Dashboard'}
              {pathname === '/admin/orders' && 'Orders'}
              {pathname.startsWith('/admin/orders/') && 'Order Details'}
              {pathname === '/admin/users' && 'Users'}
              {pathname === '/admin/settings' && 'Settings'}
            </div>
          </div>
          
          <div className="pr-4">
            <Link
              href="/admin/profile"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <span className="ml-2">Admin</span>
            </Link>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 