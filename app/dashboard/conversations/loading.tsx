/**
 * File: app/dashboard/conversations/loading.tsx
 * Purpose: Provides a loading state component for the conversations dashboard.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Loading Component
 * Renders a beautiful loading state for the conversations dashboard
 * 
 * @returns {JSX.Element} Aesthetic loading UI with animations
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        <span className="sr-only">Loading conversations...</span>
        
        {/* Main animated container */}
        <div className="relative mb-8">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] opacity-20 animate-ping" />
          
          {/* Middle rotating ring */}
          <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-transparent border-t-[#0e6537] border-r-[#157a42] animate-spin" />
          
          {/* Inner core with gradient */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0e6537] via-[#157a42] to-[#0a5a2f] flex items-center justify-center shadow-lg">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-3 h-3 bg-[#0e6537] rounded-full opacity-60 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#157a42] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '500ms' }} />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#0a5a2f] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1000ms' }} />
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-[#0e6537] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1500ms' }} />
        </div>
        
        {/* Loading text with gradient */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] bg-clip-text text-transparent mb-3">
            Loading Conversations
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Preparing your message dashboard...
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] rounded-full animate-pulse" 
               style={{ 
                 width: '70%',
                 animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
               }} />
        </div>
        
        {/* Animated dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#0e6537] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#157a42] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#0a5a2f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-[#0e6537]/5 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-tl from-[#157a42]/5 to-transparent rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
}
  
/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created loading component placeholder
 * 12/19/25 - Enhanced version
 * - Added beautiful animated loading UI with gradients
 * - Implemented pulsing rings, floating particles, and progress indicators
 * - Added brand-consistent color scheme and typography
 */
  