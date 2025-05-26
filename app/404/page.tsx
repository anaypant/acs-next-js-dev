/**
 * @file app/404/page.tsx
 * @description Custom 404 error page component that displays error information and provides navigation back to home.
 * @author Alejo Cagliolo
 * @date 2025-05-25
 * @version 1.0.0
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Example usage for routing to this error page:
 * localStorage.setItem('error', JSON.stringify({ code: '404', message: "The page you're looking for doesn't exist" }));
 * router.push('/404');
 */

/**
 * NotFound Component
 * 
 * A custom 404 error page that displays error information retrieved from localStorage
 * and provides a button to navigate back to the home page.
 * 
 * @component
 * @returns {JSX.Element} A styled error page with error details and navigation
 */
export default function NotFound() {
  // State to store error information with default 404 values
  const [error, setError] = useState<{ code: string; message: string }>({ code: '404', message: 'Not found' });

  useEffect(() => {
    // Retrieve and process error information from localStorage
    const err = localStorage.getItem('error');
    if (err) {
      try {
        setError(JSON.parse(err));
      } catch {
        // Fallback to default error if parsing fails
        setError({ code: '404', message: 'Not found' });
      }
      // Clean up localStorage after retrieving the error
      localStorage.removeItem('error');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[linear-gradient(120deg,_#fff_85%,_#ebfbf5_95%,_#b2f1e6_100%)]]">
      <h1 className="text-7xl md:text-9xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-4 drop-shadow-lg">
        Error Code: {error.code}
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-base md:text-lg text-gray-700 mb-8 max-w-md text-center mt-4">
        Error Message: {error.message}
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        Return to Home
      </Link>
    </div>
  );
}

/**
 * Change Log:
 * 
 * 2025-05-25 - Initial version
 * - Created custom 404 error page component
 * - Implemented error state management with localStorage
 * - Added responsive design with Tailwind CSS
 * - Included navigation back to home page
 */ 