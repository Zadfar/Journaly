import axios from 'axios';
import { supabase } from '../supabaseClient';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Your FastAPI URL
});

// Request Interceptor: Automatically adds the Auth Token to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

export default api;