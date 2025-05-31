import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const { conversation_id, account_id, is_first_email } = await request.json();

    // Validate required parameters
    if (!conversation_id || !account_id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Conversation ID and Account ID are required' 
        },
        { status: 400 }
      );
    }

    // Make request to the config API endpoint
    const response = await fetch(`${config.API_URL}/lcp/get-llm-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        "conversation_id": conversation_id,
        "account_id": account_id,
        "is_first_email": Boolean(is_first_email)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from LLM API:', errorData);
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to get LLM response'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('LLM response:', data);
    return NextResponse.json({
      success: true,
      data
    });

  } catch (error: any) {
    console.error('Error in get_llm_response route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
