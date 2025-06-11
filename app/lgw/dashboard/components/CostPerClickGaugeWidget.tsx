import React from 'react';

const CostPerClickGaugeWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl border p-4 flex flex-col h-full items-center">
      <h3 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">COST PER CLICK (CPC) - GAUGE WIDGET</h3>
      <div className="flex-1 flex items-center justify-center w-full">
        {/* Placeholder for gauge */}
        <svg width="80" height="50" viewBox="0 0 80 50">
          <path d="M10 40 A30 30 0 0 1 70 40" fill="none" stroke="#0e6537" strokeWidth="8" />
          <path d="M10 40 A30 30 0 0 1 40 10" fill="none" stroke="#e57373" strokeWidth="8" />
          <circle cx="40" cy="40" r="5" fill="#157a42" />
        </svg>
      </div>
      <div className="text-2xl font-bold text-[#0e6537] mt-2">$3.76</div>
    </div>
  );
};

export default CostPerClickGaugeWidget; 