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
import { useSession } from "next-auth/react"
import { useEffect, useState, useMemo } from "react"
import Link from "next/link"

interface UsageStats {
  totalInvocations: number
  totalInputTokens: number
  totalOutputTokens: number
  conversationsByTime: {
    timeKey: string
    invocations: number
  }[]
  conversationsByThread: {
    threadId: string
    threadName: string
    invocations: number
    inputTokens: number
    outputTokens: number
    conversationUrl: string | null
    timestamp: number
  }[]
}

const DATE_RANGES = [
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last Year", value: "1y" },
];

function filterByDateRange(invocations, range) {
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
  return invocations.filter(inv => new Date(inv.timestamp) >= fromDate);
}

export default function UsagePage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "invocations", direction: "desc" });
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    const fetchUsageStats = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/usage/stats?timeRange=${dateRange}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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

    return {
      filteredThreads: threads,
      unnamedThreadInvocations: unnamed ? unnamed.invocations : 0,
      filteredBarChartThreads,
      filteredTimeStats: stats.conversationsByTime,
    };
  }, [stats, search, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a5a2f]"></div>
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
          {DATE_RANGES.map(range => (
            <button
              key={range.value}
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
                      tickFormatter={(value) => {
                        if (dateRange === '24h') {
                          return `${value}h`;
                        } else if (dateRange === '7d' || dateRange === '30d') {
                          return value;
                        }
                        return value;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        if (dateRange === '24h') {
                          return `Hour: ${value}`;
                        } else if (dateRange === '7d' || dateRange === '30d') {
                          return `Date: ${value}`;
                        }
                        return `Month: ${value}`;
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
                  <BarChart data={filteredBarChartThreads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threadName" />
                    <YAxis />
                    <Tooltip />
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
                      <th className="text-left py-2 cursor-pointer select-none" onClick={() => handleSort("threadName")}>Conversation {sortConfig.key === "threadName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="text-right py-2 cursor-pointer select-none" onClick={() => handleSort("invocations")}>Invocations {sortConfig.key === "invocations" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="text-right py-2 cursor-pointer select-none" onClick={() => handleSort("inputTokens")}>Input Tokens {sortConfig.key === "inputTokens" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                      <th className="text-right py-2 cursor-pointer select-none" onClick={() => handleSort("outputTokens")}>Output Tokens {sortConfig.key === "outputTokens" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredThreads.map((thread, index) => (
                      <tr key={thread.threadId || `thread-${index}`} className="border-b">
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