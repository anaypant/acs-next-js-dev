import { NextResponse } from 'next/server';
import { confirmSignUpUser } from '@/lib/cognito-server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, code, password } = body;

        if (!email || !code || !password) {
            return NextResponse.json({ 
                error: 'Email, verification code, and password are required' 
            }, { status: 400 });
        }

        const result = await confirmSignUpUser(email, password);
        
        if (!result.success) {
            return NextResponse.json({ 
                error: result.message || 'Failed to verify email' 
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified and logged in successfully',
            tokens: result.tokens
        }, { status: 200 });

    } catch (error: any) {
        console.error('Email Verification Error:', error);
        return NextResponse.json({ 
            error: error.message || 'An unexpected error occurred during verification' 
        }, { status: 500 });
    }
} 