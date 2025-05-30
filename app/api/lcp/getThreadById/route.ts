import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const { conversation_id } = await request.json();

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // First, get the specific thread
    const threadResponse = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Threads',
        index_name: 'conversation_id-index',
        key_name: 'conversation_id',
        key_value: conversation_id
      }),
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
      },
      body: JSON.stringify({
        table_name: 'Conversations',
        index_name: 'conversation_id-index',
        key_name: 'conversation_id',
        key_value: conversation_id
      }),
    });

    if (!messagesResponse.ok) {
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
