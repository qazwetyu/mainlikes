import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  try {
    // Create a simple admin token
    const token = sign(
      { username: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Set a very permissive cookie for testing
    const cookie = serialize('admin_token', token, {
      httpOnly: false, // Not httpOnly for testing
      secure: false,   // Works on HTTP for testing
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    // Return HTML that will automatically redirect
    const html = `
      <html>
        <head>
          <title>Admin Login Bypass</title>
          <meta http-equiv="refresh" content="2;url=/admin/dashboard" />
        </head>
        <body>
          <h1>Admin Login Successful</h1>
          <p>You will be redirected to the dashboard in 2 seconds...</p>
          <p>If you are not redirected, <a href="/admin/dashboard">click here</a>.</p>
          <script>
            // Set token in localStorage for backup access
            localStorage.setItem('admin_token', '${token}');
            
            // Redirect programmatically as well
            setTimeout(() => {
              window.location.href = '/admin/dashboard';
            }, 2000);
          </script>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': cookie
      }
    });
  } catch (error) {
    console.error('Bypass login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create bypass login',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 