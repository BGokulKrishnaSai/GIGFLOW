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

// ✅ ADD THIS: Send token with every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔑 Token being sent:', token ? 'Present' : 'Missing'); // Debug
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
      localStorage.removeItem("token"); // ✅ Also remove token
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
