import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminToken } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin is making this request
    const isAdmin = await verifyAdminToken(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const status = url.searchParams.get('status');
    
    // Create query
    let query = adminDb.collection('orders').orderBy('createdAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Execute query
    const snapshot = await query.limit(limit).get();
    
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch orders' 
    }, { status: 500 });
  }
} 