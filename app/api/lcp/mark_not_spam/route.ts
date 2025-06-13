import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const { conversation_id, message_id, account_id } = await request.json();

    if (!conversation_id || !message_id || !account_id) {
        return NextResponse.json(
        { error: 'Conversation ID, Response ID, and Account ID are required' },
        { status: 400 }
      );
    }

    // Update both Threads and Conversations tables
    const updatePromises = [
      // Update Threads table
      fetch(`${config.API_URL}/db/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversation_id,
          update_data: {
            spam: 'false',
            ttl: Math.floor(Date.now() / 1000) + (1000 * 365 * 24 * 60 * 60) // 1000 years from now in Unix timestamp
          }
        }),
        credentials: 'include',
      }),
      // Update Conversations table
      fetch(`${config.API_URL}/db/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Conversations',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversation_id,
          update_data: {
            spam: 'false',
            ttl: Math.floor(Date.now() / 1000) + (1000 * 365 * 24 * 60 * 60) // 1000 years from now in Unix timestamp
          }
        }),
        credentials: 'include',
      })
    ];

    // Wait for both updates to complete
    const [threadsResponse, conversationsResponse] = await Promise.all(updatePromises);
    // log the bodies of the responses

    // Check if either update failed
    if (!threadsResponse.ok || !conversationsResponse.ok) {
      const errors = [];
      if (!threadsResponse.ok) {
        const errorText = await threadsResponse.text();
        errors.push(`Threads update failed: ${errorText}`);
      }
      if (!conversationsResponse.ok) {
        const errorText = await conversationsResponse.text();
        errors.push(`Conversations update failed: ${errorText}`);
      }
      console.error('Update spam status failed:', errors);
      throw new Error(`Failed to update spam status: ${errors.join(', ')}`);
    }

    // Generate EV for the thread
    try {
      const evResponse = await fetch(`${config.API_URL}/lcp/generate-ev`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id,
          response_id: message_id,
          account_id
        }),
        credentials: 'include',
      });   

      if (!evResponse.ok) {
        const errorData = await evResponse.json();
        console.warn('EV generation failed, but spam status was updated successfully:', {
          status: evResponse.status,
          error: errorData
        });
      }
    } catch (evError) {
      console.warn('EV generation failed, but spam status was updated successfully:', evError);
    }

    return NextResponse.json({
      success: true,
      message: 'Email marked as not spam successfully in both Threads and Conversations'
    });

  } catch (error: any) {
    console.error('Error in mark_not_spam route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 