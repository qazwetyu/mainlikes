"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseClient } from '../lib/firebase/clientApp';

// Define the auth context type
export interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ user: null }),
  logout: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // Changed to false to avoid loading state

  // Check if authenticated - using a simplified approach
  useEffect(() => {
    // For this project, we're not actually using authentication
    // so we'll just set loading to false immediately
    setLoading(false);
    
    // Return a no-op function
    return () => {};
  }, []);

  // Simplified login function
  const login = async (email: string, password: string) => {
    console.log('Login attempted with:', email);
    // Just return a mock user object
    return { user: { email, uid: 'mock-user-id' } };
  };

  // Simplified logout function
  const logout = async () => {
    console.log('Logout attempted');
    setUser(null);
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 