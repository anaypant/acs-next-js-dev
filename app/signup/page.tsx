'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container, Box, Typography, TextField, Button, Alert, CircularProgress, Link as MuiLink
} from '@mui/material';
import Link from 'next/link';

const SignupPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '',
        name: '' 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Check if full name is provided
        const nameParts = formData.name.trim().split(/\s+/);
        if (nameParts.length < 2) {
            setError('Please provide both your first and last name');
            setLoading(false);
            return;
        }

        // Check for uppercase characters in password
        if (!/[A-Z]/.test(formData.password)) {
            setError('Password must contain at least one uppercase character');
            setLoading(false);
            return;
        }

        // Check for numeric characters in password
        if (!/[0-9]/.test(formData.password)) {
            setError('Password must contain at least one number');
            setLoading(false);
            return;
        }

        // Check for special characters in password
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
            setLoading(false);
            return;
        }

        try {
            // Step 1: Sign up with Cognito
            const signupResponse = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const signupData = await signupResponse.json();
            
            if (!signupResponse.ok) {
                if (signupData.error && signupData.error.includes('already exists')) {
                    throw new Error('An account with this email already exists. Please sign in instead.');
                }
                throw new Error(signupData.message || 'Failed to sign up');
            }

            // Store necessary data in localStorage for the verification page
            localStorage.setItem('signupData', JSON.stringify({
                email: formData.email,
                userSub: signupData.userSub,
                name: formData.name,
                password: formData.password // Store password for verification
            }));

            // Redirect to verification page with email
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            console.error("Signup Error:", err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign Up</Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        id="name" 
                        label="Full Name (First and Last Name)" 
                        name="name" 
                        autoComplete="name" 
                        autoFocus 
                        value={formData.name} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        id="email" 
                        label="Email Address" 
                        name="email" 
                        autoComplete="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        name="password" 
                        label="Password" 
                        type="password" 
                        id="password" 
                        autoComplete="new-password" 
                        value={formData.password} 
                        onChange={handleChange}
                    />
                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }} 
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <MuiLink component={Link} href="/login" variant="body2">
                            Already have an account? Sign In
                        </MuiLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default SignupPage;