"use client";

import React, { createContext, useContext, useState } from 'react';

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
  loading: false,
  login: async () => ({ user: null }),
  logout: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock user for development
const MOCK_USER = {
  uid: 'mock-user-id',
  email: 'admin@example.com',
  displayName: 'Admin User',
  isAdmin: true
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple login function that uses hardcoded credentials for admin access
  const login = async (email: string, password: string) => {
    console.log('Login attempted with:', email);
    
    // Simple validation for demo purposes
    if (email === 'admin@example.com' && password === 'password') {
      setUser(MOCK_USER);
      return { user: MOCK_USER };
    }
    
    // For any other credentials, return a mock user
    const mockUser = { uid: 'user-' + Date.now(), email, displayName: email.split('@')[0] };
    setUser(mockUser);
    return { user: mockUser };
  };

  // Simple logout function
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