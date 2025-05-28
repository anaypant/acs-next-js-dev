import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use accessToken from session.user if available
  const token = session.user?.accessToken || '';
  const email = session.user?.email || '';

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/conversations`,
    {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'X-User-Email': email, // Optionally pass email if your backend supports it
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
} 