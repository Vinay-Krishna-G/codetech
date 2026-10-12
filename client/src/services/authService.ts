import api from './api';
import type { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User }> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
