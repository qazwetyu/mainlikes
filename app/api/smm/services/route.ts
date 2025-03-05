import { NextRequest, NextResponse } from 'next/server';
import { getSMMServices } from '../../../lib/api/smm';

export async function GET(request: NextRequest) {
  try {
    const services = await getSMMServices();
    
    return NextResponse.json({ 
      success: true, 
      services 
    });
  } catch (error) {
    console.error('Error fetching SMM services:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch SMM services' 
    }, { status: 500 });
  }
} 