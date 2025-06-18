'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Container,
    Box,
    CircularProgress
} from '@mui/material';
import { SearchParamsSuspense } from '../components/SearchParamsSuspense';

// Component that uses useSearchParams - wrapped in Suspense
function VerifyEmailContent() {
    const router = useRouter();
    const { status, data: session } = useSession();

    // TODO: Email verification flow will be implemented later
    // This is a temporary redirect to dashboard
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
}

const VerifyEmailPage = () => {
    return (
        <SearchParamsSuspense>
            <VerifyEmailContent />
        </SearchParamsSuspense>
    );
};

export default VerifyEmailPage; 