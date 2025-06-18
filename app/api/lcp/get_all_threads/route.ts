import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { Session } from 'next-auth';

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
    const { userId } = await request.json();

    // Get session to verify user is authenticated
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No authenticated user found' },
        { status: 401 }
      );
    }

    // Use session user ID if userId is not provided or doesn't match
    const actualUserId = userId || session.user.id;
    if (userId && userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID mismatch' },
        { status: 401 }
      );
    }

    // Get session_id from request cookies
    const cookies = request.headers.get('cookie');
    const sessionId = cookies?.split(';')
      .find(cookie => cookie.trim().startsWith('session_id='))
      ?.split('=')[1];

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
        key_value: actualUserId,
        account_id: actualUserId,
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
          key_value: actualUserId,
          account_id: actualUserId,
          session_id: sessionId
        }
      });
      
      // If the backend returns 401, we should also return 401
      if (threadsResponse.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized - Session expired or invalid' },
          { status: 401 }
        );
      }
      
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

    // Get all messages for these conversations
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
        account_id: actualUserId,
        session_id: sessionId
      })
    });

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error('[get_all_threads] Failed to fetch messages:', {
        status: messagesResponse.status,
        statusText: messagesResponse.statusText,
        error: errorText,
        requestUrl: `${config.API_URL}/db/select`,
        requestBody: {
          table_name: 'Conversations',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationIds,
          account_id: actualUserId,
          session_id: sessionId
        }
      });
      
      // If the backend returns 401, we should also return 401
      if (messagesResponse.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized - Session expired or invalid' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch messages', details: errorText },
        { status: 500 }
      );
    }

    const messages = await messagesResponse.json();
    
    // Handle the case where messages response has { items: [...], count: ... } structure
    let messagesArray: any[];
    if (messages && typeof messages === 'object' && 'items' in messages) {
      messagesArray = messages.items;
    } else if (Array.isArray(messages)) {
      messagesArray = messages;
    } else {
      console.error('[get_all_threads] Invalid response format from messages fetch:', messages);
      return NextResponse.json(
        { error: 'Invalid response format from messages fetch' },
        { status: 500 }
      );
    }

    // Group messages by conversation_id
    const messagesByConversation = messagesArray.reduce((acc, message) => {
      const conversationId = message.conversation_id;
      if (!acc[conversationId]) {
        acc[conversationId] = [];
      }
      acc[conversationId].push(message);
      return acc;
    }, {} as Record<string, any[]>);

    // Combine threads with their messages
    const threadsWithMessages = threads.map(thread => ({
      thread,
      messages: messagesByConversation[thread.conversation_id] || []
    }));

    return NextResponse.json({
      success: true,
      data: threadsWithMessages
    });

  } catch (error) {
    console.error('[get_all_threads] Unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Internal server error from get_all_threads route',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
