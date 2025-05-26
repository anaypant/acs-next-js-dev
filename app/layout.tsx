import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from '@/app/providers/SessionProvider';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'ACS - AI-Powered Real Estate Platform',
    description: 'Transform your real estate business with AI-powered insights and automation.',
    icons: {
        icon: [
            { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
        ],
        apple: [
            { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
