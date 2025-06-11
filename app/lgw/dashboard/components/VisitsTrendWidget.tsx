import React from 'react';

const VisitsTrendWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl border p-4 flex flex-col h-full">
      <h3 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">VISITS - TREND WIDGET 2 METRICS</h3>
      <div className="flex-1 flex items-end justify-center">
        {/* Placeholder for line chart */}
        <svg width="100%" height="90" viewBox="0 0 200 90" className="w-full h-24">
          <polyline
            fill="none"
            stroke="#0e6537"
            strokeWidth="3"
            points="0,80 20,60 40,65 60,40 80,50 100,30 120,35 140,20 160,40 180,10 200,30"
          />
          <polyline
            fill="none"
            stroke="#e57373"
            strokeWidth="2"
            points="0,70 20,50 40,55 60,60 80,40 100,50 120,45 140,30 160,50 180,20 200,40"
          />
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Visits</span>
        <span>Ad Clicks</span>
      </div>
    </div>
  );
};

export default VisitsTrendWidget; 