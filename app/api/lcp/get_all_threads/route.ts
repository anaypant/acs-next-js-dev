import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const requestText = await request.text();
    
    let userId;
    try {
      const parsedBody = JSON.parse(requestText);
      userId = parsedBody.userId;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error('No userId provided in request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, get all threads for the user with retry logic
    const threadsResponse = await fetchWithRetry(`${config.API_URL}/db/select`, {
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

    const threads = await threadsResponse.json();

    if (!Array.isArray(threads)) {
      console.error('Invalid threads response format:', threads);
      return NextResponse.json(
        { error: 'Invalid response format from threads fetch' },
        { status: 500 }
      );
    }

    // For each thread, fetch its associated messages with retry logic
    const conversationsWithMessages = await Promise.all(
      threads.map(async (thread: any) => {
        try {
          const messagesResponse = await fetchWithRetry(`${config.API_URL}/db/select`, {
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

          const messages = await messagesResponse.json();
          
          if (!Array.isArray(messages)) {
            console.error('Invalid messages response format for thread:', thread.conversation_id);
            return {
              thread,
              messages: [],
              error: 'Invalid messages format'
            };
          }

          return {
            thread,
            messages,
          };
        } catch (error) {
          console.error('Error fetching messages for thread:', thread.conversation_id, error);
          return {
            thread,
            messages: [],
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    // Filter out any conversations that had errors
    const validConversations = conversationsWithMessages.filter(conv => !conv.error);
    const failedConversations = conversationsWithMessages.filter(conv => conv.error);

    if (failedConversations.length > 0) {
      console.warn(`Failed to fetch messages for ${failedConversations.length} threads`);
    }

    return NextResponse.json({
      success: true,
      data: validConversations,
      warnings: failedConversations.length > 0 ? {
        failedThreads: failedConversations.map(conv => ({
          conversation_id: conv.thread.conversation_id,
          error: conv.error
        }))
      } : undefined
    });

  } catch (error: any) {
    console.error('Error in get_all_threads route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error',
        retryable: error.message?.includes('fetch') || false
      },
      { status: 500 }
    );
  }
}
