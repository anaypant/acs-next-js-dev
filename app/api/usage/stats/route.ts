import { NextResponse } from 'next/server';
import { config } from '@/lib/local-api-config';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/types/auth';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1y';
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all invocations for the user
    const response = await fetch(`${config.API_URL}/db/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Invocations',
        index_name: 'associated_account-index',
        key_name: 'associated_account',
        key_value: session.user.id,
        account_id: session.user.id
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch invocations: ${response.statusText}`);
    }

    const invocations = await response.json();

    if (!Array.isArray(invocations)) {
      throw new Error('Invalid response format from invocations fetch');
    }

    // Calculate total stats
    const totalInvocations = invocations.length;
    const totalInputTokens = invocations.reduce((sum, inv) => sum + (inv.input_tokens || 0), 0);
    const totalOutputTokens = invocations.reduce((sum, inv) => sum + (inv.output_tokens || 0), 0);

    // Determine the lower bound timestamp for the selected range
    const now = Date.now();
    let fromEpoch = 0;
    switch (timeRange) {
      case '24h':
        fromEpoch = now - 24 * 60 * 60 * 1000;
        break;
      case '7d':
        fromEpoch = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '30d':
        fromEpoch = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case '1y':
      default:
        fromEpoch = now - 365 * 24 * 60 * 60 * 1000;
        break;
    }

    // Filter invocations by time range (all in ms)
    const filteredInvocations = invocations.filter(inv => inv.timestamp >= fromEpoch);

    // Helper function to get time key based on range (all in ms)
    const getTimeKey = (timestamp: number) => {
      const date = new Date(timestamp);
      switch (timeRange) {
        case '24h':
          return format(date, 'yyyy-MM-dd HH:00');
        case '7d':
        case '30d':
          return format(date, 'yyyy-MM-dd');
        default: // '1y'
          return format(date, 'yyyy-MM');
      }
    };

    // Group by thread for thread stats
    const conversationsByThread = filteredInvocations.reduce((acc, inv) => {
      const threadId = inv.conversation_id;
      if (!acc[threadId]) {
        acc[threadId] = {
          threadId,
          threadName: inv.conversation_id || 'Unnamed Thread',
          invocations: 0,
          inputTokens: 0,
          outputTokens: 0,
          conversationUrl: threadId ? `/dashboard/conversations/${threadId}` : null,
          timestamp: inv.timestamp,
          isSelected: false // Add selection state
        };
      }
      acc[threadId].invocations++;
      acc[threadId].inputTokens += inv.input_tokens || 0;
      acc[threadId].outputTokens += inv.output_tokens || 0;
      return acc;
    }, {});

    // Convert to array format and sort by invocations
    const threadStats = Object.values(conversationsByThread)
      .sort((a, b) => b.invocations - a.invocations)
      .slice(0, 5); // Only take top 5 by default

    // Group by time period for stats, including selected conversations
    const conversationsByTime = filteredInvocations.reduce((acc, inv) => {
      const timeKey = getTimeKey(inv.timestamp);
      const threadId = inv.conversation_id;
      
      if (!acc[timeKey]) {
        acc[timeKey] = {
          timeKey,
          totalInvocations: 0,
          selectedInvocations: 0,
          conversations: {} // Track invocations per conversation
        };
      }
      
      acc[timeKey].totalInvocations++;
      
      // Track invocations per conversation
      if (!acc[timeKey].conversations[threadId]) {
        acc[timeKey].conversations[threadId] = {
          threadId,
          threadName: inv.conversation_id || 'Unnamed Thread',
          invocations: 0,
          conversationUrl: threadId ? `/dashboard/conversations/${threadId}` : null
        };
      }
      acc[timeKey].conversations[threadId].invocations++;
      
      return acc;
    }, {});

    // Convert to array format for the chart and sort by time
    const timeStats = Object.entries(conversationsByTime)
      .map(([timeKey, data]) => ({
        timeKey,
        totalInvocations: data.totalInvocations,
        conversations: Object.values(data.conversations)
      }))
      .sort((a, b) => a.timeKey.localeCompare(b.timeKey));

    return NextResponse.json({
      totalInvocations,
      totalInputTokens,
      totalOutputTokens,
      invocations, // Return raw invocations with timestamps
      conversationsByThread: threadStats,
      timeStats // Include detailed time stats with conversation data
    });

  } catch (error: any) {
    console.error('Error in usage/stats route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 