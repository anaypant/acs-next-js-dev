import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from '@/app/providers/SessionProvider';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    // themeColor: '#0A2F1F', // Removed for simplicity, can be added back
};

export const metadata: Metadata = {
    title: 'ACS - AI-Powered Real Estate Platform', // Kept existing title
    description: 'Transform your real estate business with AI-powered insights and automation.', // Kept existing description
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
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
