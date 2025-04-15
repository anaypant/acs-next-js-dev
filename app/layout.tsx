import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Montserrat } from 'next/font/google';
import "./globals.css";
import ClientLayout from './ClientLayout';
import Script from 'next/script';

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

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0A2F1F',
};

export const metadata: Metadata = {
    title: 'ACS - AI-Powered Real Estate Platform',
    description: 'Transform your real estate business with AI-powered insights and automation.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const fontClasses = `${inter.variable} ${playfair.variable} ${montserrat.variable}`;
    
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script id="theme-script" strategy="beforeInteractive">
                    {`
                        (function() {
                            try {
                                let theme = localStorage.getItem('theme');
                                if (!theme) {
                                    theme = 'light';
                                    localStorage.setItem('theme', theme);
                                }
                                
                                // Remove any existing theme classes
                                document.documentElement.classList.remove('light', 'dark');
                                document.documentElement.classList.add(${JSON.stringify(fontClasses)});
                                
                                // Add the current theme class
                                document.documentElement.classList.add(theme);
                                document.documentElement.setAttribute('data-theme', theme);
                                
                                // Prevent flash by setting background color immediately
                                document.documentElement.style.backgroundColor = 
                                    theme === 'dark' ? '#000000' : '#ffffff';
                            } catch (e) {
                                // Fallback to light theme if localStorage is not available
                                document.documentElement.classList.add('light');
                                document.documentElement.classList.add(${JSON.stringify(fontClasses)});
                                document.documentElement.setAttribute('data-theme', 'light');
                            }
                        })();
                    `}
                </Script>
            </head>
            <body className={`font-sans antialiased min-h-screen ${fontClasses}`}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
