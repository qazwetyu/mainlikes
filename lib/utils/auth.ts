import { verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyAdminToken(request: NextRequest): boolean {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return false;
    }
    
    const decoded = verify(token, JWT_SECRET);
    return typeof decoded === 'object' && decoded !== null && decoded.role === 'admin';
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
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