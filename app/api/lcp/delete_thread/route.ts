import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { Session } from 'next-auth';

export async function POST(request: Request) {
  try {
    const { conversation_id } = await request.json();

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Get session using getServerSession with authOptions
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 401 }
      );
    }

    // Extract session_id from request cookies
    const cookieHeader = request.headers.get('cookie');
    const sessionId = cookieHeader?.split(';')
      .find(cookie => cookie.trim().startsWith('session_id='))
      ?.split('=')[1];

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 401 }
      );
    }

    // First, delete all conversations with the given conversation_id
    const url = `${config.API_URL}/db/delete`;
    const conversationsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({
        table_name: 'Conversations',
        key_name: 'conversation_id',
        key_value: conversation_id,
        index_name: 'conversation_id-index',
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!conversationsResponse.ok) {
      
      throw new Error(`Failed to delete conversations: ${conversationsResponse.statusText}`);
    }

    // Then, delete the thread with the given conversation_id
    const threadResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({
        table_name: 'Threads',
        key_name: 'conversation_id',
        key_value: conversation_id,
        index_name: 'conversation_id-index',
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!threadResponse.ok) {
      throw new Error(`Failed to delete thread: ${threadResponse.statusText}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Thread and associated conversations deleted successfully'
    });

  } catch (error: any) {
    console.error('Error in delete_thread route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
