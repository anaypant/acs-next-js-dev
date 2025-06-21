'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useAnalytics } from './AnalyticsContext';
import { MetricCard } from './MetricCard';
import { AverageEVChart } from './AverageEVChart';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';

interface AnalyticsContentProps {
  className?: string;
  showMetrics?: boolean;
  showEVChart?: boolean;
  layout?: 'grid' | 'stacked';
}

export function AnalyticsContent({ 
  className,
  showMetrics = true,
  showEVChart = true,
  layout = 'grid'
}: AnalyticsContentProps) {
  const { state } = useAnalytics();

  if (state.loading) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-64", className)}>
        <div className="text-center">
          <p className="text-red-500 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-6", className)}>
      {/* Metrics Grid */}
      {showMetrics && state.data.keyMetrics.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.data.keyMetrics.map((metric, index) => (
              <MetricCard 
                key={index} 
                title={metric.title}
                value={String(metric.value)}
                trend={metric.trend || ''}
                trendDirection={metric.trendDirection === 'neutral' ? 'up' : (metric.trendDirection || 'up')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showEVChart && state.data.evByMessage.length > 0 && (
        <div className={layout === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-6'}>
          <div className={layout === 'stacked' ? 'w-full' : ''}>
            <AverageEVChart 
              data={state.data.evByMessage}
              title="Average EV Score by Message"
              description="Shows the average engagement value score for each message in conversations"
              config={{
                height: 400,
                colors: ['#3b82f6', '#10b981'],
                showGrid: true,
                showLegend: true
              }}
            />
          </div>
          
          {/* Additional charts can be added here */}
          {layout === 'grid' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Analytics</h3>
              <p className="text-gray-600">More charts and analytics will be added here.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {(!showMetrics || state.data.keyMetrics.length === 0) && 
       (!showEVChart || state.data.evByMessage.length === 0) && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">
              There's no analytics data available for the selected filters. Try adjusting your filters or check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 