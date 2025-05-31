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

    // First, delete all conversations with the given conversation_id
    const conversationsResponse = await fetch(`${config.API_URL}/db/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Conversations',
        key_name: 'conversation_id',
        key_value: conversation_id
      }),
      credentials: 'include',
    });

    if (!conversationsResponse.ok) {
      throw new Error(`Failed to delete conversations: ${conversationsResponse.statusText}`);
    }

    // Then, delete the thread with the given conversation_id
    const threadResponse = await fetch(`${config.API_URL}/db/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Threads',
        key_name: 'conversation_id',
        key_value: conversation_id
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
