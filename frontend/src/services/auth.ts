import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/register") &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/verify-otp")
    ) {
      Cookies.remove("token");
      Cookies.remove("token", { path: "/" });
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/sign-in");
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData: {
    email: string;
    name: string;
    profession?: string;
    password: string;
  }) => {
    try {
      const response = await api.post("/auth/register", userData);
    } catch (error: any) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  verifyOTP: async (otpData: { email: string; otp: string }) => {
    try {
      const response = await api.post("/auth/verify-otp", otpData);

      if (response.data.token) {
        Cookies.set("token", response.data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "OTP verification failed" };
    }
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    try {
      const response = await api.post("/auth/resend-otp", { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to resend OTP" };
    }
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.token) {
        Cookies.set("token", response.data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post("/auth/logout");
      Cookies.remove("token");
      // Clear all cookies to ensure complete logout
      Cookies.remove("token", { path: "/" });
      // Clear localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      // Use replace instead of href to prevent back navigation
      window.location.replace("/sign-in");
    } catch (error) {
      Cookies.remove("token");
      Cookies.remove("token", { path: "/" });
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/sign-in");
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to get profile" };
    }
  },

  isAuthenticated: () => {
    return !!Cookies.get("token");
  },

  getToken: () => {
    return Cookies.get("token");
  },

  requestPasswordReset: async (email: string) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to send reset email" };
    }
  },

  // Reset password with token
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Failed to reset password" };
    }
  },

  // Verify reset token
  verifyResetToken: async (token: string) => {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: "Invalid or expired token" };
    }
  },

  // OAuth URLs
  getGoogleAuthUrl: () => `${API_BASE_URL}/auth/google`,
  getGitHubAuthUrl: () => `${API_BASE_URL}/auth/github`,
};

export default authService;
