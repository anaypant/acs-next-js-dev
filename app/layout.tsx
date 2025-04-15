import { Metadata, Viewport } from 'next';
import { getFontClasses } from './config/fonts';
import './globals.css';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 5,
    themeColor: '#ffffff',
    colorScheme: 'light dark',
    viewportFit: 'cover',
};

export const metadata: Metadata = {
    metadataBase: new URL('https://acs-next-js.dev'),
    title: {
        template: '%s | ACS Next.js',
        default: 'ACS Next.js - Modern Web Development',
    },
    description: 'Advanced web development solutions using Next.js, featuring modern design patterns, optimized performance, and best practices for enterprise applications.',
    keywords: ['Next.js', 'React', 'TypeScript', 'Web Development', 'Enterprise Solutions', 'Performance Optimization'],
    authors: [{ name: 'ACS Development Team' }],
    creator: 'ACS Development',
    publisher: 'ACS Technology Solutions',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'ACS Next.js',
        title: 'ACS Next.js Development',
        description: 'Enterprise-grade Next.js solutions with modern design patterns and optimized performance.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'ACS Next.js Development',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@acs_development',
        creator: '@acs_development',
        title: 'ACS Next.js Development',
        description: 'Enterprise-grade Next.js solutions with modern design patterns and optimized performance.',
        images: ['/twitter-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={getFontClasses()}>
            <body>{children}</body>
        </html>
    );
}
