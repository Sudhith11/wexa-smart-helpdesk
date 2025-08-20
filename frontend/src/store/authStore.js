import { create } from 'zustand';
import api from '../lib/api';

export const useAuth = create((set)=>({
  user: null,
  token: localStorage.getItem('token')||null,
  login: async (email,password)=>{
    const {data} = await api.post('/auth/login',{email,password});
    localStorage.setItem('token', data.token);
    set({user: data.user, token: data.token});
  },
  register: async (name,email,password)=>{
    const {data} = await api.post('/auth/register',{name,email,password});
    localStorage.setItem('token', data.token);
    set({user: data.user, token: data.token});
  },
  logout: ()=>{ localStorage.removeItem('token'); set({user:null, token:null}); }
}));
