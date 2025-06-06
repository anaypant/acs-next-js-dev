import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${config.API_URL}/users/domain/verify-identity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 