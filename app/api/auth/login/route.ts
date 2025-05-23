// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {email, password, provider, name} = body;
        console.log("Login API - Request payload:", body);

        if (provider === 'form' && !password) {
            return NextResponse.json({ error: 'Password is required for form-based login.' }, { status: 400 });
        }
        
        console.log("Login API - Name:", name);
        // if provider is google, there needs to be a name field in the body
        if (provider === 'google' && (!name || name.trim() === '')) {
            console.log(name);
            return NextResponse.json({ error: 'Name is required for google login.' }, { status: 400 });
        }
        

        const response = await fetch(config.API_URL + `/users/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, provider, name }),
        });

        const data = await response.json();
        console.log('Login API - Backend response data:', data);

        if (!response.ok) {
            return NextResponse.json({ error: data || 'Login failed.' }, { status: response.status });
        }

        // Get the session cookie from the API response
        const sessionCookie = response.headers.get('set-cookie');
        console.log('Login API - Session cookie from backend:', sessionCookie);

        // Compose user fields for the frontend
        const user = {
            id: data.id || data._id || data.email,
            email: data.email,
            name: data.name,
            authType: data.authType || 'existing',
            provider: provider || 'form',
            accessToken: data.accessToken
        };
        
        console.log('Login API - Composed user object:', user);

        const nextResponse = NextResponse.json({
            success: true,
            message: 'Login successful!',
            user,
        }, { status: 200 });

        if (sessionCookie) {
            nextResponse.headers.set('Set-Cookie', sessionCookie);
        }

        return nextResponse;

    } catch (error: any) {
        console.error("Login API - Error:", error);
        return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
    }
}