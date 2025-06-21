/**
 * File: app/dashboard/conversations/page.tsx
 * Purpose: Conversations management page with centralized data processing and modular components
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.0.0
 */

"use client"

import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { PageLayout } from '@/components/common/Layout/PageLayout';
import { useConversationsData } from '@/hooks/useCentralizedDashboardData';
import { DataTable } from '@/components/features/dashboard/DataTable';
import { 
  ConversationsMetricCard, 
  ConversionMetricCard, 
  ResponseTimeMetricCard,
  GrowthMetricCard 
} from '@/components/features/dashboard/MetricsCard';
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

function ConversationsContent() {
  const router = useRouter();
  const { 
    conversations, 
    metrics, 
    loading, 
    error, 
    refetch 
  } = useConversationsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading conversations..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Conversations</h2>
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
            <h1 className="text-2xl font-bold text-gray-900">Active Conversations</h1>
            <p className="text-gray-600">Manage ongoing conversations and responses</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ConversationsMetricCard 
          value={metrics.activeConversations} 
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

      {/* Conversations Table */}
      <DataTable
        conversations={conversations}
        loading={loading}
        error={error}
        onRefresh={refetch}
        title="Active Conversations"
        emptyMessage="No active conversations found"
        showFilters={true}
        showSearch={true}
      />
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <PageLayout title="Conversations" showNavbar={false}>
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Conversations Error</h2>
            <p className="text-gray-600 mb-4">Something went wrong with the conversations page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      }>
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading conversations..." />}>
          <ConversationsContent />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}
