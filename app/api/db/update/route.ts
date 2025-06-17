import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { Session } from 'next-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_name, index_name, key_name, key_value, update_data } = body;

    // Get session_id from request cookies
    const cookies = request.headers.get('cookie');
    const sessionId = cookies?.split(';')
      .find(cookie => cookie.trim().startsWith('session_id='))
      ?.split('=')[1];

    // Get session
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No authenticated user found' },
        { status: 404 }
      );
    }

    // Validate required parameters
    if (!table_name || !index_name || !key_name || !key_value || !update_data) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Construct the API URL with parameters
    const apiUrl = `${config.API_URL}/db/update`;
    
    // Make the request to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'Cookie': `session_id=${sessionId}` })
      },
      body: JSON.stringify({
        table_name,
        index_name,
        key_name,
        key_value,
        update_data,
        account_id: session.user.id,
        session_id: sessionId
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();

    // Parse the response text
    let proxyResponse;
    try {
      proxyResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from API');
    }
    

    // Return the updated_item from the response
    return NextResponse.json({
      success: true,
      updated_item: proxyResponse.updated_item
    });

  } catch (error) {
    console.error('Error in db/update route:', error);
    return NextResponse.json(
      { error: 'Internal server error from db/update route' },
      { status: 500 }
    );
  }
}