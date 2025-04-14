// Last Modified: 2025-04-14 by AI Assistant

'use client';

import Link from 'next/link';

export default function AuthButtons() {
  return (
    <div className="flex space-x-4">
      <Link 
        href="/login" 
        className="px-4 py-2 text-sm text-gray-300 hover:text-[#8FA1D0] transition-colors"
      >
        Login
      </Link>
      <Link 
        href="/signup" 
        className="px-4 py-2 text-sm bg-[#8FA1D0] text-white rounded-md hover:bg-[#7A8DB8] transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}