"use client";

import { useState } from "react";
import Link from "next/link";

export default function DirectAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setStatus("Attempting login...");
    
    try {
      const response = await fetch("/api/admin/token-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      setStatus(`Login response: ${JSON.stringify(data)}`);
      
      if (data.success) {
        setStatus("Login successful, wait for redirect...");
        
        // Wait a moment to ensure cookies are set
        setTimeout(() => {
          // Redirect to the specified location
          window.location.href = data.redirectTo || "/super-admin";
        }, 1000);
      } else {
        setError(data.message || "Login failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="mb-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Direct Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Independence from Firebase - Login directly
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="text-center">
            <Link href="/api/admin/bypass-login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Bypass Login (Emergency Access)
            </Link>
          </div>
        </div>
        
        {status && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32">
            <pre>{status}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 