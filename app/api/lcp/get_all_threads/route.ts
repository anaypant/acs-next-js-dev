import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, get all threads for the user
    const threadsResponse = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Threads',
        index_name: 'associated_account-index',
        key_name: 'associated_account',
        key_value: userId
      }),
    });

    console.log('threadsResponse', threadsResponse);

    const threads = await threadsResponse.json();
    console.log('threadsResponse body', threads);

    if (!threadsResponse.ok) {
      throw new Error(`Failed to fetch threads: ${threadsResponse.statusText}`);
    }

    // For each thread, fetch its associated messages
    const conversationsWithMessages = await Promise.all(
      threads.map(async (thread: any) => {
        const messagesResponse = await fetch(`${config.API_URL}db/select`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'Conversations',
            index_name: 'conversation_id-index',
            key_name: 'conversation_id',
            key_value: thread.conversation_id
          }),
        });

        if (!messagesResponse.ok) {
          throw new Error(`Failed to fetch messages for thread ${thread.conversation_id}`);
        }

        const messages = await messagesResponse.json();
        return {
          thread,
          messages,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: conversationsWithMessages,
    });

  } catch (error: any) {
    console.error('Error in get_all_threads route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
