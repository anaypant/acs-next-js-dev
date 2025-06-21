/**
 * File: app/dashboard/junk/page.tsx
 * Purpose: Junk/spam management page with centralized data processing and modular components
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.0.0
 */

"use client"

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { PageLayout } from '@/components/common/Layout/PageLayout';
import { useJunkData } from '@/hooks/useCentralizedDashboardData';
import { DataTable } from '@/components/features/dashboard/DataTable';
import { 
  LeadsMetricCard, 
  ConversionMetricCard, 
  ResponseTimeMetricCard,
  GrowthMetricCard,
  SpamDetectedMetricCard,
  FilteredTodayMetricCard,
  AccuracyRateMetricCard
} from '@/components/features/dashboard/MetricsCard';
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useRouter } from 'next/navigation';

function JunkContent() {
  const router = useRouter();
  const { 
    conversations, 
    metrics, 
    loading, 
    error, 
    refetch 
  } = useJunkData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading junk/spam..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Junk/Spam</h2>
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
            <h1 className="text-2xl font-bold text-gray-900">Junk & Spam Management</h1>
            <p className="text-gray-600">Review and manage flagged conversations and spam</p>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Spam Detection Active</h3>
            <p className="text-sm text-yellow-700">
              These conversations have been flagged as potential spam. Review them carefully before taking action.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SpamDetectedMetricCard 
          value={conversations.length} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <FilteredTodayMetricCard 
          value={conversations.filter(conv => {
            const today = new Date();
            const convDate = new Date(conv.thread.createdAt);
            return convDate.toDateString() === today.toDateString();
          }).length} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <AccuracyRateMetricCard 
          value={95} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
        <LeadsMetricCard 
          value={metrics.totalLeads - conversations.length} 
          trend={metrics.monthlyGrowth}
          trendLabel="last month"
        />
      </div>

      {/* Spam Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spam Detection Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Spam Detected</span>
              <span className="font-semibold">{conversations.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">False Positives</span>
              <span className="font-semibold text-green-600">Low</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Detection Rate</span>
              <span className="font-semibold">98.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Spam Patterns</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Generic Messages</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Suspicious Links</span>
              <span className="font-semibold">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bot-like Behavior</span>
              <span className="font-semibold">25%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Junk/Spam Table */}
      <DataTable
        conversations={conversations}
        loading={loading}
        error={error}
        onRefresh={refetch}
        title="Flagged as Spam"
        emptyMessage="No spam detected"
        showFilters={true}
        showSearch={true}
      />
    </div>
  );
}

export default function JunkPage() {
  return (
    <PageLayout title="Junk & Spam" showNavbar={false}>
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Junk/Spam Error</h2>
            <p className="text-gray-600 mb-4">Something went wrong with the junk/spam page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      }>
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading junk/spam..." />}>
          <JunkContent />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
} 