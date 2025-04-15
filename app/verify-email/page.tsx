'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';

const VerifyEmailPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const email = searchParams.get('email');
    const [signupData, setSignupData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('signupData');
        if (storedData) {
            setSignupData(JSON.parse(storedData));
        } else if (!email) {
            router.push('/signup');
        }
    }, [email, router]);

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
                    code: verificationCode,
                    password: signupData.password
                }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Failed to verify email');
            }

            // Generate response email for API Gateway
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 8);
            const responseEmail = `${timestamp}-${random}@homes.automatedconsultancy.com`;

            // Create user in system with access token
            const createResponse = await fetch('/api/auth/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: signupData.email,
                    uid: signupData.userSub,
                    session: verifyData.tokens.AccessToken,
                    responseEmail
                }),
            });

            if (!createResponse.ok) {
                const createData = await createResponse.json();
                throw new Error(createData.error || 'Failed to create user profile');
            }

            localStorage.removeItem('signupData');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Verification Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!email || !signupData) {
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

export default VerifyEmailPage; 