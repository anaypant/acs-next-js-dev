import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_name, index_name, key_name, key_value } = body;

    // Validate required parameters
    if (!table_name || !index_name || !key_name || key_value === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Construct the API URL with parameters
    const apiUrl = `${config.API_URL}/db/select`;
    
    // Make the request to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name,
        index_name,
        key_name,
        key_value,
      }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not ok:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Handle the response which is an array directly
    if (!Array.isArray(data)) {
      console.error('Expected array response but got:', typeof data);
      return NextResponse.json(
        { error: 'Invalid response format - expected array' },
        { status: 500 }
      );
    }

    // Return the array directly as items
    return NextResponse.json({
      success: true,
      items: data
    });

  } catch (error) {
    console.error('Error in db/select route:', error);
    return NextResponse.json(
      { error: 'Internal server error from db/select route' },
      { status: 500 }
    );
  }
}
