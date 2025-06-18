/**
 * File: app/page.tsx
 * Purpose: Serves as the root layout component that integrates Navbar, HomePage content, and Footer with session management.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

'use client';
import React, { useEffect } from 'react';
import HomePage from './landing/page';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Home Component
 * Root layout component that manages the application's main structure and session state
 * 
 * Features:
 * - Session management and monitoring
 * - Layout composition (Navbar, HomePage, Footer)
 * - Client-side rendering
 * - Session debugging and logging
 * - Automatic redirection to dashboard for authenticated users
 * 
 * State Management:
 * - Tracks authentication session
 * - Monitors session status
 * 
 * @returns {JSX.Element} Complete application layout with session-aware components
 */
export default function Home() {
    // Get session data and status from NextAuth
    const { data: session, status } = useSession();
    const router = useRouter();

    // Handle redirection for authenticated users
    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen">
            <main>
                <Navbar/>
                <HomePage/>
                <Footer/>
            </main>
        </div>
    );
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created root layout component
 * - Implemented session management
 * - Added component composition
 * - Integrated debugging logs
 * - Set up client-side rendering
 */





