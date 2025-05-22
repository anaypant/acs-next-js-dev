import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    console.log("api/auth/delete email:", email);

    const apiUrl = `${config.API_URL}/users/auth/delete`;
    console.log("api/auth/delete apiUrl:", apiUrl);

    // Forward cookies for authorization
    const cookie = request.headers.get('cookie');

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });
    console.log("api/auth/delete res:", res);

    // Log response for debugging
    console.log("api/auth/delete response:", await res.clone().json());

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ error: data?.error || 'Failed to delete user.' }, { status: res.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
