'use client';

import React from 'react';
import AdCostTrendWidget from './components/AdCostTrendWidget';
import VisitsTrendWidget from './components/VisitsTrendWidget';
import CostPerClickGaugeWidget from './components/CostPerClickGaugeWidget';
import AdImpressionsWidget from './components/AdImpressionsWidget';
import TotalPageviewsWidget from './components/TotalPageviewsWidget';
import TotalVisitsWidget from './components/TotalVisitsWidget';

export default function DashboardContent() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header section with logo and navigation */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">ACS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0e6537] tracking-wide">LGW Dashboard</h1>
        </div>

        {/* Key metrics cards with dynamic data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm flex flex-col items-start justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                {/* Gauge Icon Placeholder */}
                <span className="text-white text-xl font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-white/80">Cost Per Click</p>
                <p className="text-2xl font-bold text-white">$3.76</p>
              </div>
            </div>
            <div className="w-full mt-2"><CostPerClickGaugeWidget /></div>
          </div>
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm flex flex-col items-start justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                {/* Impressions Icon Placeholder */}
                <span className="text-white text-xl font-bold">👁️</span>
              </div>
              <div>
                <p className="text-sm text-white/80">Ad Impressions</p>
                <p className="text-2xl font-bold text-white">35,567</p>
              </div>
            </div>
            <div className="w-full mt-2"><AdImpressionsWidget /></div>
          </div>
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm flex flex-col items-start justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                {/* Pageviews Icon Placeholder */}
                <span className="text-white text-xl font-bold">📄</span>
              </div>
              <div>
                <p className="text-sm text-white/80">Total Pageviews</p>
                <p className="text-2xl font-bold text-white">252,292</p>
              </div>
            </div>
            <div className="w-full mt-2"><TotalPageviewsWidget /></div>
          </div>
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm flex flex-col items-start justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                {/* Visits Icon Placeholder */}
                <span className="text-white text-xl font-bold">🚶</span>
              </div>
              <div>
                <p className="text-sm text-white/80">Total Visits</p>
                <p className="text-2xl font-bold text-white">57,841</p>
              </div>
            </div>
            <div className="w-full mt-2"><TotalVisitsWidget /></div>
          </div>
        </div>

        {/* Trends section with two main widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#0e6537]">Ad Cost Trend</h3>
            <AdCostTrendWidget />
          </div>
          <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#0e6537]">Visits & Ad Clicks Trend</h3>
            <VisitsTrendWidget />
          </div>
        </div>
      </div>
    </div>
  );
} 