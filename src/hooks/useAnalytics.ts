import { create } from 'zustand';

interface AnalyticsData {
  totalMessages: number;
  totalFiles: number;
  totalVoiceMessages: number;
  activeUsers: number;
  sessionDuration: number;
  popularChannels: Array<{ name: string; messages: number }>;
  userActivity: Array<{ date: string; messages: number }>;
}

interface AnalyticsState {
  data: AnalyticsData;
  updateAnalytics: (newData: Partial<AnalyticsData>) => void;
  trackEvent: (event: string, data?: any) => void;
}

const initialData: AnalyticsData = {
  totalMessages: 1247,
  totalFiles: 89,
  totalVoiceMessages: 23,
  activeUsers: 156,
  sessionDuration: 45, // minutes
  popularChannels: [
    { name: 'general', messages: 234 },
    { name: 'random', messages: 189 },
    { name: 'help', messages: 145 },
  ],
  userActivity: [
    { date: '2024-01-01', messages: 45 },
    { date: '2024-01-02', messages: 67 },
    { date: '2024-01-03', messages: 89 },
  ],
};

export const useAnalytics = create<AnalyticsState>((set, get) => ({
  data: initialData,
  updateAnalytics: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),
  trackEvent: (event, data) => {
    console.log('Analytics event:', event, data);
    // In real app, send to analytics service
  },
}));