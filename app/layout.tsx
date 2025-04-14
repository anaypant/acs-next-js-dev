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
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
            <body suppressHydrationWarning className="font-sans antialiased">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
