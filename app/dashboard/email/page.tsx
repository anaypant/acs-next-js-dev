/**
 * File: app/dashboard/email/page.tsx
 * Purpose: Email management page with centralized data processing and modular components
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.0.0
 */

"use client"

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { PageLayout } from '@/components/common/Layout/PageLayout';
import { useEmailData } from '@/hooks/useCentralizedDashboardData';
import { DataTable } from '@/components/features/dashboard/DataTable';
import { 
  LeadsMetricCard, 
  ConversionMetricCard, 
  ResponseTimeMetricCard,
  GrowthMetricCard,
  EmailsSentMetricCard,
  ActiveDaysMetricCard,
  EngagementRateMetricCard,
  ConversationsMetricCard
} from '@/components/features/dashboard/MetricsCard';
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

function EmailContent() {
  const router = useRouter();
  const { 
    conversations, 
    metrics, 
    usage,
    loading, 
    error, 
    refetch 
  } = useEmailData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading email dashboard..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Email Dashboard</h2>
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
            <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
            <p className="text-gray-600">Manage your inbox, compose emails, and track performance</p>
          </div>
        </div>
      </div>

      {/* Email Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EmailsSentMetricCard 
          value={usage?.emailsSent || 0} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <ConversationsMetricCard 
          value={metrics.activeConversations} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <ActiveDaysMetricCard 
          value={usage?.activeDays || 0} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <ResponseTimeMetricCard 
          value={metrics.averageResponseTime} 
          trend={-5}
          trendLabel="last week"
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
        <GrowthMetricCard 
          value={metrics.monthlyGrowth} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
      </div>

      {/* Email Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Emails per Day</span>
              <span className="font-semibold">
                {usage?.emailsSent && usage?.activeDays ? Math.round(usage.emailsSent / usage.activeDays) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Email Volume</span>
              <span className="font-semibold">{usage?.emailsSent || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Days</span>
              <span className="font-semibold">{usage?.activeDays || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Response Time</span>
              <span className="font-semibold">{metrics.averageResponseTime} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold">{metrics.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Growth</span>
              <span className="font-semibold">{metrics.monthlyGrowth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations Table */}
      <DataTable
        conversations={conversations}
        loading={loading}
        error={error}
        onRefresh={refetch}
        title="Email Conversations"
        emptyMessage="No email conversations found"
        showFilters={true}
        showSearch={true}
      />
    </div>
  );
}

export default function EmailPage() {
  return (
    <PageLayout title="Email Management" showNavbar={false}>
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Email Dashboard Error</h2>
            <p className="text-gray-600 mb-4">Something went wrong with the email dashboard.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      }>
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading email dashboard..." />}>
          <EmailContent />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}

/**
 * Change Log:
 * 12/19/24 - Version 2.0.0 - Centralized Architecture
 * - Updated to use centralized data processing with useEmailData
 * - Integrated modular components (DataTable, MetricsCard)
 * - Added consistent error handling and loading states
 * - Applied CAS theme colors and styling patterns
 * - Improved layout with proper metrics and statistics sections
 * - Enhanced user experience with better visual hierarchy
 * 
 * 5/25/25 - Version 1.0.0
 * - Created email management dashboard with inbox functionality
 * - Implemented email composition and tracking features
 * - Added email templates and performance metrics
 */
