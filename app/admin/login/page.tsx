"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sign } from "jsonwebtoken";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("Submitting login with username:", username);
      console.log("Using credentials:", { username, password: password.substring(0, 1) + "..." });
      
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (data.success) {
        console.log("Login successful, redirecting to dashboard");
        
        // Wait a moment to ensure cookies are set
        setTimeout(() => {
          // Use window.location for a full page navigation instead of router.push
          window.location.href = "/admin/dashboard";
        }, 500);
      } else {
        setError(data.message || "Login failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  // Add a direct test login option for emergencies
  const handleTestLogin = async () => {
    try {
      const response = await fetch("/api/admin/login-test");
      const data = await response.json();
      
      if (data.success) {
        console.log("Test login successful, redirecting to dashboard");
        router.push("/admin/dashboard");
      } else {
        setError("Test login failed");
      }
    } catch (error) {
      console.error("Test login error:", error);
      setError("Test login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            
            <button
              type="button"
              onClick={handleTestLogin}
              className="text-sm text-gray-600 hover:text-indigo-500"
            >
              Emergency test login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 