import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface LeadReportProps {
  userId: string | undefined;
  leadData: any[];
  loading: boolean;
  timeRange: 'day' | 'week' | 'month' | 'year';
  onRefresh: () => Promise<void>;
}

interface LeadData {
  totalLeads: number;
  newLeads: number;
  leadsByStage: { name: string; count: number; evRange: string }[];
  aiInsights: { hotLeads: string[]; followUps: string[]; predictions: string[] };
  dailyLeadGrowth: { day: string; count: number }[];
  performanceSummary: { avgCloseTime: string; sourceBreakdown: { source: string; count: number }[] };
}

interface Message {
  ev_score?: number | string;
  timestamp: string;
  [key: string]: any;
}

const getTimeRangeDays = (timeRange: 'day' | 'week' | 'month' | 'year') => {
  switch (timeRange) {
    case 'day':
      return 1;
    case 'week':
      return 7;
    case 'month':
      return 30;
    case 'year':
      return 365;
    default:
      return 1;
  }
};

const processLeadDataForReport = (conversationsData: any[], timeRange: 'day' | 'week' | 'month' | 'year'): LeadData => {
  const totalLeads = conversationsData.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyCounts: Record<string, number> = {};
  let newLeads = 0;

  // Calculate the start date based on timeRange
  const days = getTimeRangeDays(timeRange);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (days - 1));

  conversationsData.forEach(({ messages }) => {
    if (messages.length > 0) {
      const firstMessageTimestamp = new Date(messages[0].timestamp);
      firstMessageTimestamp.setHours(0, 0, 0, 0);

      if (firstMessageTimestamp >= startDate && firstMessageTimestamp <= today) {
        newLeads++;
        const dateKey = firstMessageTimestamp.toISOString().split('T')[0];
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
      }
    }
  });

  // Generate dailyLeadGrowth array based on timeRange
  const dailyLeadGrowth: { day: string; count: number }[] = [];
  const daysToShow = days;
  
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const dateKey = date.toISOString().split('T')[0];
    dailyLeadGrowth.push({ day: dayOfWeek, count: dailyCounts[dateKey] || 0 });
  }

  // Rest of your existing processing logic...
  const leadsByStage = [
    { name: 'Contacted', count: 0, evRange: '0-19' },
    { name: 'Engaged', count: 0, evRange: '20-39' },
    { name: 'Toured', count: 0, evRange: '40-59' },
    { name: 'Offer Stage', count: 0, evRange: '60-79' },
    { name: 'Closed', count: 0, evRange: '80-100' },
  ];

  conversationsData.forEach(({ messages }) => {
    let highestEv = -1;
    messages.forEach((message: Message) => {
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

  const aiInsights = {
    hotLeads: ['Lead A (EV 85)', 'Lead B (EV 90)'],
    followUps: ['Lead C (Last contact 3 days ago)', 'Lead D (No response)'],
    predictions: ['Lead E likely to close soon']
  };

  const performanceSummary = { avgCloseTime: 'N/A', sourceBreakdown: [] };

  return {
    totalLeads,
    newLeads,
    leadsByStage,
    aiInsights,
    dailyLeadGrowth,
    performanceSummary,
  };
};

const LeadReport: React.FC<LeadReportProps> = ({ userId, leadData, loading, timeRange, onRefresh }) => {
  const processedReportData = useMemo(() => {
    if (!loading && leadData && Array.isArray(leadData)) {
      return processLeadDataForReport(leadData, timeRange);
    }
    return null;
  }, [leadData, loading, timeRange]);

  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'day':
        return 'Last 24 Hours';
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'year':
        return 'Last 12 Months';
      default:
        return 'Last 24 Hours';
    }
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
            <p>New Leads {getTimeRangeText()}: {processedReportData.newLeads}</p>
          </div>

          {/* Leads per EV Stage */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Leads by Engagement Value (EV) Stage</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={processedReportData.leadsByStage} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="count" />
                <YAxis type="category" dataKey="name" width={100} tickFormatter={(value) => `${value} (${processedReportData.leadsByStage.find(stage => stage.name === value)?.evRange})`} />
                <Tooltip formatter={(value: number, name: string, props: any) => [`${value} leads`, `EV Range: ${props.payload.evRange}`]} />
                <Bar dataKey="count" fill="#0e6537" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Lead Growth */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Lead Growth {getTimeRangeText()}</h4>
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

          {/* Performance Summary */}
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
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-600">No data available.</div>
      )}
    </div>
  );
};

export default LeadReport; 