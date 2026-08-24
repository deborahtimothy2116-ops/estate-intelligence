import { api } from './api';
import { PricePrediction, FraudCheckResult, RecommendationItem, Property } from '../types';

export const aiService = {
  async nlpSearch(prompt: string) {
    const res = await api.post<{
      success: boolean;
      extracted_parameters: any;
      confidence: number;
      properties: Property[];
      total: number;
    }>('/ai/search', { prompt });
    return res.data;
  },

  async predictPrice(propertyData: any) {
    const res = await api.post<PricePrediction & { success: boolean }>('/ai/predict-price', propertyData);
    return res.data;
  },

  async checkFraud(propertyData: any) {
    const res = await api.post<FraudCheckResult & { success: boolean }>('/ai/fraud-check', propertyData);
    return res.data;
  },

  async getRecommendations() {
    const res = await api.get<{ success: boolean; recommendations: RecommendationItem[] }>('/ai/recommendations');
    return res.data.recommendations;
  },

  async chatAssistant(messages: { role: string; content: string }[]) {
    const res = await api.post<{
      success: boolean;
      reply: string;
      suggestedProperties: Property[];
    }>('/ai/chat', { messages });
    return res.data;
  },
};
