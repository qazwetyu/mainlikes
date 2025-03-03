import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for these paths to avoid authentication loops
  const bypassPaths = [
    '/admin/direct-login',
    '/admin/emergency-dashboard',
    '/super-admin',
    '/api/admin/login',
    '/api/admin/bypass-login',
    '/api/admin/debug-auth',
    '/api/admin/check-firebase',
    '/api/admin/orders-bypass'
  ];
  
  const path = request.nextUrl.pathname;
  
  // Check if we should bypass this path
  if (bypassPaths.some(bypassPath => path.startsWith(bypassPath))) {
    return NextResponse.next();
  }
  
  // For other admin routes, check auth cookie
  if (path.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token');
    
    // If no admin token, redirect to direct login
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/direct-login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*']
}; 