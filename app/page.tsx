/**
 * @author Alejo Cagliolo
 * @date 2025-05-19
 * @description Main Home page component serving as the root layout with Navbar, HomePage content, and Footer components using Next.js client-side rendering.
 */

'use client';
import React from 'react';
import HomePage from './landing/page';
import Navbar from './Navbar';
import Footer from './Footer';

// Import Layout Components


export default function Home() {
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





