import { api } from './api';
import { Inquiry } from '../types';

export const inquiryService = {
  async createInquiry(data: {
    propertyId: string;
    name: string;
    email: string;
    phone: string;
    preferredVisitDate?: string;
    message: string;
  }) {
    const res = await api.post<{ success: boolean; inquiry: Inquiry }>('/inquiries', data);
    return res.data.inquiry;
  },

  async getInquiries() {
    const res = await api.get<{ success: boolean; inquiries: Inquiry[] }>('/inquiries');
    return res.data.inquiries;
  },

  async updateStatus(id: string, status: string) {
    const res = await api.put<{ success: boolean; inquiry: Inquiry }>(`/inquiries/${id}`, { status });
    return res.data.inquiry;
  },
};
