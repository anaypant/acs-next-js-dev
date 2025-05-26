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

/**
 * Home Component
 * Root layout component that manages the application's main structure and session state
 * 
 * Features:
 * - Session management and monitoring
 * - Layout composition (Navbar, HomePage, Footer)
 * - Client-side rendering
 * - Session debugging and logging
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

    // Debug logging for session information
    useEffect(() => {
        console.log('Homepage Session Information:');
        console.log('-------------------');
        console.log('Status:', status);
        console.log('Full Session:', session);
        if (session?.user) {
            console.log('User Details:');
            console.log('id:', session.user.id);
            console.log('email:', session.user.email);
            console.log('name:', session.user.name);
            console.log('provider:', session.user.provider);
            console.log('authType:', session.user.authType);
        }
        console.log('-------------------');
    }, [session, status]);

    return (
        <div className="min-h-screen">
            <main style={{ paddingTop: '0px' }}>
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





