import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[40vh] w-full">
    <div className="relative flex flex-col items-center">
      <span className="sr-only">Loading...</span>
      <div className="w-16 h-16 rounded-full border-4 border-t-4 border-t-gradient-to-r from-[#0a5a2f] via-[#0e6537] to-[#157a42] border-t-[#0e6537] border-b-[#e6f5ec] border-l-[#bbf7d0] border-r-[#157a42] animate-spin bg-gradient-to-br from-[#e6f5ec] to-[#d8eee1]" style={{ borderTopColor: '#0e6537', borderRightColor: '#157a42', borderBottomColor: '#e6f5ec', borderLeftColor: '#bbf7d0' }} />
      <div className="mt-4 text-[#0e6537] font-semibold text-lg tracking-wide">Loading...</div>
    </div>
  </div>
);

export default LoadingSpinner; 