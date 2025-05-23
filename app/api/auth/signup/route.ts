import { NextResponse } from 'next/server';
import type { SignupData } from '@/app/types/auth';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

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

        // Check required fields are present
        if (!signupData.email || !signupData.provider) {
            return NextResponse.json(
                { error: 'Missing required fields (email, provider)' },
                { status: 400 }
            );
        }

        // For form-based signup, require firstName and lastName
        if (signupData.provider === 'form' && (!signupData.firstName || !signupData.lastName)) {
            return NextResponse.json(
                { error: 'First name and last name are required for form-based signup' },
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
        
        // Determine the name to use for the backend
        let name = signupData.name;
        if (!name && signupData.firstName && signupData.lastName) {
            name = `${signupData.firstName} ${signupData.lastName}`;
        }

        // If name is not provided, return error
        if (!name) {
            return NextResponse.json(
                { error: 'Name is required for signup' },
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
            body: JSON.stringify({ ...signupData, name }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.message || 'Failed to sign up' },
                { status: response.status }
            );
        }

        // If signup was successful, create a NextAuth session
        const session = await getServerSession(authOptions);
        console.log('Session after signup:', session);

        if (!session) {
            // If we couldn't create a session, still return success but with a warning
            console.warn('Failed to create session after successful signup');
            return NextResponse.json({
                ...data,
                warning: 'Signup successful but session creation failed'
            });
        }

        return NextResponse.json({
            ...data,
            session
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}