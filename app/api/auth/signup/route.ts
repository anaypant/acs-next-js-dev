import { NextResponse } from 'next/server';
import type { SignupData } from '@/app/types/auth';
import { config } from '@/lib/config';

/**
 * Handles user signup requests
 * @param {Request} request - The incoming request object
 * @param {Object} request.body - The request body containing signup data
 * @param {string} request.body.name - User's full name
 * @param {string} request.body.email - User's email address
 * @param {string} request.body.password - User's password (required for form-based signup)
 * @param {string} request.body.provider - Signup provider ('form' | 'google')
 * @param {string} request.body.captchaToken - reCAPTCHA verification token
 * @returns {Promise<NextResponse>} Response containing signup result or error
 */
export async function POST(request: Request) {
    try {
        // Parse the request body
        const signupData: SignupData = await request.json();
        console.log('api/auth/signup/route.ts: Signup data:', signupData);

        // Check all fields are present
        if (!signupData.name || !signupData.email|| !signupData.provider) {
            return NextResponse.json(
                { error: 'Missing required fields (name, email, provider)' },
                { status: 400 }
            );
        }

        // if provider is form and no password, return error
        if (signupData.provider === 'form' && !signupData.password) {
            return NextResponse.json(
                { error: 'Password is required for form-based signup' },
                { status: 400 }
            );
        }

        // Check for reCAPTCHA token for form-based
        if (signupData.provider === 'form' && !signupData.captchaToken) {
            return NextResponse.json(
                { error: 'reCAPTCHA token is required for signup' },
                { status: 400 }
            );
        }
        
        // Forward the request to AWS API Gateway
        const response = await fetch(config.API_URL + '/users/auth/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any required API Gateway headers here
            },
            body: JSON.stringify(signupData),
        });
        
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to sign up' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}