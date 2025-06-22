/**
 * File: components/features/conversations/ConversationMetricsModal.tsx
 * Purpose: Modal component for displaying detailed conversation metrics
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 1.1.0
 */

import React from 'react';
import { X, Users, Clock, CheckCircle, AlertCircle, Shield, Mail, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateConversationMetrics, processConversationsData } from '@/lib/utils/conversations';
import type { Conversation } from '@/types/conversation';

interface ConversationMetricsModalProps {
  conversations: Conversation[];
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationMetricsModal({
  conversations,
  isOpen,
  onClose
}: ConversationMetricsModalProps) {
  if (!isOpen) return null;

  // Process conversations to get enhanced data
  const processedConversations = processConversationsData(conversations);
  const metrics = calculateConversationMetrics(processedConversations);

  const metricCards = [
    {
      title: 'Total Conversations',
      value: metrics.total,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active',
      value: metrics.active,
      icon: Clock,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: metrics.pending,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Completed',
      value: metrics.completed,
      icon: CheckCircle,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Flagged',
      value: metrics.flagged,
      icon: Shield,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Spam',
      value: metrics.spam,
      icon: Mail,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    },
    {
      title: 'Average EV Score',
      value: metrics.averageEVScore.toFixed(1),
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Conversation Metrics
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metricCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                      card.color
                    )}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>
                      <p className={cn(
                        "text-2xl font-bold",
                        card.textColor
                      )}>
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional insights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status distribution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Status Distribution
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Active', value: metrics.active, color: 'bg-green-500' },
                    { label: 'Pending', value: metrics.pending, color: 'bg-yellow-500' },
                    { label: 'Completed', value: metrics.completed, color: 'bg-blue-500' },
                    { label: 'Flagged', value: metrics.flagged, color: 'bg-red-500' },
                    { label: 'Spam', value: metrics.spam, color: 'bg-gray-500' }
                  ].map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{status.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={cn("h-2 rounded-full", status.color)}
                            style={{ 
                              width: `${metrics.total > 0 ? (status.value / metrics.total) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">
                          {status.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EV Score insights */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  EV Score Insights
                </h4>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {metrics.averageEVScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Average Score</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        {processedConversations.filter(c => c.evScore && c.evScore >= 80).length}
                      </div>
                      <div className="text-xs text-gray-500">High (80+)</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {processedConversations.filter(c => c.evScore && c.evScore >= 60 && c.evScore < 80).length}
                      </div>
                      <div className="text-xs text-gray-500">Medium (60-79)</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-red-600">
                        {processedConversations.filter(c => c.evScore && c.evScore < 60).length}
                      </div>
                      <div className="text-xs text-gray-500">Low (&lt;60)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 