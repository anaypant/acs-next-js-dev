import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { config } from '@/lib/local-api-config';
import { Session } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session & { user: { id: string; provider?: string } };
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields (firstName, lastName, email)' },
        { status: 400 }
      );
    }

    // Construct full name for database
    const fullName = `${firstName} ${lastName}`.trim();

    // First update the database
    const dbResponse = await fetch(`${config.API_URL}/db/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Users',
        key_name: 'id',
        key_value: session.user.id,
        update_data: {
          name: fullName,
          email: email,
          phone: phone || null,
          updated_at: new Date().toISOString()
        },
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!dbResponse.ok) {
      const errorData = await dbResponse.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to update profile in database' },
        { status: dbResponse.status }
      );
    }

    // If database update was successful, update the NextAuth session
    // We'll return the updated user data to be used by the client to update the session
    const updatedUser = {
      ...session.user,
      name: fullName,
      email: email
    };

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 