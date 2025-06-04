import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ConversationProgressionProps {
  leadData: any[];
  loading: boolean;
}

interface ConversationData {
  thread: any;
  messages: Array<{
    ev_score?: number | string;
    timestamp: string;
    [key: string]: any;
  }>;
}

const ConversationProgression: React.FC<ConversationProgressionProps> = ({ leadData, loading }) => {
  const processConversationData = (conversationsData: ConversationData[]) => {
    // Filter conversations that have at least 2 messages with EV scores
    const validConversations = conversationsData.filter(conv => {
      const messagesWithEV = conv.messages.filter(msg => {
        const ev = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
        return typeof ev === 'number' && !isNaN(ev);
      });
      return messagesWithEV.length >= 2;
    });

    // Process each conversation to track EV progression
    return validConversations.map(conv => {
      // Sort messages by timestamp
      const sortedMessages = [...conv.messages].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Create data points for the chart
      const dataPoints = sortedMessages
        .filter(msg => {
          const ev = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          return typeof ev === 'number' && !isNaN(ev);
        })
        .map((msg, index) => ({
          messageNumber: index + 1,
          evScore: typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score,
          timestamp: new Date(msg.timestamp).toLocaleString(),
        }));

      return {
        conversationId: conv.thread?.conversation_id || 'Unknown',
        sourceName: conv.thread?.source_name || 'Unknown',
        progression: dataPoints,
      };
    });
  };

  const processedData = processConversationData(leadData);

  return (
    <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Conversation EV Progression</h3>
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-600">Loading progression data...</div>
      ) : processedData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-600">No conversation data available.</div>
      ) : (
        <div className="space-y-6">
          {processedData.map((conv, index) => (
            <div key={conv.conversationId} className="mb-8">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {conv.sourceName} (Conversation {index + 1})
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={conv.progression} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="messageNumber" 
                    label={{ value: 'Message Number', position: 'bottom' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ value: 'EV Score', angle: -90, position: 'left' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`EV: ${value}`, 'Score']}
                    labelFormatter={(label) => `Message ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="evScore" 
                    stroke="#0e6537" 
                    activeDot={{ r: 8 }}
                    name="EV Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationProgression; 