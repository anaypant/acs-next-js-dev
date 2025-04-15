// src/app/api/auth/signup/route.ts
// Using Next.js App Router Route Handler syntax
import { NextResponse } from 'next/server';
import { signUpUser, signInUser } from '@/lib/cognito-server'; // Import both functions

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'Missing required fields (email, password, name)' }, { status: 400 });
        }

        // Validate password contains uppercase
        if (!/[A-Z]/.test(password)) {
            return NextResponse.json({ 
                error: 'Password must contain at least one uppercase character' 
            }, { status: 400 });
        }

        // Validate password contains numbers
        if (!/[0-9]/.test(password)) {
            return NextResponse.json({ 
                error: 'Password must contain at least one number' 
            }, { status: 400 });
        }

        // Validate password contains special characters
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return NextResponse.json({ 
                error: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)' 
            }, { status: 400 });
        }

        // Step 1: Sign up with Cognito
        const signupResult = await signUpUser(email, password, { name });

        if (!signupResult.success) {
            return NextResponse.json({
                success: false,
                error: signupResult.message || 'Sign up failed.',
            }, { status: 400 });
        }

        // Step 2: If auto-confirmed, attempt to sign in to get tokens
        let accessToken = null;
        if (signupResult.userConfirmed) {
            const signInResult = await signInUser(email, password);
            if (signInResult.success && signInResult.tokens) {
                accessToken = signInResult.tokens.AccessToken;
            }
        }

        return NextResponse.json({
            success: true,
            message: signupResult.userConfirmed
                ? 'Sign up successful! You can now log in.'
                : 'Sign up successful! Please check your email for a verification code.',
            needsConfirmation: !signupResult.userConfirmed,
            userSub: signupResult.userSub,
            session: accessToken // Only use access token
        }, { status: 201 });

    } catch (error: any) {
        console.error("API Sign Up Error:", error);
        return NextResponse.json({ error: 'An unexpected error occurred during sign up.' }, { status: 500 });
    }
}