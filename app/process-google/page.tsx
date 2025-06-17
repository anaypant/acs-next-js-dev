'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { handleSessionCookie, getAuthRedirectPath, validateSession } from '../utils/auth';
import { goto404 } from '../utils/error';

export default function ProcessGoogle() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const processAuth = async () => {
            if (status === 'authenticated') {
                try {
                    
                    // Validate session
                    if (!validateSession(session)) {
                        throw new Error('Invalid session data');
                    }

                    // Handle session cookie
                    handleSessionCookie(session as any);

                    // Determine redirect based on auth type
                    const user = (session.user as any);
                    if (user && user.authType) {
                        const redirectPath = getAuthRedirectPath(user.authType);
                        router.push(redirectPath);
                    }
                    else {
                        goto404('405', 'User not found', router);
                    }
                } catch (error) {
                    // Keep error logging for debugging purposes
                    console.error('Error processing authentication:', error);
                    router.push('/login?error=auth_processing_failed');
                }
            } else if (status === 'unauthenticated') {
                router.push('/login?error=not_authenticated');
            }
        };

        processAuth();
    }, [status, session, router]);

    // Return a minimal loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A2F1F]">
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p>Processing your login...</p>
            </div>
        </div>
    );
}
