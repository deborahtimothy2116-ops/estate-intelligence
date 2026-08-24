import { api } from './api';
import { Appointment } from '../types';

export const appointmentService = {
  async scheduleAppointment(data: {
    propertyId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) {
    const res = await api.post<{ success: boolean; appointment: Appointment }>('/appointments', data);
    return res.data.appointment;
  },

  async getAppointments() {
    const res = await api.get<{ success: boolean; appointments: Appointment[] }>('/appointments');
    return res.data.appointments;
  },

  async updateStatus(id: string, status: string) {
    const res = await api.put<{ success: boolean; appointment: Appointment }>(`/appointments/${id}`, { status });
    return res.data.appointment;
  },
};
