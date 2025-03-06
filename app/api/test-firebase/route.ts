import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../lib/firebase-admin';
import { getApps } from 'firebase-admin/app';

export const dynamic = 'force-dynamic';

// Define operation types
type WriteOperation = {
  type: 'write';
  target?: string;
  status: 'success' | 'error';
  error?: string;
};

type ReadOperation = {
  type: 'read';
  target?: string;
  status: 'success' | 'error';
  exists?: boolean;
  data?: any;
  error?: string;
};

type Operation = WriteOperation | ReadOperation;

export async function GET(request: NextRequest) {
  try {
    // Get test parameters
    const testId = `test-${Date.now()}`;
    const orderId = request.nextUrl.searchParams.get('orderId') || `order-test-${Date.now()}`;
    const action = request.nextUrl.searchParams.get('action') || 'write';

    // Get Firebase initialization status
    const isInitialized = getApps().length > 0;
    
    // Results object
    const results = {
      timestamp: new Date().toISOString(),
      testId,
      orderId,
      action,
      isFirebaseInitialized: isInitialized,
      operations: [] as Operation[],
      success: false
    };

    if (action === 'write' || action === 'both') {
      try {
        // Try to write a test document
        const testDoc = {
          id: testId,
          orderId: orderId,
          status: 'test',
          createdAt: new Date().toISOString(),
          testData: {
            random: Math.random(),
            message: 'This is a test document'
          }
        };

        // Log the attempt
        console.log(`Attempting to write test document with ID: ${testId}`);
        
        // Write to the 'test_documents' collection
        await adminDb.collection('test_documents').doc(testId).set(testDoc);
        
        // Also write to the orders collection if requested
        if (orderId) {
          console.log(`Attempting to write test order with ID: ${orderId}`);
          await adminDb.collection('orders').doc(orderId).set({
            id: orderId,
            status: 'test-pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            testOrigin: testId
          });
          results.operations.push({
            type: 'write',
            target: `orders/${orderId}`,
            status: 'success'
          });
        }
        
        results.operations.push({
          type: 'write',
          target: `test_documents/${testId}`,
          status: 'success'
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.operations.push({
          type: 'write',
          status: 'error',
          error: errorMessage
        });
        console.error('Error writing test document:', error);
      }
    }

    if (action === 'read' || action === 'both') {
      try {
        // Try to read the test document
        console.log(`Attempting to read test document with ID: ${testId}`);
        const testDocSnapshot = await adminDb.collection('test_documents').doc(testId).get();
        
        if (testDocSnapshot.exists) {
          results.operations.push({
            type: 'read',
            target: `test_documents/${testId}`,
            status: 'success',
            exists: true,
            data: testDocSnapshot.data()
          });
        } else {
          results.operations.push({
            type: 'read',
            target: `test_documents/${testId}`,
            status: 'success',
            exists: false
          });
        }
        
        // Try to read the order document if an orderId was provided
        if (orderId) {
          console.log(`Attempting to read order with ID: ${orderId}`);
          const orderSnapshot = await adminDb.collection('orders').doc(orderId).get();
          
          if (orderSnapshot.exists) {
            results.operations.push({
              type: 'read',
              target: `orders/${orderId}`,
              status: 'success',
              exists: true,
              data: orderSnapshot.data()
            });
          } else {
            results.operations.push({
              type: 'read',
              target: `orders/${orderId}`,
              status: 'success',
              exists: false
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.operations.push({
          type: 'read',
          status: 'error',
          error: errorMessage
        });
        console.error('Error reading test document:', error);
      }
    }

    // Set overall success flag
    results.success = results.operations.every(op => op.status === 'success');

    return NextResponse.json(results);
  } catch (error) {
    console.error('Test Firebase error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 