/**
 * Authentication utilities for admin routes
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJwt } from './jwt';
import { NextRequest } from 'next/server';

/**
 * Verify the admin authentication status
 */
export async function verifyAdminAuth() {
  try {
    const token = cookies().get('admin_token')?.value;
    
    if (!token) {
      return false;
    }
    
    const verified = await verifyJwt(token);
    return Boolean(verified && verified.role === 'admin');
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

/**
 * Verify admin token from request cookies
 */
export async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return false;
    }
    
    const verified = await verifyJwt(token);
    return Boolean(verified && verified.role === 'admin');
  } catch (error) {
    console.error('Admin token verification error:', error);
    return false;
  }
}

/**
 * Get the admin user information from the token
 */
export async function getAdminUser() {
  try {
    const token = cookies().get('admin_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const verified = await verifyJwt(token);
    if (!verified || verified.role !== 'admin') {
      return null;
    }
    
    return {
      id: verified.id,
      email: verified.email,
      role: verified.role
    };
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

// Simple admin authentication
export function isAuthenticated() {
  const cookieStore = cookies();
  return !!cookieStore.get('adminToken');
}

export function requireAuth(handler: Function) {
  return async (request: Request) => {
    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return handler(request);
  };
}

export function adminLogin(username: string, password: string) {
  // In a real app, this would verify against a database
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'password';
  
  return username === validUsername && password === validPassword;
} 