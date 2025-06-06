'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Container,
    Box,
    CircularProgress
} from '@mui/material';

const VerifyEmailPage = () => {
    const router = useRouter();
    const { status, data: session } = useSession();

    // TODO: Email verification flow will be implemented later
    // This is a temporary redirect to dashboard
    // The commented code below contains the email verification implementation
    // that will be restored when needed
    React.useEffect(() => {
        if (status === 'authenticated') {
            // If the user is new, route to new-user
            const isNewUser = (session && 'user' in session && (session.user as any)?.isNewUser) || false;
            if (isNewUser) {
                router.push('/new-user');
            } else {
                router.push('/dashboard');
            }
        }
    }, [status, session, router]);

    // Show loading state while checking session
    if (status === 'loading') {
        return (
            <Container maxWidth="xs">
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return null;
};

/* 
Original Email Verification Implementation:
This code will be restored when email verification is needed.

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';
import { goto404 } from '../utils/error';

const VerifyEmailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const email = searchParams.get('email');

    useEffect(() => {
        // If no email in URL or no session, redirect to signup
        if (!email || status === 'unauthenticated') {
            goto404('404', 'Email not found', router);
        }
    }, [email, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const verifyResponse = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code: verificationCode
                }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Failed to verify email');
            }

            router.push('/new-user');
        } catch (err: any) {
            console.error('Verification Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking session
    if (status === 'loading') {
        return (
            <Container maxWidth="xs">
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // If no email or not authenticated, don't render the form
    if (!email || status === 'unauthenticated') {
        return null;
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Verify Your Email</Typography>
                <Typography sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                    Please enter the verification code sent to {email}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="code"
                        label="Verification Code"
                        name="code"
                        autoComplete="one-time-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Verify Email'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};
*/

export default VerifyEmailPage; 