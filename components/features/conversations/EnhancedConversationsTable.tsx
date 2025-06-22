/**
 * File: components/features/conversations/EnhancedConversationsTable.tsx
 * Purpose: Enhanced conversations table with bulk actions, advanced filtering, and sorting
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 1.1.0
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronUp, 
  ChevronDown, 
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Edit3,
  CheckCircle,
  MoreHorizontal,
  Clock,
  AlertCircle,
  Shield,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  processConversationsData,
  filterConversations,
  sortConversations,
  getStatusColor,
  getEVScoreColor,
  type ProcessedConversation,
  type SortConfig,
  type ConversationFilters
} from '@/lib/utils/conversations';
import { useConversationBulkActions } from '@/hooks/useConversationBulkActions';
import type { Conversation } from '@/types/conversation';

interface EnhancedConversationsTableProps {
  conversations: Conversation[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  className?: string;
}

export function EnhancedConversationsTable({
  conversations,
  loading = false,
  error = null,
  onRefresh,
  className
}: EnhancedConversationsTableProps) {
  const router = useRouter();
  const bulkActions = useConversationBulkActions();
  
  // Local state
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'lastMessage', direction: 'desc' });
  const [filters, setFilters] = useState<ConversationFilters>({
    status: [],
    evScoreRange: [0, 100],
    dateRange: [null, null],
    searchQuery: '',
    showPendingOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);

  // Process conversations with enhanced data
  const processedConversations = useMemo(() => {
    return processConversationsData(conversations);
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return filterConversations(processedConversations, filters);
  }, [processedConversations, filters]);

  // Sort conversations
  const sortedConversations = useMemo(() => {
    return sortConversations(filteredConversations, sortConfig);
  }, [filteredConversations, sortConfig]);

  // Sort handlers
  const handleSort = (field: SortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter handlers
  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status as any)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status as any]
    }));
  };

  const handlePendingOnlyToggle = () => {
    setFilters(prev => ({ ...prev, showPendingOnly: !prev.showPendingOnly }));
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (bulkActions.selectedIds.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${bulkActions.selectedIds.length} conversation(s)?`)) {
      await bulkActions.deleteSelected();
    }
  };

  const handleBulkComplete = async () => {
    if (bulkActions.selectedIds.length === 0) return;
    await bulkActions.markSelectedComplete();
  };

  const handleBulkAddNote = async () => {
    if (bulkActions.selectedIds.length === 0) return;
    
    const note = prompt('Enter note to add to selected conversations:');
    if (note) {
      await bulkActions.addNoteToSelected(note);
    }
  };

  // Row click handler
  const handleRowClick = (conversationId: string) => {
    if (conversationId) {
      router.push(`/dashboard/conversations/${conversationId}`);
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'flagged':
        return <Shield className="w-4 h-4" />;
      case 'spam':
        return <Mail className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-6 h-full flex items-center justify-center", className)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
          <div className="flex items-center space-x-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePendingOnlyToggle}
              className={cn(
                "px-3 py-2 text-sm rounded-lg transition-colors",
                filters.showPendingOnly
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              )}
            >
              Pending Only
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['active', 'pending', 'completed', 'flagged', 'spam'].map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors",
                    filters.status.includes(status as any)
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {bulkActions.selectedIds.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {bulkActions.selectedIds.length} conversation(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkAddNote}
                  disabled={bulkActions.isProcessing}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
                <button
                  onClick={handleBulkComplete}
                  disabled={bulkActions.isProcessing}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Complete</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkActions.isProcessing}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Table Header */}
        <div className="flex-shrink-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={bulkActions.selectedIds.length === sortedConversations.length && sortedConversations.length > 0}
                    onChange={() => bulkActions.selectAll(sortedConversations)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/4"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Lead</span>
                    {sortConfig.field === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                  Email
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/6"
                  onClick={() => handleSort('lastMessage')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Message</span>
                    {sortConfig.field === 'lastMessage' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/6"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortConfig.field === 'status' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/6"
                  onClick={() => handleSort('evScore')}
                >
                  <div className="flex items-center space-x-1">
                    <span>EV Score</span>
                    {sortConfig.field === 'evScore' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Messages
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading conversations...</span>
                    </div>
                  </td>
                </tr>
              ) : sortedConversations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No conversations found
                  </td>
                </tr>
              ) : (
                sortedConversations.map((conversation) => (
                  <tr
                    key={conversation.thread.conversation_id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap w-12">
                      <input
                        type="checkbox"
                        checked={bulkActions.selectedIds.includes(conversation.thread.conversation_id)}
                        onChange={() => bulkActions.selectConversation(conversation.thread.conversation_id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap w-1/4"
                      onClick={() => handleRowClick(conversation.thread.conversation_id)}
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {conversation.thread.lead_name || 'Unknown Lead'}
                        </div>
                        {conversation.thread.location && (
                          <div className="text-sm text-gray-500">{conversation.thread.location}</div>
                        )}
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap w-1/5"
                      onClick={() => handleRowClick(conversation.thread.conversation_id)}
                    >
                      <div className="text-sm text-gray-900">
                        {conversation.thread.client_email || 'No email'}
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap w-1/6"
                      onClick={() => handleRowClick(conversation.thread.conversation_id)}
                    >
                      <div className="text-sm text-gray-900">
                        {conversation.lastActivity}
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap w-1/6"
                      onClick={() => handleRowClick(conversation.thread.conversation_id)}
                    >
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border",
                        getStatusColor(conversation.status)
                      )}>
                        {getStatusIcon(conversation.status)}
                        <span className="ml-1">{conversation.status}</span>
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap w-1/6"
                      onClick={() => handleRowClick(conversation.thread.conversation_id)}
                    >
                      {conversation.evScore !== null ? (
                        <span className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full border",
                          getEVScoreColor(conversation.evScore)
                        )}>
                          {conversation.evScore}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 w-1/12"
                      onClick={() => handleRowClick(conversation.thread.conversation_id)}
                    >
                      {conversation.messages.length}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {sortedConversations.length} of {conversations.length} conversations</span>
          {loading && <span>Refreshing...</span>}
        </div>
      </div>
    </div>
  );
} 