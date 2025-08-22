import { create } from 'zustand';
import api from '../lib/api';

export const useAuth = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  
  // Initialize user from token on app start
  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        set({ user: data.user, token });
      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      }
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Helper to check if user is admin
  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  }
}));
