import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from '@/app/providers/SessionProvider';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import React from 'react';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'ACS - AI-Powered Real Estate Platform',
    description: 'Transform your real estate business with AI-powered insights and automation.',
    icons: {
        icon: [
            { url: '/new-logo.ico', sizes: 'any', type: 'image/x-icon' },
            { url: '/new-logo.png', sizes: '192x192', type: 'image/png' }
        ],
        apple: [
            { url: '/new-logo.png', sizes: '180x180', type: 'image/png' }
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head />
            <body>
                <ErrorBoundary>
                    <React.StrictMode>
                        <SessionProvider>
                            {children}
                        </SessionProvider>
                    </React.StrictMode>
                </ErrorBoundary>
            </body>
        </html>
    );
}
