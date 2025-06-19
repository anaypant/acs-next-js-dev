/**
 * File: app/dashboard/usage/page.tsx
 * Purpose: Displays AI usage statistics and billing information
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useSession, Session } from "next-auth/react"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { format, subHours, subDays, subMonths, parse } from 'date-fns';
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar, Target, Activity, PieChart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Logo } from "@/app/utils/Logo"

interface UsageStats {
  totalInvocations: number
  totalInputTokens: number
  totalOutputTokens: number
  invocations: {
    timestamp: number;
    // ...other fields if needed
  }[];
  conversationsByThread: {
    threadId: string
    threadName: string
    invocations: number
    inputTokens: number
    outputTokens: number
    conversationUrl: string | null
    timestamp: number
    isSelected: boolean
  }[]
  timeStats: {
    timeKey: string
    totalInvocations: number
    conversations: {
      threadId: string
      threadName: string
      invocations: number
      conversationUrl: string | null
    }[]
  }[]
}

const DATE_RANGES = [
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last Year", value: "1y" },
];

function filterByDateRange(invocations: UsageStats['invocations'], range: string) {
  if (!range) return invocations;
  const now = new Date();
  let fromDate;
  switch (range) {
    case "24h":
      fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      fromDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      return invocations;
  }
  return invocations.filter((inv: { timestamp: number }) => new Date(inv.timestamp) >= fromDate);
}

function generateTimeKeys(range: string) {
  const now = new Date();
  let keys: string[] = [];
  if (range === '24h') {
    for (let i = 23; i >= 0; i--) {
      const d = subHours(now, i);
      keys.push(format(d, 'yyyy-MM-dd HH:00'));
    }
  } else if (range === '7d' || range === '30d') {
    const days = range === '7d' ? 6 : 29;
    for (let i = days; i >= 0; i--) {
      const d = subDays(now, i);
      keys.push(format(d, 'yyyy-MM-dd'));
    }
  } else if (range === '1y') {
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(now, i);
      keys.push(format(d, 'yyyy-MM'));
    }
  }
  return keys;
}

function groupInvocations(invocations: { timestamp: number }[], range: string) {
  const counts: Record<string, number> = {};
  invocations.forEach(inv => {
    const localDate = new Date(inv.timestamp);
    let key = format(localDate, 'yyyy-MM-dd'); // Default format
    if (range === '24h') {
      key = format(localDate, 'yyyy-MM-dd HH:00');
    } else if (range === '1y') {
      key = format(localDate, 'yyyy-MM');
    }
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function buildChartData(invocations: { timestamp: number }[], range: string) {
  const keys = generateTimeKeys(range);
  const counts = groupInvocations(invocations, range);
  return keys.map(key => ({
    timeKey: key,
    invocations: counts[key] || 0,
  }));
}

function safeParse(value: string, formatStr: string) {
  try {
    if (!value) return null;
    const date = parse(value, formatStr, new Date());
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

function getXAxisInterval(dateRange: string) {
  if (dateRange === '24h') return 2;      // every 3rd hour
  if (dateRange === '7d') return 1;       // every other day
  if (dateRange === '30d') return 3;      // every 4th day
  if (dateRange === '1y') return 1;       // every other month
  return 0;
}

/**
 * UsagePage Component
 * Main usage dashboard component for tracking system usage and analytics
 * 
 * Features:
 * - Usage statistics and metrics
 * - Performance analytics
 * - User activity tracking
 * - System utilization monitoring
 * 
 * @returns {JSX.Element} Complete usage dashboard view
 */
export default function UsagePage() {
  const router = useRouter()
  const { data: session, status } = useSession() as { data: (Session & { user?: { id: string } }) | null, status: string }
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "invocations",
    direction: "desc",
  })
  const [dateRange, setDateRange] = useState("7d")
  const [selectedThreads, setSelectedThreads] = useState<Set<string>>(new Set())

  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  useEffect(() => {
    const fetchUsageStats = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/usage/stats?timeRange=${dateRange}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })

        if (!response.ok) throw new Error('Failed to fetch usage stats')
        
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching usage stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsageStats()
  }, [session?.user?.id, dateRange])

  // Filter and sort conversations
  const { filteredThreads, unnamedThreadInvocations, filteredBarChartThreads, filteredTimeStats } = useMemo(() => {
    if (!stats) return { 
      filteredThreads: [], 
      unnamedThreadInvocations: 0, 
      filteredBarChartThreads: [], 
      filteredTimeStats: [] 
    };

    // Filter threads by search
    let threads = stats.conversationsByThread.filter(
      (thread) => thread.threadName !== "Unnamed Thread"
    );

    if (search) {
      threads = threads.filter(
        (thread) =>
          thread.threadName.toLowerCase().includes(search.toLowerCase()) ||
          thread.threadId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort threads
    if (sortConfig.key) {
      threads = [...threads].sort((a, b) => {
        let aValue = a[sortConfig.key as keyof typeof a];
        let bValue = b[sortConfig.key as keyof typeof b];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      });
    }

    const unnamed = stats.conversationsByThread.find(
      (thread) => thread.threadName === "Unnamed Thread"
    );

    // For BarChart: filter out unnamed threads
    const filteredBarChartThreads = stats.conversationsByThread.filter(
      (thread) => thread.threadName !== "Unnamed Thread"
    );

    // Build time stats from raw invocations
    const filteredTimeStats = buildChartData(
      filterByDateRange(stats.invocations, dateRange),
      dateRange
    );

    return {
      filteredThreads: threads,
      unnamedThreadInvocations: unnamed ? unnamed.invocations : 0,
      filteredBarChartThreads,
      filteredTimeStats,
    };
  }, [stats, search, sortConfig, dateRange]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle thread selection
  const handleThreadSelection = (threadId: string) => {
    setSelectedThreads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(threadId)) {
        newSet.delete(threadId)
      } else {
        newSet.add(threadId)
      }
      return newSet
    })
  }

  // Filter threads for chart based on selection
  const chartThreads = useMemo(() => {
    if (!stats) return []
    return stats.conversationsByThread
      .filter(thread => selectedThreads.has(thread.threadId))
      .sort((a, b) => b.invocations - a.invocations)
      .slice(0, 5)
  }, [stats, selectedThreads])

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const thread = entry.payload
            return (
              <div key={`tooltip-${thread?.threadId || index}`} className="mb-1">
                <p className="text-sm">
                  {thread?.conversationUrl ? (
                    <Link
                      href={thread.conversationUrl}
                      className="text-[#0a5a2f] hover:underline"
                    >
                      {thread.threadName}
                    </Link>
                  ) : (
                    thread?.threadName || 'Unknown Thread'
                  )}: {entry.value} invocations
                </p>
              </div>
            )
          })}
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="relative flex flex-col items-center">
          <span className="sr-only">Loading usage statistics...</span>
          
          {/* Main animated container */}
          <div className="relative mb-8">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] opacity-20 animate-ping" />
            
            {/* Middle rotating ring */}
            <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-transparent border-t-[#0e6537] border-r-[#157a42] animate-spin" />
            
            {/* Inner core with gradient */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#0e6537] via-[#157a42] to-[#0a5a2f] flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0e6537] rounded-full opacity-60 animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#157a42] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '500ms' }} />
          </div>
          
          {/* Loading text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] bg-clip-text text-transparent mb-2">
              Loading Usage Statistics
            </h2>
            <p className="text-gray-600 font-medium">
              Analyzing your AI usage patterns...
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] rounded-full animate-pulse" 
                 style={{ 
                   width: '65%',
                   animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                 }} />
          </div>
          
          {/* Animated dots */}
          <div className="flex space-x-1.5">
            <div className="w-1.5 h-1.5 bg-[#0e6537] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-[#157a42] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-[#0a5a2f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-[#0e6537]/5 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-gradient-to-tl from-[#157a42]/5 to-transparent rounded-full blur-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0a5a2f] mb-6">Usage & Billing</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AI Invocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInvocations.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Input Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInputTokens.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Output Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOutputTokens.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Usage</TabsTrigger>
          <TabsTrigger value="conversations">By Conversation</TabsTrigger>
        </TabsList>
        <div className="flex gap-2 my-2">
          {DATE_RANGES.map((range, index) => (
            <button
              key={`date-range-${range.value}`}
              onClick={() => setDateRange(range.value)}
              className={`px-3 py-1 rounded border text-sm ${dateRange === range.value ? 'bg-[#0a5a2f] text-white' : 'bg-white text-black border-gray-300'}`}
            >
              {range.label}
            </button>
          ))}
        </div>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Invocations by {dateRange === '24h' ? 'Hour' : dateRange === '7d' || dateRange === '30d' ? 'Day' : 'Month'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredTimeStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timeKey" 
                      interval={getXAxisInterval(dateRange)}
                      tickFormatter={(value) => {
                        if (!value) return '';
                        if (dateRange === '24h') {
                          const date = safeParse(value, 'yyyy-MM-dd HH:00');
                          return date ? format(date, 'h a') : value;
                        } else if (dateRange === '7d' || dateRange === '30d') {
                          const date = safeParse(value, 'yyyy-MM-dd');
                          return date ? format(date, 'MMM d') : value;
                        } else if (dateRange === '1y') {
                          const date = safeParse(value, 'yyyy-MM');
                          return date ? format(date, 'MMM yyyy') : value;
                        }
                        return value;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        if (!value) return '';
                        if (dateRange === '24h') {
                          const date = safeParse(value, 'yyyy-MM-dd HH:00');
                          return date ? format(date, 'MMM d, h a') : value;
                        } else if (dateRange === '7d' || dateRange === '30d') {
                          const date = safeParse(value, 'yyyy-MM-dd');
                          return date ? format(date, 'MMM d, yyyy') : value;
                        } else if (dateRange === '1y') {
                          const date = safeParse(value, 'yyyy-MM');
                          return date ? format(date, 'MMMM yyyy') : value;
                        }
                        return value;
                      }}
                    />
                    <Line type="monotone" dataKey="invocations" stroke="#0a5a2f" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Usage by Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartThreads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threadName" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="invocations" fill="#0a5a2f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Conversation Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 mr-2 text-sm"
                  />
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 w-8"></th>
                      <th className="text-left py-2 cursor-pointer select-none" onClick={() => handleSort("threadName")}>
                        Conversation {sortConfig.key === "threadName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th className="text-right py-2 cursor-pointer select-none" onClick={() => handleSort("invocations")}>
                        Invocations {sortConfig.key === "invocations" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th className="text-right py-2 cursor-pointer select-none" onClick={() => handleSort("inputTokens")}>
                        Input Tokens {sortConfig.key === "inputTokens" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                      <th className="text-right py-2 cursor-pointer select-none" onClick={() => handleSort("outputTokens")}>
                        Output Tokens {sortConfig.key === "outputTokens" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredThreads.map((thread, index) => (
                      <tr key={`thread-${thread.threadId || `unnamed-${index}`}`} className="border-b">
                        <td className="py-2">
                          <input
                            type="checkbox"
                            checked={selectedThreads.has(thread.threadId)}
                            onChange={() => handleThreadSelection(thread.threadId)}
                            className="h-4 w-4 rounded border-gray-300 text-[#0a5a2f] focus:ring-[#0a5a2f]"
                          />
                        </td>
                        <td className="py-2">
                          {thread.conversationUrl ? (
                            <Link
                              href={thread.conversationUrl}
                              className="hover:underline"
                              style={{ color: 'black', fontWeight: 400, textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}
                              onMouseOver={e => (e.currentTarget.style.color = '#0a5a2f')}
                              onMouseOut={e => (e.currentTarget.style.color = 'black')}
                            >
                              {thread.threadName}
                            </Link>
                          ) : (
                            <span className="text-black">{thread.threadName}</span>
                          )}
                        </td>
                        <td className="text-right py-2 text-black">{thread.invocations.toLocaleString()}</td>
                        <td className="text-right py-2 text-black">{thread.inputTokens.toLocaleString()}</td>
                        <td className="text-right py-2 text-black">{thread.outputTokens.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {unnamedThreadInvocations > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Invocations without threads: {unnamedThreadInvocations.toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 