import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

interface Message {
  receiver: string;
  sender: string;
  subject: string;
  associated_account: string;
  conversation_id: string;
  timestamp: string;
  response_id: string;
  is_first_email: string;
  s3_location: string;
  in_reply_to: string;
  body: string;
  type: string;
  ev_score?: string;
}

interface MessagesResponse {
  items: Message[];
  count: number;
}

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

    // Extract session_id from incoming request headers
    const cookieHeader = request.headers.get('cookie');
    
    let sessionId = '';
    if (cookieHeader) {
      const match = cookieHeader.match(/session_id=([^;]+)/);
      if (match) {
        sessionId = match[1];
      } else {
        console.error('[get_all_threads] No session_id found in cookie header');
        const cookies = cookieHeader.split(';').map(c => c.trim());
      }
    } else {
      console.error('[get_all_threads] No cookie header present in request');
    }

    if (!sessionId) {
      console.error('[get_all_threads] No session_id found in request headers');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get all threads for the user
    const threadsResponse = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`
      },
      body: JSON.stringify({
        table_name: 'Threads',
        index_name: 'associated_account-index',
        key_name: 'associated_account',
        key_value: userId,
        account_id: userId,
        session_id: sessionId
      })
    });

    
    if (!threadsResponse.ok) {
      const errorText = await threadsResponse.text();
      console.error('[get_all_threads] Failed to fetch threads:', {
        status: threadsResponse.status,
        statusText: threadsResponse.statusText,
        error: errorText,
        requestUrl: `${config.API_URL}/db/select`,
        requestBody: {
          table_name: 'Threads',
          index_name: 'associated_account-index',
          key_name: 'associated_account',
          key_value: userId,
          account_id: userId,
          session_id: sessionId
        }
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

    // Get all conversation IDs from threads
    const conversationIds = threads.map(thread => thread.conversation_id);

    // Only fetch messages if there are conversation IDs
    if (conversationIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: threads.map(thread => ({
          thread,
          messages: []
        }))
      });
    }

    // Fetch all messages in a single batch request
    const messagesResponse = await fetch(`${config.API_URL}/db/batch-select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`
      },
      body: JSON.stringify({
        table_name: 'Conversations',
        index_name: 'conversation_id-index',
        key_name: 'conversation_id',
        key_values: conversationIds,
        account_id: userId,
        session: sessionId
      })
    });

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error('[get_all_threads] Failed to fetch messages:', {
        status: messagesResponse.status,
        statusText: messagesResponse.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: errorText },
        { status: 500 }
      );
    }

    // Parse the messages response
    const messagesData = await messagesResponse.json() as MessagesResponse;
    
    // Extract items from the messagesData response
    const messages = Array.isArray(messagesData?.items) ? messagesData.items : [];
    

    // Organize messages by conversation_id and sort by timestamp
    const messagesByThread = messages.reduce((acc: Record<string, Message[]>, message: Message) => {
      const threadId = message.conversation_id;
      if (!acc[threadId]) {
        acc[threadId] = [];
      }
      acc[threadId].push(message);
      return acc;
    }, {});

    // Sort messages within each thread by timestamp
    Object.keys(messagesByThread).forEach(threadId => {
      messagesByThread[threadId].sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });

    // Combine threads with their messages
    const conversationsWithMessages = threads.map(thread => ({
      thread,
      messages: messagesByThread[thread.conversation_id] || []
    }));

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
