import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock implementation of admin authentication
export async function verifyAdminToken(request: NextRequest) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return false;
    }
    
    // For our static mock, just check if the token exists and has a simple format
    if (token.includes('.') && token.length > 20) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}

// Create a JWT token for admin authentication
export function createAdminToken() {
  const secret = process.env.JWT_SECRET || 'fallback-secret-for-development';
  
  return jwt.sign(
    { 
      role: 'admin',
      timestamp: Date.now() 
    },
    secret,
    { expiresIn: '7d' }
  );
}

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/verify', {
      method: 'GET',
      credentials: 'include',
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Admin auth check failed:', error);
    return false;
  }
} 