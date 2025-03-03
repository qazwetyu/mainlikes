"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDebug() {
  const [authState, setAuthState] = useState<any>(null);
  const [cookies, setCookies] = useState<any[]>([]);
  const [jwtData, setJwtData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch auth debug info
    const fetchAuthDebug = async () => {
      try {
        const response = await fetch("/api/admin/debug-auth");
        const data = await response.json();
        setAuthState(data);
      } catch (error) {
        console.error("Error fetching auth debug:", error);
      }
    };

    fetchAuthDebug();

    // Display all cookies
    const allCookies = document.cookie.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=');
      return { name, value: value ? '(has value)' : '(empty)' };
    });
    setCookies(allCookies);

    // Try to decode JWT if it exists
    const adminToken = getCookie('admin_token');
    if (adminToken) {
      try {
        // Basic JWT structure decoding (not verification)
        const parts = adminToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setJwtData(payload);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        setJwtData({ error: "Failed to decode token" });
      }
    }
  }, []);

  // Helper function to get a cookie by name
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // Create emergency login
  const emergencyLogin = async () => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          username: "qazwetyu", 
          password: "Bayraasuga12" 
        })
      });
      
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
      
      if (data.success) {
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Emergency login error:", error);
      alert("Login error: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Authentication Debug</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Emergency Actions</h2>
        <button 
          onClick={emergencyLogin}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Emergency Login Attempt
        </button>
        <button 
          onClick={() => router.push('/admin/dashboard')}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Dashboard Access
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          {authState ? (
            <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(authState, null, 2)}
            </pre>
          ) : (
            <p>Loading environment data...</p>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Browser Cookies</h2>
          {cookies.length > 0 ? (
            <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(cookies, null, 2)}
            </pre>
          ) : (
            <p>No cookies found</p>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">JWT Token Data</h2>
          {jwtData ? (
            <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(jwtData, null, 2)}
            </pre>
          ) : (
            <p>No admin_token cookie found or token is invalid</p>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Browser Info</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
            {`User Agent: ${navigator.userAgent}
Platform: ${navigator.platform}
Cookies Enabled: ${navigator.cookieEnabled}
Language: ${navigator.language}`}
          </pre>
        </div>
      </div>
    </div>
  );
} 