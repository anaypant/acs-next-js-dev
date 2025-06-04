import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface LeadReportProps {
  userId: string | undefined;
  leadData: any[]; // Accept raw data from parent
  loading: boolean; // Accept loading state from parent
}

interface LeadData {
  totalLeads: number;
  newLeadsThisWeek: number;
  leadsByStage: { name: string; count: number; evRange: string }[];
  aiInsights: { hotLeads: string[]; followUps: string[]; predictions: string[] };
  dailyLeadGrowth: { day: string; count: number }[];
  performanceSummary: { avgCloseTime: string; sourceBreakdown: { source: string; count: number }[] };
}

const LeadReport: React.FC<LeadReportProps> = ({ userId, leadData, loading }) => {
  const [processedReportData, setProcessedReportData] = useState<LeadData | null>(null);
  // Remove internal loading state
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Process data only when not loading and data is available
    if (!loading && leadData && Array.isArray(leadData)) {
      const processedData = processLeadDataForReport(leadData);
      setProcessedReportData(processedData);
    } else if (!loading && (!leadData || !Array.isArray(leadData))) {
       setProcessedReportData(null); // Clear data if leadData is not valid or empty and not loading
    }
  }, [leadData, loading]); // Depend on leadData and loading props

  // Remove the internal data fetching useEffect
  // useEffect(() => {
  //   const fetchData = async () => { ... }
  //   fetchData();
  // }, [userId]);

  // Define types for the incoming conversation and message data
  interface ConversationData {
    thread: any; // Define a more specific type later
    messages: Array<{ ev_score?: number | string; timestamp: string; [key: string]: any }>; // Define a more specific type later
  }

  const processLeadDataForReport = (conversationsData: ConversationData[]): LeadData => {
    const totalLeads = conversationsData.length;

    // Calculate New Leads This Week and Daily Lead Growth for the last 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    const dailyCounts: Record<string, number> = {}; // { 'YYYY-MM-DD': count }
    let newLeadsThisWeek = 0; // Count conversations started in the last 7 *full* days

    conversationsData.forEach(({ messages }) => {
      if (messages.length > 0) {
        const firstMessageTimestamp = new Date(messages[0].timestamp);
        firstMessageTimestamp.setHours(0, 0, 0, 0); // Normalize message timestamp to midnight

        // Calculate date 7 days ago (inclusive of the start of that day)
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6); // Count today and the 6 previous days

        if (firstMessageTimestamp >= sevenDaysAgo && firstMessageTimestamp <= today) {
             newLeadsThisWeek++;

            const dateKey = firstMessageTimestamp.toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
        }
      }
    });

    // Generate dailyLeadGrowth array for the last 7 days
    const dailyLeadGrowth: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
        const dateKey = date.toISOString().split('T')[0];
        dailyLeadGrowth.push({ day: dayOfWeek, count: dailyCounts[dateKey] || 0 });
    }

    const leadsByStage: { name: string; count: number; evRange: string }[] = [
      { name: 'Contacted', count: 0, evRange: '0-19' },
      { name: 'Engaged', count: 0, evRange: '20-39' },
      { name: 'Toured', count: 0, evRange: '40-59' },
      { name: 'Offer Stage', count: 0, evRange: '60-79' },
      { name: 'Closed', count: 0, evRange: '80-100' },
    ];

    // Basic categorization by highest EV score
    conversationsData.forEach(({ messages }) => {
      let highestEv = -1;
      messages.forEach((message) => {
        const ev = typeof message.ev_score === 'string' ? parseFloat(message.ev_score) : message.ev_score;
        if (typeof ev === 'number' && !isNaN(ev)) {
          highestEv = Math.max(highestEv, ev);
        }
      });

      if (highestEv >= 0) {
        if (highestEv <= 19) leadsByStage[0].count++;
        else if (highestEv <= 39) leadsByStage[1].count++;
        else if (highestEv <= 59) leadsByStage[2].count++;
        else if (highestEv <= 79) leadsByStage[3].count++;
        else leadsByStage[4].count++;
      }
    });

    // --- Placeholder data for AI Insights and Performance Summary ---
    // You will need to implement logic to populate these based on your actual data processing needs
     const aiInsights = { 
        hotLeads: ['Lead A (EV 85)', 'Lead B (EV 90)'], // Example structure
        followUps: ['Lead C (Last contact 3 days ago)', 'Lead D (No response)'], // Example structure
        predictions: ['Lead E likely to close soon'] // Example structure
    }; 
    const performanceSummary = { avgCloseTime: 'N/A', sourceBreakdown: [] }; // Source breakdown is removed as requested
    // --- End Placeholder data ---

    return {
      totalLeads,
      newLeadsThisWeek,
      leadsByStage,
      aiInsights,
      dailyLeadGrowth,
      performanceSummary,
    };
  };

  const handleDownloadReport = async () => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') {
      console.warn('html2pdf.js can only run in the browser.');
      return;
    }

    // Dynamically import html2pdf.js here
    const html2pdf = (await import('html2pdf.js')).default;

    const element = document.getElementById('lead-report-content');
    if (element) {
        html2pdf(element, {
            margin: 10,
            filename: 'lead-performance-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm" id="lead-report-content">
      <h3 className="text-lg font-semibold mb-4">Lead Performance Report</h3>
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-600">Loading report data...</div>
      ) : processedReportData ? (
        <div>
          {/* Summary Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Summary</h4>
            <p>Total Leads: {processedReportData.totalLeads}</p>
            <p>New Leads This Week: {processedReportData.newLeadsThisWeek}</p>
            {/* Add other summary points based on calculated data */}
          </div>

          {/* Leads per EV Stage (Horizontal Bar Graph) */}
          <div className="mb-6">
             <h4 className="text-lg font-semibold mb-2">Leads by Engagement Value (EV) Stage</h4>
             <ResponsiveContainer width="100%" height={200}>
               <BarChart data={processedReportData.leadsByStage} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis type="number" dataKey="count" />
                 <YAxis type="category" dataKey="name" width={100} tickFormatter={(value) => `${value} (${processedReportData.leadsByStage.find(stage => stage.name === value)?.evRange})`} />
                 <Tooltip formatter={(value: number, name: string, props: any) => [`${value} leads`, `EV Range: ${props.payload.evRange}`, `Action: ${props.payload.action}`]} />
                 <Bar dataKey="count" fill="#0e6537" />
               </BarChart>
             </ResponsiveContainer>
          </div>

          {/* Daily Lead Growth (Line Chart) */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Daily Lead Growth This Week</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={processedReportData.dailyLeadGrowth} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0e6537" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Summary (Only Avg Close Time remains) */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Performance Summary</h4>
            <p>Average Close Time: {processedReportData.performanceSummary.avgCloseTime}</p>
          </div>

          {/* Download Button */}
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm"
            onClick={handleDownloadReport}
          >
            Download PDF Report
          </button>

        </div>
      ) : ( processedReportData === null && !loading ? (
        <div className="flex items-center justify-center h-64 text-gray-600">Failed to load report data or no data available.</div>
      ) : null
      )}
    </div>
  );
};

export default LeadReport; 