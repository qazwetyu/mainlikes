"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the more specific dashboard page
    router.replace('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Redirecting to dashboard...</p>
          
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
          
          <div className="mt-6">
            <p>If you are not redirected automatically, please click:</p>
            <Link 
              href="/admin/dashboard" 
              className="text-indigo-600 hover:underline mt-2 inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 