import axios from "axios";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

// Base axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Automatic request interceptor: retrieves token from Clerk if active in browser session
api.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== "undefined" && window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn("Could not attach Clerk token to request:", err.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Hook-based API client (for React components with Clerk auth context) ─────
export const useApi = () => {
  const { getToken, isSignedIn } = useClerkAuth();

  const authApi = {
    get: async (url, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.get(url, mergeAuth(config, token));
    },
    post: async (url, data, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.post(url, data, mergeAuth(config, token));
    },
    put: async (url, data, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.put(url, data, mergeAuth(config, token));
    },
    patch: async (url, data, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.patch(url, data, mergeAuth(config, token));
    },
    delete: async (url, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.delete(url, mergeAuth(config, token));
    },
  };

  return { authApi, api };
};

const mergeAuth = (config, token) => ({
  ...config,
  headers: {
    ...(config.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

// ─── Named API Helpers for Quiz, Security, Privacy, and System ─────────────

// AI Quiz Generator
export const generateQuiz = async (formDataOrPayload, config = {}) => {
  const isFormData = typeof FormData !== "undefined" && formDataOrPayload instanceof FormData;
  return api.post("/quiz/generate", formDataOrPayload, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
    },
  });
};

export const evaluateQuiz = async (payload, config = {}) => {
  return api.post("/quiz/evaluate", payload, config);
};

export const getRecentQuizzes = async (config = {}) => {
  return api.get("/quiz/recent", config);
};

export const getQuizById = async (quizId, config = {}) => {
  return api.get(`/quiz/${quizId}`, config);
};

// Security & Governance
export const getAuditLogs = async (params = {}, config = {}) => {
  return api.get("/security/audit-logs", { ...config, params });
};

export const switchRole = async (targetRole, config = {}) => {
  return api.post("/security/switch-role", { role: targetRole }, config);
};

export const getComplianceReport = async (config = {}) => {
  return api.get("/security/compliance-report", config);
};

// Privacy & Consent
export const exportUserData = async (config = {}) => {
  return api.get("/privacy/export-data", config);
};

export const updatePrivacyConsent = async (consents, config = {}) => {
  return api.post("/privacy/consent", consents, config);
};

export const purgeUserData = async (confirmation, config = {}) => {
  return api.delete("/privacy/purge", { ...config, data: confirmation });
};

// System Health & Interoperability
export const getSystemHealth = async (config = {}) => {
  return api.get("/system/health", config);
};

export const getInteropSpec = async (config = {}) => {
  return api.get("/system/interop-spec", config);
};

// Legacy SSO fallback
export const ssoLogin = async (provider, config = {}) => {
  return api.post("/auth/sso", { provider }, config);
};

export default api;
