import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { Session } from 'next-auth';

export async function POST(request: Request) {
  try {
    const { conversation_id } = await request.json();

    // Get session
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 404 }
      );
    }

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Get session_id from request cookies
    const cookies = request.headers.get('cookie');
    const sessionId = cookies?.split(';')
      .find(cookie => cookie.trim().startsWith('session_id='))
      ?.split('=')[1];

    // First, get the specific thread
    const threadResponse = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'Cookie': `session_id=${sessionId}` })
      },
      body: JSON.stringify({
        table_name: 'Threads',
        index_name: 'conversation_id-index',
        key_name: 'conversation_id',
        key_value: conversation_id,
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!threadResponse.ok) {
      throw new Error(`Failed to fetch thread: ${threadResponse.statusText}`);
    }

    const thread = await threadResponse.json();

    if (!thread || thread.length === 0) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    // Fetch the associated messages for this thread
    const messagesResponse = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'Cookie': `session_id=${sessionId}` })
      },
      body: JSON.stringify({
        table_name: 'Conversations',
        index_name: 'conversation_id-index',
        key_name: 'conversation_id',
        key_value: conversation_id,
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!messagesResponse.ok) {
      // log the error
      throw new Error(`Failed to fetch messages for thread ${conversation_id}`);
    }

    const messages = await messagesResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        thread: thread[0], // Since we're getting a specific thread, we take the first result
        messages,
      },
    });

  } catch (error: any) {
    console.error('Error in getThreadById route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
