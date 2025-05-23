'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

//
// Syntax for routing here:
// localStorage.setItem('error', JSON.stringify({ code: '404', message: "The page you're looking for doesn't exist" }));
//router.push('/404');
//

export default function NotFound() {
  const [error, setError] = useState<{ code: string; message: string }>({ code: '404', message: 'Not found' });

  useEffect(() => {
    const err = localStorage.getItem('error');
    if (err) {
      try {
        setError(JSON.parse(err));
      } catch {
        setError({ code: '404', message: 'Not found' });
      }
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