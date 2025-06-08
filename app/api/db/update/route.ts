import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_name, key_name, key_value, update_data } = body;

    // Validate required parameters
    if (!table_name || !key_name || !key_value || !update_data) {
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
      },
      body: JSON.stringify({
        table_name,
        key_name,
        key_value,
        update_data,
      }),
      credentials: 'include',
    });
    const responseText = await response.text();

    console.log('Raw response:', responseText);


    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Get the response text first

    // Parse the response text
    let proxyResponse;
    try {
      proxyResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid response format from API');
    }
    
    console.log('Parsed response:', proxyResponse);

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