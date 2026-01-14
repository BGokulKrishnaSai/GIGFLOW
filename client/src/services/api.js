import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return "/api";
  return window.location.origin + '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ✅ ADD TOKEN TO EVERY REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔑 Token being sent:', token ? 'Present' : 'Missing');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // ✅ REMOVE TOKEN TOO
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
