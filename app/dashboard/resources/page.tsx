"use client";

import React, { useState, useMemo, useEffect } from "react";
import { resourcesData, ResourceSection, ResourceItem } from "./resources-data";
import { Search, BookOpen, Shield, Zap, BarChart3, Users, Mail, Calendar, Settings, HelpCircle, Star, TrendingUp, Lock, Eye, Clock, Target, MessageSquare, Phone, MapPin, FileText, CheckCircle, AlertCircle, Info, ArrowLeft, Home, Sparkles, Lightbulb, Award, Bookmark, ExternalLink, ChevronRight, Play, Pause, RotateCcw, Maximize2, Minimize2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

// SIMPLIFIED RESOURCES PAGE
export default function ResourcesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('getting-started');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-white dark:from-[#0a2f1f] dark:via-[#1a3f2f] dark:to-[#0a2f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: Home },
    { id: 'core-features', label: 'Core Features', icon: Zap },
    { id: 'ai-features', label: 'AI Features', icon: Sparkles },
    { id: 'advanced-features', label: 'Advanced Features', icon: TrendingUp },
    { id: 'best-practices', label: 'Best Practices', icon: Award },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle },
    { id: 'usage-analytics', label: 'Usage Analytics', icon: BarChart3 }
  ];

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { tabs: tabs, items: [] };
    }

    const query = searchQuery.toLowerCase();
    const matchingTabs: typeof tabs = [];
    const matchingItems: Array<{ tabId: string; tabLabel: string; item: ResourceItem; itemIndex: number }> = [];

    tabs.forEach(tab => {
      const section = resourcesData.find(s => s.id === tab.id);
      if (!section) return;

      let tabHasMatches = false;
      
      // Search in section title and description
      if (section.title.toLowerCase().includes(query) || 
          (section.description && section.description.toLowerCase().includes(query))) {
        tabHasMatches = true;
      }

      // Search in content items
      section.content.forEach((item, itemIndex) => {
        let itemHasMatches = false;
        
        // Search in item title and description
        if (item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)) {
          itemHasMatches = true;
        }

        // Search in details
        if (item.details) {
          item.details.forEach(detail => {
            if (detail.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        // Search in tips
        if (item.tips) {
          item.tips.forEach(tip => {
            if (tip.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        // Search in step by step guide
        if (item.stepByStepGuide) {
          item.stepByStepGuide.forEach(step => {
            if (step.action.toLowerCase().includes(query) || 
                step.description.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        // Search in client workflow
        if (item.clientWorkflow) {
          item.clientWorkflow.forEach(workflow => {
            if (workflow.title.toLowerCase().includes(query) || 
                workflow.description.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        // Search in interactive elements
        if (item.interactiveElements) {
          item.interactiveElements.forEach(element => {
            if (element.name.toLowerCase().includes(query) || 
                element.purpose.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        // Search in common scenarios
        if (item.commonScenarios) {
          item.commonScenarios.forEach(scenario => {
            if (scenario.scenario.toLowerCase().includes(query) || 
                scenario.clientContext.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        // Search in troubleshooting
        if (item.troubleshootingSteps) {
          item.troubleshootingSteps.forEach(troubleshoot => {
            if (troubleshoot.issue.toLowerCase().includes(query)) {
              itemHasMatches = true;
            }
          });
        }

        if (itemHasMatches) {
          tabHasMatches = true;
          matchingItems.push({
            tabId: tab.id,
            tabLabel: tab.label,
            item,
            itemIndex
          });
        }
      });

      if (tabHasMatches) {
        matchingTabs.push(tab);
      }
    });

    return { tabs: matchingTabs, items: matchingItems };
  }, [searchQuery]);

  const getSectionContent = (sectionId: string) => {
    const section = resourcesData.find(s => s.id === sectionId);
    return section?.content || [];
  };

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  // If searching, show search results instead of normal content
  const isSearching = searchQuery.trim().length > 0;
  const displayTabs = isSearching ? searchResults.tabs : tabs;

  // Add CSS for animations and effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-specific styles for resources page */
      @media (max-width: 767px) {
        /* Prevent horizontal scrolling */
        body, html {
          overflow-x: hidden;
          width: 100%;
        }
        
        /* Ensure proper touch targets */
        button, a {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Improve scrolling on mobile */
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Better tap highlights */
        * {
          -webkit-tap-highlight-color: rgba(14, 101, 55, 0.1);
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px;
        }
        
        /* Ensure buttons stack properly on mobile */
        .flex-col > * {
          width: 100%;
        }
        
        /* Better spacing for mobile buttons */
        .gap-2 > * {
          margin-bottom: 0.5rem;
        }
        
        .gap-2 > *:last-child {
          margin-bottom: 0;
        }
        
        /* Mobile menu dropdown max width */
        .mobile-menu-dropdown {
          max-width: 100vw;
          width: 100%;
        }
        
        /* Ensure mobile header is always visible */
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        /* Resources page specific mobile styles */
        .resources-container {
          padding-top: 1rem;
          padding-bottom: 2rem;
        }
        
        /* Tab buttons mobile optimization */
        .tab-button {
          min-width: auto;
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Search input mobile optimization */
        .search-input {
          font-size: 16px;
          padding: 12px 16px;
        }
        
        /* Content cards mobile optimization */
        .content-card {
          margin: 0 0.5rem;
          border-radius: 12px;
        }
        
        /* Expandable content mobile optimization */
        .expandable-content {
          padding: 1rem;
        }
        
        /* Step-by-step guide mobile optimization */
        .step-guide {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .step-number {
          margin-bottom: 0.5rem;
          align-self: flex-start;
        }
        
        /* Workflow items mobile optimization */
        .workflow-item {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .workflow-time {
          margin-top: 0.5rem;
          align-self: flex-start;
        }
      }

      /* Icon Animation */
      @keyframes icon-slide-scale {
        0% { transform: scale(1) translateX(0); color: #166534; }
        60% { transform: scale(1.18) translateX(8px); color: #22c55e; }
        100% { transform: scale(1.12) translateX(6px); color: #16a34a; }
      }
      .icon-animate-hover:hover svg {
        animation: icon-slide-scale 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
      }
      .icon-animate-active:active svg {
        transform: scale(0.92) translateX(0);
        transition: transform 0.1s;
      }

      /* Triple Arrow Animation */
      @keyframes arrow-move {
        0% { transform: translateX(0); opacity: 1; }
        60% { transform: translateX(12px); opacity: 1; }
        100% { transform: translateX(20px); opacity: 0; }
      }
      .arrow-animate-hover:hover .arrow-1 {
        animation: arrow-move 0.4s cubic-bezier(0.4,0,0.2,1) 0s forwards;
      }
      .arrow-animate-hover:hover .arrow-2 {
        animation: arrow-move 0.4s cubic-bezier(0.4,0,0.2,1) 0.08s forwards;
      }
      .arrow-animate-hover:hover .arrow-3 {
        animation: arrow-move 0.4s cubic-bezier(0.4,0,0.2,1) 0.16s forwards;
      }
      .arrow-animate-hover .arrow-1,
      .arrow-animate-hover .arrow-2,
      .arrow-animate-hover .arrow-3 {
        transition: transform 0.2s, opacity 0.2s;
      }
      .arrow-animate-hover:not(:hover) .arrow-1,
      .arrow-animate-hover:not(:hover) .arrow-2,
      .arrow-animate-hover:not(:hover) .arrow-3 {
        transform: translateX(0); opacity: 1;
        animation: none;
      }

      /* Flagged Glow Effects */
      @keyframes flagged-review-glow {
        0% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.5), 0 0 10px rgba(234, 179, 8, 0.3); }
        50% { box-shadow: 0 0 10px rgba(234, 179, 8, 0.7), 0 0 20px rgba(234, 179, 8, 0.5); }
        100% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.5), 0 0 10px rgba(234, 179, 8, 0.3); }
      }
      @keyframes flagged-completion-glow {
        0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.2); }
        50% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.3); }
        100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.2); }
      }
      .flagged-review {
        animation: flagged-review-glow 2s infinite;
        border: 2px solid #eab308;
        background: linear-gradient(to right, rgba(234, 179, 8, 0.05), rgba(234, 179, 8, 0.02));
      }
      .flagged-review:hover {
        background: linear-gradient(to right, rgba(234, 179, 8, 0.08), rgba(234, 179, 8, 0.04));
      }
      .flagged-completion {
        animation: flagged-completion-glow 2s infinite;
        border: 2px solid #22c55e;
        background: linear-gradient(to right, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.02));
      }
      .flagged-completion:hover {
        background: linear-gradient(to right, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.04));
      }

      /* Pulsating effect for busy cards */
      @keyframes pulsate {
        0% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(14, 101, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0); }
      }
      .thread-busy-card {
        animation: pulsate 2s infinite;
        border: 2px solid #0e6537;
        background-color: rgba(14, 101, 55, 0.05);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-white dark:from-[#0a2f1f] dark:via-[#1a3f2f] dark:to-[#0a2f1f]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230e6537' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 resources-container">
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 mb-4 sm:mb-6 px-3 py-2 rounded-lg bg-white/80 dark:bg-[#0a2f1f]/80 border border-[#0e6537]/20 shadow hover:bg-[#e6f5ec] dark:hover:bg-[#1a3f2f] transition-colors text-[#0a5a2f] dark:text-[#38b88b] font-semibold"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#0a5a2f] dark:text-[#38b88b]" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0a2f1f] via-[#0e6537] to-[#157a42] bg-clip-text text-transparent mb-3 sm:mb-4">
            ACS Resources
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Master ACS and transform your real estate business with our comprehensive resource library
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources, features, tips, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border border-[#0e6537]/20 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537] dark:focus:ring-[#38b88b]/50 dark:focus:border-[#38b88b] transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base search-input"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
          
          {/* Search Results Summary */}
          {isSearching && (
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Found {searchResults.items.length} matching items across {searchResults.tabs.length} sections
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3 justify-center px-4">
          {displayTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isSearchResult = isSearching && searchResults.tabs.some(t => t.id === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-5 py-2 rounded-full shadow transition-all duration-200 font-semibold text-xs sm:text-sm md:text-base tab-button
                  ${isActive
                    ? 'bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white scale-105 shadow-lg'
                    : isSearchResult
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white border-2 border-[#f59e0b]'
                    : 'bg-white/90 dark:bg-gray-800/90 text-[#0a5a2f] dark:text-[#38b88b] border border-[#0e6537]/20 hover:bg-[#e6f5ec] dark:hover:bg-[#1a3f2f]'}
                `}
                style={{ minWidth: 'auto', maxWidth: '200px' }}
              >
                <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : isSearchResult ? 'text-white' : 'text-[#0a5a2f] dark:text-[#38b88b]'}`} />
                <span className="truncate">{tab.label}</span>
                {isSearchResult && !isActive && (
                  <span className="ml-1 sm:ml-2 text-xs bg-white/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {searchResults.items.filter(item => item.tabId === tab.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="space-y-4 sm:space-y-6 px-4">
          {isSearching ? (
            // Show search results
            searchResults.items.length > 0 ? (
              searchResults.items.map((result, index) => (
                <div key={`${result.tabId}-${result.itemIndex}`} className="group">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[#f59e0b]/20 dark:border-[#f59e0b]/30 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] content-card">
                    {/* Search Result Header */}
                    <div className="p-4 sm:p-6 border-b border-[#f59e0b]/20 dark:border-[#f59e0b]/30">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xs sm:text-sm bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 text-[#f59e0b] dark:text-[#fbbf24] px-2 sm:px-3 py-1 rounded-full font-medium">
                                {result.tabLabel}
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {result.item.title}
                            </h3>
                            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                              {result.item.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab(result.tabId);
                            setSearchQuery('');
                            setExpandedItems(new Set([result.itemIndex]));
                          }}
                          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white rounded-lg hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200 font-medium text-sm sm:text-base w-full sm:w-auto"
                        >
                          View Full
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <Search className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">No Results Found</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4 sm:mb-6 px-4">
                  Try searching with different keywords or browse through the tabs above.
                </p>
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Clear Search</span>
                </button>
              </div>
            )
          ) : (
            // Show normal content
            getSectionContent(activeTab).map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[#0e6537]/10 dark:border-[#0e6537]/20 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] content-card">
                  {/* Item Header */}
                  <div className="p-4 sm:p-6 border-b border-[#0e6537]/10 dark:border-[#0e6537]/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleItem(index)}
                        className="p-2 rounded-lg bg-[#0e6537]/10 dark:bg-[#0e6537]/20 hover:bg-[#0e6537]/20 dark:hover:bg-[#0e6537]/30 transition-colors self-start sm:self-auto"
                      >
                        {expandedItems.has(index) ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#0e6537] dark:text-[#157a42]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#0e6537] dark:text-[#157a42]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {expandedItems.has(index) && (
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in slide-in-from-top-2 duration-300 expandable-content">
                      {/* Details */}
                      {item.details && (
                        <div className="bg-gradient-to-r from-[#e6f5ec] to-[#f0f9f4] dark:from-[#0a2f1f]/20 dark:to-[#1a3f2f]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#0e6537]/10">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#0e6537]" />
                            Key Details
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2 sm:space-x-3">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0e6537] rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tips */}
                      {item.tips && (
                        <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] dark:from-[#92400e]/20 dark:to-[#b45309]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#f59e0b]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#f59e0b]" />
                            Pro Tips
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {item.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start space-x-2 sm:space-x-3">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#f59e0b] rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Step by Step Guide */}
                      {item.stepByStepGuide && (
                        <div className="bg-gradient-to-r from-[#d1fae5] to-[#a7f3d0] dark:from-[#064e3b]/20 dark:to-[#065f46]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#10b981]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#10b981]" />
                            Step-by-Step Guide
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            {item.stepByStepGuide.map((step, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:space-x-4 p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#10b981]/20 step-guide">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 mb-2 sm:mb-0 step-number">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">{step.action}</h5>
                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Client Workflow */}
                      {item.clientWorkflow && (
                        <div className="bg-gradient-to-r from-[#e0e7ff] to-[#c7d2fe] dark:from-[#3730a3]/20 dark:to-[#4338ca]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#6366f1]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#6366f1]" />
                            Client Workflow
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            {item.clientWorkflow.map((workflow, idx) => (
                              <div key={idx} className="p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#6366f1]/20 workflow-item">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                  <h5 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                    Step {workflow.step}: {workflow.title}
                                  </h5>
                                  <span className="text-xs bg-[#6366f1]/10 dark:bg-[#6366f1]/20 text-[#6366f1] dark:text-[#a5b4fc] px-2 py-1 rounded-full mt-1 sm:mt-0 workflow-time">
                                    {workflow.timeEstimate}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{workflow.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Elements */}
                      {item.interactiveElements && (
                        <div className="bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] dark:from-[#1e3a8a]/20 dark:to-[#1d4ed8]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#3b82f6]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#3b82f6]" />
                            Interactive Elements
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            {item.interactiveElements.map((element, idx) => (
                              <div key={idx} className="p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#3b82f6]/20">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{element.name}</h5>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">{element.purpose}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  <strong>Location:</strong> {element.location}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Common Scenarios */}
                      {item.commonScenarios && (
                        <div className="bg-gradient-to-r from-[#ccfbf1] to-[#99f6e4] dark:from-[#134e4a]/20 dark:to-[#115e59]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#14b8a6]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#14b8a6]" />
                            Common Scenarios
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            {item.commonScenarios.map((scenario, idx) => (
                              <div key={idx} className="p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#14b8a6]/20">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{scenario.scenario}</h5>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">{scenario.clientContext}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  <strong>Action:</strong> {scenario.recommendedAction}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Troubleshooting */}
                      {item.troubleshootingSteps && (
                        <div className="bg-gradient-to-r from-[#fee2e2] to-[#fecaca] dark:from-[#7f1d1d]/20 dark:to-[#991b1b]/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-[#ef4444]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center text-base sm:text-lg">
                            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#ef4444]" />
                            Troubleshooting
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            {item.troubleshootingSteps.map((troubleshoot, idx) => (
                              <div key={idx} className="p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#ef4444]/20">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{troubleshoot.issue}</h5>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                  <strong>When to contact support:</strong> {troubleshoot.whenToContactSupport}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Empty State */}
          {getSectionContent(activeTab).length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Content Coming Soon</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4 sm:mb-6 px-4">
                We're working hard to bring you comprehensive resources for this section.
              </p>
              <a 
                href="mailto:support@automatedconsultancy.com" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Contact Support</span>
              </a>
            </div>
          )}
        </div>

        {/* Need Expert Help moved to bottom */}
        <div className="mt-8 sm:mt-12 flex justify-center px-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#0e6537]/10 dark:border-[#0e6537]/20 shadow-xl max-w-xl w-full">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Need Expert Help?</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Our support team is here to help you succeed. Contact us at{' '}
                  <a 
                    href="mailto:support@automatedconsultancy.com" 
                    className="!text-[#0a5a2f] dark:text-[#38b88b] hover:text-[#0e6537] dark:hover:text-[#157a42] font-medium transition-colors"
                  >
                    support@automatedconsultancy.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 