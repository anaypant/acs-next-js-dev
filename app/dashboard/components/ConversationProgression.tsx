import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ConversationProgressionProps {
  leadData: any[];
  loading: boolean;
  timeRange: 'day' | 'week' | 'month' | 'year';
  onRefresh: () => Promise<void>;
}

interface MessageData {
  timestamp: string;
  evScore: number;
  conversationId: string;
}

interface Message {
  timestamp: string;
  ev_score: number | string;
}

const ConversationProgression: React.FC<ConversationProgressionProps> = ({ leadData, loading }) => {
  const [processedData, setProcessedData] = useState<MessageData[]>([]);

  useEffect(() => {
    if (!loading && leadData && Array.isArray(leadData)) {
      const data = processLeadData(leadData);
      setProcessedData(data);
    }
  }, [leadData, loading]);

  const processLeadData = (conversationsData: any[]): MessageData[] => {
    const allData: MessageData[] = [];

    conversationsData.forEach((conversation, index) => {
      if (conversation.messages && conversation.messages.length > 0) {
        const conversationId = `Conversation ${index + 1}`;
        
        conversation.messages.forEach((msg: Message) => {
          const ev = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          if (typeof ev === 'number' && !isNaN(ev)) {
            allData.push({
              timestamp: msg.timestamp,
              evScore: ev,
              conversationId
            });
          }
        });
      }
    });

    return allData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique conversation IDs
  const uniqueConversations = Array.from(new Set(processedData.map(d => d.conversationId)));

  return (
    <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Conversation EV Score Progression</h3>
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-600">Loading progression data...</div>
      ) : processedData.length > 0 ? (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDate}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'EV Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelFormatter={formatDate}
                formatter={(value: number, name: string) => [`EV: ${value}`, name]}
              />
              <Legend />
              {uniqueConversations.map((conversationId, index) => (
                <Line
                  key={conversationId}
                  type="monotone"
                  data={processedData.filter(d => d.conversationId === conversationId)}
                  dataKey="evScore"
                  name={conversationId}
                  stroke={`hsl(${(index * 137.5) % 360}, 70%, 40%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-600">No progression data available.</div>
      )}
    </div>
  );
};

export default ConversationProgression; 