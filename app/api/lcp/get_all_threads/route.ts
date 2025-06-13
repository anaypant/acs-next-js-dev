import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    // Get raw body text first for debugging
    const rawBody = await request.text();

    if (!rawBody) {
      console.error('[get_all_threads] Empty request body received');
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    // Parse the body
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error('[get_all_threads] Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { userId } = body;

    if (!userId) {
      console.error('[get_all_threads] No userId provided in request body:', body);
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all threads for the user
    const threadsResponse = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Threads',
        index_name: 'associated_account-index',
        key_name: 'associated_account',
        key_value: userId,
        account_id: userId
      }),
    });


    if (!threadsResponse.ok) {
      const errorText = await threadsResponse.text();
      console.error('[get_all_threads] Failed to fetch threads:', {
        status: threadsResponse.status,
        statusText: threadsResponse.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch threads', details: errorText },
        { status: 500 }
      );
    }

    const threads = await threadsResponse.json();
    if (!Array.isArray(threads)) {
      console.error('[get_all_threads] Invalid response format from threads fetch:', threads);
      return NextResponse.json(
        { error: 'Invalid response format from threads fetch' },
        { status: 500 }
      );
    }

    // Get messages for each thread
    const conversationsWithMessages = await Promise.all(
      threads.map(async (thread) => {
        try {
          const messagesResponse = await fetch(`${config.API_URL}/db/select`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              table_name: 'Conversations',
              index_name: 'conversation_id-index',
              key_name: 'conversation_id',
              key_value: thread.conversation_id,
              account_id: userId
            }),
          });

          const messages = messagesResponse.ok ? await messagesResponse.json() : [];
          return {
            thread,
            messages: Array.isArray(messages) ? messages : []
          };
        } catch (error) {
          console.error(`[get_all_threads] Error fetching messages for thread ${thread.conversation_id}:`, error);
          return {
            thread,
            messages: []
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: conversationsWithMessages
    });

  } catch (error) {
    console.error('[get_all_threads] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
