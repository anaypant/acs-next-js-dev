import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LeadStage {
  name: string;
  leads: number;
  evRange: string;
  action: string;
}

interface LeadFunnelProps {
  userId: string | undefined;
  leadData: any[];
  loading: boolean;
}

const LeadFunnel: React.FC<LeadFunnelProps> = ({ userId, leadData, loading }) => {
  const [categorizedData, setCategorizedData] = useState<LeadStage[]>([]);

  useEffect(() => {
    if (!loading && leadData) {
      const data = categorizeLeads(leadData);
      setCategorizedData(data);
    } else if (!loading && !leadData) {
       setCategorizedData([]); // Handle case where leadData is null/undefined and not loading
    }
  }, [leadData, loading]); // Recalculate categorized data when leadData or loading changes

  const categorizeLeads = (conversationsData: { thread: any; messages: any[] }[]): LeadStage[] => {
    const stages: Record<string, LeadStage> = {
      Contacted: { name: 'Contacted', leads: 0, evRange: '0-19', action: 'Initial outreach' },
      Engaged: { name: 'Engaged', leads: 0, evRange: '20-39', action: 'Follow-up' },
      Toured: { name: 'Toured', leads: 0, evRange: '40-59', action: 'Schedule tour' },
      'Offer Stage': { name: 'Offer Stage', leads: 0, evRange: '60-79', action: 'Prepare offer' },
      Closed: { name: 'Closed', leads: 0, evRange: '80-100', action: 'Finalize deal' },
    };

    conversationsData.forEach(({ messages }) => {
      let highestEv = -1;
      messages.forEach((message) => {
        const ev = typeof message.ev_score === 'string' ? parseFloat(message.ev_score) : message.ev_score;
        if (typeof ev === 'number' && !isNaN(ev)) {
          highestEv = Math.max(highestEv, ev);
        }
      });

      if (highestEv >= 0) {
        if (highestEv <= 19) stages.Contacted.leads++;
        else if (highestEv <= 39) stages.Engaged.leads++;
        else if (highestEv <= 59) stages.Toured.leads++;
        else if (highestEv <= 79) stages['Offer Stage'].leads++;
        else stages.Closed.leads++;
      }
    });

    return [
        stages.Contacted,
        stages.Engaged,
        stages.Toured,
        stages['Offer Stage'],
        stages.Closed,
    ].reverse();
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Lead Journey Funnel</h3>
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-600">Loading funnel data...</div>
      ) : categorizedData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-600">No lead data found.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categorizedData} layout="vertical" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'auto']} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} leads`,
                `EV Range: ${props.payload.evRange}`,
                `Action: ${props.payload.action}`,
              ]}
            />
            <Bar dataKey="leads" fill="#0e6537" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LeadFunnel; 