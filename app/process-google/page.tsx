'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProcessGoogle() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const processAuth = () => {
            if (status === 'authenticated' && session?.user?.authType) {
                // Set session_id cookie if sessionCookie is present
                const sessionCookie = (session as any).sessionCookie;
                if (sessionCookie) {
                    // Extract the session_id value from the Set-Cookie string
                    const match = sessionCookie.match(/session_id=([^;]+)/);
                    if (match && match[1]) {
                        // Set the cookie (cannot set HttpOnly from JS)
                        document.cookie = `session_id=${match[1]}; path=/; secure; samesite=none;`;
                    }
                }
                // Route based on auth type from session
                if (session.user.authType === 'existing') {
                    router.push('/new-user');
                } else {
                    router.push('/new-user');
                }
            } else if (status === 'unauthenticated') {
                router.push('/login');
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
