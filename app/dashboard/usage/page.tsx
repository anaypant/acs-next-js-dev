/**
 * File: app/dashboard/usage/page.tsx
 * Purpose: Usage statistics page with centralized data processing and modular components
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.0.0
 */

"use client"

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { PageLayout } from '@/components/common/Layout/PageLayout';
import { useUsageData } from '@/hooks/useCentralizedDashboardData';
import { DataTable } from '@/components/features/dashboard/DataTable';
import { 
  LeadsMetricCard, 
  ConversionMetricCard, 
  ResponseTimeMetricCard,
  GrowthMetricCard,
  EmailsSentMetricCard,
  TotalLoginsMetricCard,
  ActiveDaysMetricCard,
  AverageEmailsPerDayMetricCard,
  EngagementRateMetricCard
} from '@/components/features/dashboard/MetricsCard';
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

function UsageContent() {
  const router = useRouter();
  const { 
    conversations, 
    metrics, 
    usage,
    usageStats,
    loading, 
    error, 
    refetch 
  } = useUsageData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading usage statistics..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Usage</h2>
          <p className="text-gray-600 mb-4">{error || 'An unexpected error occurred.'}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usage Statistics</h1>
            <p className="text-gray-600">Track your platform usage and engagement metrics</p>
          </div>
        </div>
      </div>

      {/* Usage Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EmailsSentMetricCard 
          value={usage?.emailsSent || 0} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <TotalLoginsMetricCard 
          value={usage?.logins || 0} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <ActiveDaysMetricCard 
          value={usage?.activeDays || 0} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <EngagementRateMetricCard 
          value={usageStats?.engagementRate || 0} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LeadsMetricCard 
          value={metrics.totalLeads} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <ConversionMetricCard 
          value={metrics.conversionRate} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <ResponseTimeMetricCard 
          value={metrics.averageResponseTime} 
          trend={-5}
          trendLabel="last week"
        />
        <GrowthMetricCard 
          value={metrics.monthlyGrowth} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
      </div>

      {/* Usage Statistics */}
      {usageStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Emails per Day</span>
                <span className="font-semibold">{usageStats.averageEmailsPerDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Email Volume</span>
                <span className="font-semibold">{usage?.emailsSent || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-semibold">{usageStats.engagementRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Days</span>
                <span className="font-semibold">{usage?.activeDays || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversations Table */}
      <DataTable
        conversations={conversations}
        loading={loading}
        error={error}
        onRefresh={refetch}
        title="All Conversations"
        emptyMessage="No conversations found"
        showFilters={true}
        showSearch={true}
      />
    </div>
  );
}

export default function UsagePage() {
  return (
    <PageLayout title="Usage" showNavbar={false}>
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Usage Error</h2>
            <p className="text-gray-600 mb-4">Something went wrong with the usage page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      }>
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading usage statistics..." />}>
          <UsageContent />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
} 