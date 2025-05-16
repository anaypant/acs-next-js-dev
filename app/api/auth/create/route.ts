import { NextResponse } from 'next/server';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Body:", body);
        const { email, uid, session, responseEmail } = body;

        // Validate required fields
        if (!email || !uid || !session || !responseEmail) {
            return NextResponse.json({ 
                error: 'Missing required fields (email, uid, session, responseEmail)' 
            }, { status: 400 });
        }

        // Prepare request for API Gateway
        const apiUrl = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/create`);
        const requestBody = JSON.stringify({
            email,
            uid,
            accessToken: session, // Use the Cognito session token
            responseEmail
        });

        const signer = new SignatureV4({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            region: process.env.NEXT_PUBLIC_COGNITO_REGION || '',
            service: 'execute-api',
            sha256: Sha256
        });

        const signedRequest = await signer.sign({
            method: 'POST',
            hostname: apiUrl.hostname,
            path: apiUrl.pathname,
            protocol: apiUrl.protocol,
            headers: {
                'Content-Type': 'application/json',
                host: apiUrl.hostname,
                'Authorization': `Bearer ${session}` // Add the session token as Bearer token
            },
            body: requestBody
        });

        // Make API call to gateway with signed request
        const apiResponse = await fetch(apiUrl.toString(), {
            method: 'POST',
            headers: {
                ...signedRequest.headers,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session}` // Add the session token as Bearer token
            },
            body: requestBody
        });
        
        console.log("API Response:", apiResponse);

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(errorData.message || 'Failed to create user in gateway');
        }

        const data = await apiResponse.json();

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            data
        }, { status: 201 });

    } catch (error: any) {
        console.error("API Create User Error:", error);
        return NextResponse.json({ 
            error: error.message || 'An unexpected error occurred while creating the user.' 
        }, { status: 500 });
    }
} 