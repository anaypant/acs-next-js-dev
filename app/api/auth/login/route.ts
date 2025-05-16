// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { signInUser } from '@/lib/cognito-server'; // Import the server-side function

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields (email, password)' }, { status: 400 });
        }

        // Call the server-side Cognito sign-in function
        const result = await signInUser(email, password);

        if (result.success && result.tokens) {
            // Sign in successful, return tokens (don't send password back!)
            // You might want to set cookies (httpOnly) here instead of returning tokens in the body
             return NextResponse.json({
                 success: true,
                 message: 'Login successful!',
                 // Return necessary tokens - client needs IdToken and AccessToken usually
                 accessToken: result.tokens.AccessToken,
                 idToken: result.tokens.IdToken,
                 // refreshToken: result.tokens.RefreshToken, // Be careful about sending refresh token to client storage
             }, { status: 200 });
        } else if (result.challengeName) {
             // Handle sign-in challenges (MFA, etc.) - needs more frontend logic
             return NextResponse.json({
                 success: false,
                 error: result.message,
                 challengeName: result.challengeName,
                 session: result.session, // Needed to respond to the challenge
             }, { status: 401 }); // 401 Unauthorized often used for challenges
        }
        else {
            // Sign in failed, return the error message
            // Use 401 for authentication failures like wrong password/user not found/not confirmed
            return NextResponse.json({ success: false, error: result.message || 'Login failed.' }, { status: 401 });
        }

    } catch (error: any) {
        console.error("API Sign In Error:", error);
        return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
    }
}