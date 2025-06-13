import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_name, attribute_name, attribute_value, is_primary_key } = body;

    // Validate required parameters
    if (!table_name || !attribute_name || attribute_value === undefined || is_primary_key === undefined) {
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
      },
      body: JSON.stringify({
        table_name,
        attribute_name,
        attribute_value,
        is_primary_key,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Get the response text first
    const responseText = await response.text();

    // Parse the response text
    let proxyResponse;
    try {
      proxyResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from API');
    }
    

    // Return the success status and deleted item info
    return NextResponse.json({
      success: true,
      deleted_item: proxyResponse.deleted_item
    });

  } catch (error) {
    console.error('Error in db/delete route:', error);
    return NextResponse.json(
      { error: 'Internal server error from db/delete route' },
      { status: 500 }
    );
  }
}
