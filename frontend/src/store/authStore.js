import { create } from 'zustand';
import api from '../lib/api';

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export const useAuth = create((set, get) => ({
  user: null,
  token: storedToken,
  loading: false,
  initialized: false,

  initializeAuth: async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      set({ user: null, token: null, initialized: true });
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, token, initialized: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, initialized: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        token: data.token,
        loading: false,
        initialized: true,
      });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        token: data.token,
        loading: false,
        initialized: true,
      });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, initialized: true });
  },

  isAdmin: () => get().user?.role === 'admin',
  isSupport: () => ['agent', 'admin'].includes(get().user?.role),
}));
