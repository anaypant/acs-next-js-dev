import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_name, index_name, key_name, key_value } = body;

    // Validate required parameters
    if (!table_name || !index_name || !key_name || !key_value) {
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
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const proxyResponse = await response.json();
    
    console.log('proxyResponse', proxyResponse.body);
    // Parse the JSON string from the proxy integration response
    let entries;
    try {
      entries = JSON.parse(proxyResponse.body);
    } catch (parseError) {
      console.error('Error parsing proxy response body:', parseError);
      throw new Error('Invalid response format from API');
    }
    console.log('entries', entries);

    return NextResponse.json(entries);

  } catch (error) {
    console.error('Error in db/select route:', error);
    return NextResponse.json(
      { error: 'Internal server error from db/select route' },
      { status: 500 }
    );
  }
}
