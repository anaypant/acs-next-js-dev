import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  switch (type) {
    case '404':
      return new NextResponse(null, { status: 404 });
    case '500':
      return new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500 }
      );
    default:
      return new NextResponse(
        JSON.stringify({ error: 'Bad Request' }),
        { status: 400 }
      );
  }
} 