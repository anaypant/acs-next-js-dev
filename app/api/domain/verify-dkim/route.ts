import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      );
    }

    // Forward the request to the Lambda function
    const res = await fetch(`${config.API_URL}/users/domain/verify-dkim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Error in verify-dkim route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 