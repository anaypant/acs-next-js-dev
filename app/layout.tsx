import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat } from 'next/font/google';
import "./globals.css";
import ClientLayout from './ClientLayout';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-playfair',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-montserrat',
});

export const metadata: Metadata = {
    title: "ACS - AI-Powered Real Estate Solutions",
    description: "Transform your real estate business with AI-powered insights, automated lead scoring, and virtual staging.",
    keywords: ["real estate", "AI", "property management", "real estate technology", "property analytics"],
    authors: [{ name: "ACS Team" }],
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#0A2F1F",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body suppressHydrationWarning className="font-sans antialiased min-h-screen bg-white">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
