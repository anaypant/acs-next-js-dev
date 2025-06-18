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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-white dark:from-[#0a2f1f] dark:via-[#1a3f2f] dark:to-[#0a2f1f]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230e6537' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Arrow */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-white/80 dark:bg-[#0a2f1f]/80 border border-[#0e6537]/20 shadow hover:bg-[#e6f5ec] dark:hover:bg-[#1a3f2f] transition-colors text-[#0a5a2f] dark:text-[#38b88b] font-semibold"
        >
          <ArrowLeft className="w-5 h-5 text-[#0a5a2f] dark:text-[#38b88b]" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0a2f1f] via-[#0e6537] to-[#157a42] bg-clip-text text-transparent mb-4">
            ACS Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master ACS and transform your real estate business with our comprehensive resource library
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources, features, tips, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-12 py-4 border border-[#0e6537]/20 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537] dark:focus:ring-[#38b88b]/50 dark:focus:border-[#38b88b] transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Search Results Summary */}
          {isSearching && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found {searchResults.items.length} matching items across {searchResults.tabs.length} sections
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {displayTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isSearchResult = isSearching && searchResults.tabs.some(t => t.id === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full shadow transition-all duration-200 font-semibold text-base
                  ${isActive
                    ? 'bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white scale-105 shadow-lg'
                    : isSearchResult
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#f97316] text-white border-2 border-[#f59e0b]'
                    : 'bg-white/90 dark:bg-gray-800/90 text-[#0a5a2f] dark:text-[#38b88b] border border-[#0e6537]/20 hover:bg-[#e6f5ec] dark:hover:bg-[#1a3f2f]'}
                `}
                style={{ minWidth: 150 }}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'text-white' : isSearchResult ? 'text-white' : 'text-[#0a5a2f] dark:text-[#38b88b]'}`} />
                <span>{tab.label}</span>
                {isSearchResult && !isActive && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                    {searchResults.items.filter(item => item.tabId === tab.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {isSearching ? (
            // Show search results
            searchResults.items.length > 0 ? (
              searchResults.items.map((result, index) => (
                <div key={`${result.tabId}-${result.itemIndex}`} className="group">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-[#f59e0b]/20 dark:border-[#f59e0b]/30 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                    {/* Search Result Header */}
                    <div className="p-6 border-b border-[#f59e0b]/20 dark:border-[#f59e0b]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-xl flex items-center justify-center shadow-lg">
                            <Search className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm bg-[#f59e0b]/10 dark:bg-[#f59e0b]/20 text-[#f59e0b] dark:text-[#fbbf24] px-3 py-1 rounded-full font-medium">
                                {result.tabLabel}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {result.item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
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
                          className="px-4 py-2 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white rounded-lg hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200 font-medium"
                        >
                          View Full
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-[#f59e0b] to-[#f97316] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Results Found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Try searching with different keywords or browse through the tabs above.
                </p>
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white px-6 py-3 rounded-xl font-medium hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <X className="w-5 h-5" />
                  <span>Clear Search</span>
                </button>
              </div>
            )
          ) : (
            // Show normal content
            getSectionContent(activeTab).map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-[#0e6537]/10 dark:border-[#0e6537]/20 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                  {/* Item Header */}
                  <div className="p-6 border-b border-[#0e6537]/10 dark:border-[#0e6537]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-xl flex items-center justify-center shadow-lg`}>
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleItem(index)}
                        className="p-2 rounded-lg bg-[#0e6537]/10 dark:bg-[#0e6537]/20 hover:bg-[#0e6537]/20 dark:hover:bg-[#0e6537]/30 transition-colors"
                      >
                        {expandedItems.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-[#0e6537] dark:text-[#157a42]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#0e6537] dark:text-[#157a42]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {expandedItems.has(index) && (
                    <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                      {/* Details */}
                      {item.details && (
                        <div className="bg-gradient-to-r from-[#e6f5ec] to-[#f0f9f4] dark:from-[#0a2f1f]/20 dark:to-[#1a3f2f]/20 rounded-xl p-6 border border-[#0e6537]/10">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <CheckCircle className="w-5 h-5 mr-3 text-[#0e6537]" />
                            Key Details
                          </h4>
                          <ul className="space-y-3">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-[#0e6537] rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tips */}
                      {item.tips && (
                        <div className="bg-gradient-to-r from-[#fef3c7] to-[#fde68a] dark:from-[#92400e]/20 dark:to-[#b45309]/20 rounded-xl p-6 border border-[#f59e0b]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <Lightbulb className="w-5 h-5 mr-3 text-[#f59e0b]" />
                            Pro Tips
                          </h4>
                          <ul className="space-y-3">
                            {item.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-[#f59e0b] rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Step by Step Guide */}
                      {item.stepByStepGuide && (
                        <div className="bg-gradient-to-r from-[#d1fae5] to-[#a7f3d0] dark:from-[#064e3b]/20 dark:to-[#065f46]/20 rounded-xl p-6 border border-[#10b981]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <Play className="w-5 h-5 mr-3 text-[#10b981]" />
                            Step-by-Step Guide
                          </h4>
                          <div className="space-y-4">
                            {item.stepByStepGuide.map((step, idx) => (
                              <div key={idx} className="flex space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#10b981]/20">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{step.action}</h5>
                                  <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Client Workflow */}
                      {item.clientWorkflow && (
                        <div className="bg-gradient-to-r from-[#e0e7ff] to-[#c7d2fe] dark:from-[#3730a3]/20 dark:to-[#4338ca]/20 rounded-xl p-6 border border-[#6366f1]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <Clock className="w-5 h-5 mr-3 text-[#6366f1]" />
                            Client Workflow
                          </h4>
                          <div className="space-y-4">
                            {item.clientWorkflow.map((workflow, idx) => (
                              <div key={idx} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#6366f1]/20">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-gray-900 dark:text-white">
                                    Step {workflow.step}: {workflow.title}
                                  </h5>
                                  <span className="text-xs bg-[#6366f1]/10 dark:bg-[#6366f1]/20 text-[#6366f1] dark:text-[#a5b4fc] px-2 py-1 rounded-full">
                                    {workflow.timeEstimate}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{workflow.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Elements */}
                      {item.interactiveElements && (
                        <div className="bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] dark:from-[#1e3a8a]/20 dark:to-[#1d4ed8]/20 rounded-xl p-6 border border-[#3b82f6]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <Target className="w-5 h-5 mr-3 text-[#3b82f6]" />
                            Interactive Elements
                          </h4>
                          <div className="space-y-4">
                            {item.interactiveElements.map((element, idx) => (
                              <div key={idx} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#3b82f6]/20">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{element.name}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{element.purpose}</p>
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
                        <div className="bg-gradient-to-r from-[#ccfbf1] to-[#99f6e4] dark:from-[#134e4a]/20 dark:to-[#115e59]/20 rounded-xl p-6 border border-[#14b8a6]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <Users className="w-5 h-5 mr-3 text-[#14b8a6]" />
                            Common Scenarios
                          </h4>
                          <div className="space-y-4">
                            {item.commonScenarios.map((scenario, idx) => (
                              <div key={idx} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#14b8a6]/20">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{scenario.scenario}</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{scenario.clientContext}</p>
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
                        <div className="bg-gradient-to-r from-[#fee2e2] to-[#fecaca] dark:from-[#7f1d1d]/20 dark:to-[#991b1b]/20 rounded-xl p-6 border border-[#ef4444]/20">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-lg">
                            <HelpCircle className="w-5 h-5 mr-3 text-[#ef4444]" />
                            Troubleshooting
                          </h4>
                          <div className="space-y-4">
                            {item.troubleshootingSteps.map((troubleshoot, idx) => (
                              <div key={idx} className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-[#ef4444]/20">
                                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{troubleshoot.issue}</h5>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
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
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Content Coming Soon</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                We're working hard to bring you comprehensive resources for this section.
              </p>
              <a 
                href="mailto:support@automatedconsultancy.com" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#0a5a2f] to-[#157a42] text-white px-6 py-3 rounded-xl font-medium hover:from-[#0e6537] hover:to-[#157a42] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Support</span>
              </a>
            </div>
          )}
        </div>

        {/* Need Expert Help moved to bottom */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-[#0e6537]/10 dark:border-[#0e6537]/20 shadow-xl max-w-xl w-full">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Need Expert Help?</h3>
                <p className="text-gray-600 dark:text-gray-300">
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