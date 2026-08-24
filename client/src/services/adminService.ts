import { api } from './api';
import { Property, User } from '../types';

export const adminService = {
  async getPendingProperties() {
    const res = await api.get<{ success: boolean; properties: Property[] }>('/admin/properties/pending');
    return res.data.properties;
  },

  async getSuspiciousProperties() {
    const res = await api.get<{ success: boolean; properties: Property[] }>('/admin/properties/suspicious');
    return res.data.properties;
  },

  async approveProperty(id: string) {
    const res = await api.put<{ success: boolean; property: Property }>(`/admin/properties/${id}/approve`);
    return res.data.property;
  },

  async rejectProperty(id: string) {
    const res = await api.put<{ success: boolean; property: Property }>(`/admin/properties/${id}/reject`);
    return res.data.property;
  },

  async suspendProperty(id: string) {
    const res = await api.put<{ success: boolean; property: Property }>(`/admin/properties/${id}/suspend`);
    return res.data.property;
  },

  async getUsers() {
    const res = await api.get<{ success: boolean; users: User[] }>('/admin/users');
    return res.data.users;
  },

  async verifyAgent(id: string) {
    const res = await api.put<{ success: boolean; user: User }>(`/admin/users/${id}/verify`);
    return res.data.user;
  },
};
