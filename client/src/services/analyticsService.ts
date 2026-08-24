import { api } from './api';
import { AgentAnalytics, AdminAnalytics } from '../types';

export const analyticsService = {
  async getAgentAnalytics() {
    const res = await api.get<{ success: boolean; analytics: AgentAnalytics }>('/analytics/agent');
    return res.data.analytics;
  },

  async getAdminAnalytics() {
    const res = await api.get<{ success: boolean; analytics: AdminAnalytics }>('/analytics/admin');
    return res.data.analytics;
  },
};
