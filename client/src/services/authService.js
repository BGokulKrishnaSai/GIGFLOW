import api from "./api";

const authService = {
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    const user = response?.data?.data?.user || null;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return { user };
  },

  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    const user = response?.data?.data?.user || null;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return { user };
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    localStorage.removeItem("user");
    return { message: "Logged out successfully" };
  },

  getMe: async () => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  verifyToken: async () => {
    try {
      const response = await api.get("/api/auth/me");
      return response.data.user;
    } catch {
      return null;
    }
  },
};

export default authService;
