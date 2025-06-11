import React from 'react';

const AdCostTrendWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl border p-4 flex flex-col h-full">
      <h3 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">AD COST - TREND WIDGET</h3>
      <div className="flex-1 flex items-end justify-center">
        {/* Placeholder for bar chart */}
        <div className="w-full h-32 flex items-end gap-1">
          {[2, 3, 6, 8, 7, 5, 5, 6, 5, 7, 6, 8].map((v, i) => (
            <div
              key={i}
              className="bg-gradient-to-b from-[#0e6537] to-[#157a42] rounded-t"
              style={{ height: `${v * 10 + 20}px`, width: '8%' }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>$2,000</span>
        <span>$5,200</span>
      </div>
    </div>
  );
};

export default AdCostTrendWidget; 