import api from "./api";

const authService = {
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    const user = response?.data?.data?.user || null;
    const token = response?.data?.token || null; // ✅ GET TOKEN
    
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem("token", token); // ✅ SAVE TOKEN
      console.log("✅ Token saved on register:", token); // Debug
    }
    
    return { user, token }; // ✅ Return both
  },

  login: async (credentials) => {
    const response = await api.post("/api/auth/login", credentials);
    const user = response?.data?.data?.user || null;
    const token = response?.data?.token || null; // ✅ GET TOKEN
    
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem("token", token); // ✅ SAVE TOKEN
      console.log("✅ Token saved on login:", token); // Debug
    }
    
    return { user, token }; // ✅ Return both
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // ✅ REMOVE TOKEN TOO
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
