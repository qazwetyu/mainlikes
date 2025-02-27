import { NextRequest, NextResponse } from 'next/server';
import { smmServices } from '@/lib/config/smm-services';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (type) {
      // Filter services by type
      const filteredServices = Object.values(smmServices).filter(
        service => service.type === type
      );
      
      return NextResponse.json({ 
        success: true, 
        services: filteredServices
      });
    }
    
    // Return all services
    return NextResponse.json({ 
      success: true, 
      services: smmServices
    });
    
  } catch (error) {
    console.error('Error fetching SMM config:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch SMM configuration' 
    }, { status: 500 });
  }
} 