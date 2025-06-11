import React from 'react';

const TotalVisitsWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl border p-4 flex flex-col h-full">
      <h3 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">TOTAL VISITS</h3>
      <div className="text-3xl font-bold text-[#0e6537] mb-2">57,841</div>
      <div className="w-full h-8 flex items-end gap-1">
        {/* Mini area chart placeholder */}
        <div className="w-1/6 h-2 bg-[#e6f5ec] rounded-t"></div>
        <div className="w-1/6 h-4 bg-[#0e6537] rounded-t"></div>
        <div className="w-1/6 h-6 bg-[#157a42] rounded-t"></div>
        <div className="w-1/6 h-3 bg-[#0e6537] rounded-t"></div>
        <div className="w-1/6 h-5 bg-[#0e6537] rounded-t"></div>
        <div className="w-1/6 h-4 bg-[#157a42] rounded-t"></div>
      </div>
    </div>
  );
};

export default TotalVisitsWidget; 