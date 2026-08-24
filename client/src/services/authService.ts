import { api } from './api';
import { User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  agencyName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', payload);
    return res.data;
  },

  async login(payload: LoginPayload) {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', payload);
    return res.data;
  },

  async getMe() {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data.user;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async updateProfile(data: Partial<User>) {
    const res = await api.put<{ success: boolean; user: User }>('/auth/profile', data);
    return res.data.user;
  },
};
