/**
 * @author Alejo Cagliolo
 * @date 2025-05-19
 * @description Main Home page component serving as the root layout with Navbar, HomePage content, and Footer components using Next.js client-side rendering.
 */

'use client';
import React, { useEffect } from 'react';
import HomePage from './landing/page';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSession } from 'next-auth/react';

// Import Layout Components


export default function Home() {
    const { data: session, status } = useSession();

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





