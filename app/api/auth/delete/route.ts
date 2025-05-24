import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { Session } from 'next-auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Get current session to verify user
    const session = await getServerSession(authOptions) as Session & { user: { provider?: string; accessToken?: string } };
    if (!session || session.user.email !== email) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    console.log("api/auth/delete email:", email);

    const apiUrl = `${config.API_URL}/users/auth/delete`;
    console.log("api/auth/delete apiUrl:", apiUrl);

    // Forward only essential cookies for authorization
    const cookie = request.headers.get('cookie');
    console.log("Original cookies:", cookie);
    
    // Extract only the session_id cookie if it exists
    let sessionCookie = '';
    if (cookie) {
      const cookies = cookie.split(';');
      const sessionIdCookie = cookies.find(c => c.trim().startsWith('session_id='));
      if (sessionIdCookie) {
        sessionCookie = sessionIdCookie.trim();
      }
    }
    console.log("Forwarding cookie:", sessionCookie);

    // First, revoke Google OAuth access if the user signed in with Google
    if (session.user.provider === 'google') {
      try {
        const googleRevokeUrl = 'https://oauth2.googleapis.com/revoke';
        const token = session.user.accessToken; // You'll need to store this in your session
        
        if (token) {
          console.log("api/auth/delete token:", token);
          await fetch(googleRevokeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `token=${token}`,
          });
        }
      } catch (error) {
        console.error('Error revoking Google token:', error);
        // Continue with deletion even if token revocation fails
      }
    }

    console.log("api/auth/delete package:", );

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { cookie: sessionCookie } : {}),
      },
      body: JSON.stringify({ 
        email,
        provider: session.user.provider
      }),
      credentials: 'include',
    });
    console.log("api/auth/delete res:", res);

    // Log response for debugging
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      console.log("api/auth/delete response:", await res.clone().json());
    } else {
      console.log("api/auth/delete response:", await res.clone().text());
    }

    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText };
      }
      return NextResponse.json({ error: errorData?.error || 'Failed to delete user.' }, { status: res.status });
    }

    // Create response with cleared cookies
    const response = NextResponse.json({ 
      ok: true,
      message: 'Account deleted successfully'
    });

    // Clear all auth-related cookies with proper attributes
    const cookieOptions = {
      path: '/',
      expires: new Date(0),
      secure: true,
      sameSite: 'lax' as const,
      httpOnly: true,
      domain: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : undefined
    };

    // Clear NextAuth cookies
    response.cookies.set('next-auth.session-token', '', cookieOptions);
    response.cookies.set('next-auth.callback-url', '', cookieOptions);
    response.cookies.set('next-auth.csrf-token', '', cookieOptions);
    response.cookies.set('session_id', '', cookieOptions);

    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (err) {
    console.error('Delete account error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
