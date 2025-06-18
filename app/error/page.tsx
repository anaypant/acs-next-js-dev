/**
 * File: app/error/page.tsx
 * Purpose: Error page with auth feedback
 * - Navigation and redirect functionality
 * - Automatic redirect timer
 * - Full-screen responsive layout
 * - Centered content alignment

 * - Error description text
 * - Redirect notification
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.0
 */

/**
 * Page Component
 * 
 * Features:
 * - URL parameter handling for error messages
 * - Navigation and redirect functionality
 * - Automatic redirect timer
 * - Full-screen responsive layout
 * - Centered content alignment
 * - Error message header
 * - Error description text
 * - Redirect notification * 
 * Sections:

 * - Navigation and redirect functionality
 * - Automatic redirect timer
 * - Full-screen responsive layout
 * - Centered content alignment

 * - Error description text
 * - Redirect notification * 
 * @returns {JSX.Element} Rendered component with error handling and user feedback
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SearchParamsSuspense } from '../components/SearchParamsSuspense';

// Component that uses useSearchParams - wrapped in Suspense
function ErrorPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2F1F]">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-white mb-4">
          {error === 'AccessDenied' 
            ? 'You do not have permission to access this page.'
            : 'An error occurred during authentication.'}
        </p>
        <p className="text-white/60">Redirecting to login page...</p>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <SearchParamsSuspense>
      <ErrorPageContent />
    </SearchParamsSuspense>
  );
}
/**
 * Change Log:
 * 06/15/25 - Version 1.0.0
 * - Initial version
 */

