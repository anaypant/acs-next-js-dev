import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookies = req.headers.get('cookie');
  const sessionId = cookies?.split(';')
    .find(cookie => cookie.trim().startsWith('session_id='))
    ?.split('=')[1];

  const res = await fetch(`${config.API_URL}/users/domain/verify-identity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId && { 'Cookie': `session_id=${sessionId}` })
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 