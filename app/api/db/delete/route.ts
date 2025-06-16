import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { Session } from 'next-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_name, attribute_name, attribute_value, is_primary_key } = body;

    // Get session_id from request cookies
    const cookies = request.headers.get('cookie');
    const sessionId = cookies?.split(';')
      .find(cookie => cookie.trim().startsWith('session_id='))
      ?.split('=')[1];

    // Get session using getServerSession with authOptions
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 404 }
      );
    }

    // Validate required parameters
    if (!table_name || !attribute_name || attribute_value === undefined || is_primary_key === undefined) {
      console.error('[db/delete] Missing required parameters:', { table_name, attribute_name, attribute_value, is_primary_key });
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Construct the API URL with parameters
    const apiUrl = `${config.API_URL}/db/delete`;
    
    // Make the request to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'Cookie': `session_id=${sessionId}` })
      },
      body: JSON.stringify({
        table_name,
        attribute_name,
        attribute_value,
        is_primary_key,
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[db/delete] Response not ok:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: apiUrl,
        requestBody: {
          table_name,
          attribute_name,
          attribute_value: typeof attribute_value === 'string' ? attribute_value.substring(0, 10) + '...' : attribute_value,
          is_primary_key
        }
      });
      return NextResponse.json(
        { 
          error: 'Database delete failed',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    // Get the response text
    const responseText = await response.text();

    // Parse the response text
    let proxyResponse;
    try {
      proxyResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[db/delete] Failed to parse response:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from database' },
        { status: 500 }
      );
    }

    // Return the success status and deleted item info
    return NextResponse.json({
      success: true,
      deleted_item: proxyResponse.deleted_item
    });

  } catch (error) {
    console.error('[db/delete] Unexpected error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Internal server error from db/delete route',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
