import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div className="relative flex flex-col items-center">
      <span className="sr-only">Loading...</span>
      
      {/* Main animated container */}
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] opacity-20 animate-ping" />
        
        {/* Middle rotating ring */}
        <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-transparent border-t-[#0e6537] border-r-[#157a42] animate-spin" />
        
        {/* Inner core with gradient */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0e6537] via-[#157a42] to-[#0a5a2f] flex items-center justify-center shadow-lg">
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute -top-2 -left-2 w-3 h-3 bg-[#0e6537] rounded-full opacity-60 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#157a42] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '500ms' }} />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#0a5a2f] rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1000ms' }} />
        <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-[#0e6537] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1500ms' }} />
      </div>
      
      {/* Loading text with gradient */}
      <div className="mt-8 text-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] bg-clip-text text-transparent animate-pulse">
          Loading Dashboard
        </div>
        <div className="mt-2 text-sm text-gray-500 font-medium tracking-wide">
          Preparing your analytics...
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] rounded-full animate-pulse" 
             style={{ 
               width: '60%',
               animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
             }} />
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-[#0e6537]/5 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-tl from-[#157a42]/5 to-transparent rounded-full blur-xl" />
      </div>
    </div>
  </div>
);

export default LoadingSpinner; 