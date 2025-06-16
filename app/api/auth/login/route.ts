// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {email, password, name, provider} = body;

        if (provider === 'form' && !password) {
            return NextResponse.json({ error: 'Password is required for form-based login.' }, { status: 400 });
        }
        
        // if provider is google, there needs to be a name field in the body
        if (provider === 'google' && (!name || name.trim() === '')) {
            return NextResponse.json({ error: 'Name is required for google login.' }, { status: 400 });
        }
        

        const response = await fetch(config.API_URL + `/users/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, provider, name }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: 'Login failed.' }, { status: response.status });
        }

        // Get the session cookie from the API response
        const sessionCookie = response.headers.get('set-cookie');

        // Compose user fields for the frontend
        const user = {
            id: data.id || data._id,
            email: email,
            name: name,
            authType: data.authType || 'existing',
            provider: provider || 'form',
        };
        
        const nextResponse = NextResponse.json({
            success: true,
            message: 'Login successful!',
            user,
        }, { status: 200 });

        if (sessionCookie) {
            nextResponse.headers.set('set-cookie', sessionCookie);
        }

        return nextResponse;

    } catch (error: any) {
        // Keep error logging for debugging purposes
        console.error("Login API - Error:", error);
        return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
    }
}