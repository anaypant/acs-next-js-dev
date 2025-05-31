import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const { conversation_id, response_body } = await request.json();

    // Validate required parameters
    if (!conversation_id || !response_body) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Conversation ID and Response Body are required' 
        },
        { status: 400 }
      );
    }

    // Make request to the config API endpoint
    const response = await fetch(`${config.API_URL}/lcp/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        conversation_id,
        response_body
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Send Email API:', errorData);
      return NextResponse.json(
        { 
          success: false,
          error: errorData.message || 'Failed to send email'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Send Email response:', data);
    return NextResponse.json({
      success: true,
      data
    });

  } catch (error: any) {
    console.error('Error in send_email route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
