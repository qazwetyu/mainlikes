"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseClient } from '@/lib/firebase/clientApp';

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
  const [loading, setLoading] = useState(true);

  // Check if authenticated
  useEffect(() => {
    const unsubscribe = firebaseClient.auth.onAuthStateChanged((authUser: any) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      return await firebaseClient.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseClient.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
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