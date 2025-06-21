export interface AnalyticsMetric {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  description?: string;
}

export interface EVDataPoint {
  messageNumber: number;
  averageEV: number;
  totalMessages: number;
  conversationCount: number;
}

export interface AnalyticsData {
  keyMetrics: AnalyticsMetric[];
  evByMessage: EVDataPoint[];
  dateRange: string;
  lastUpdated: string;
}

export interface AnalyticsFilters {
  dateRange: '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  conversationStatus?: 'all' | 'active' | 'completed' | 'flagged';
  leadSource?: string;
}

export interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  filters: AnalyticsFilters;
}

export interface ChartConfig {
  height?: number;
  width?: number;
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  responsive?: boolean;
} 