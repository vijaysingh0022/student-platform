import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Attach JWT token to every request if user is logged in
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (e) {
    // Ignore JSON parse error
  }
  return config;
});

// Auto-handle 401 unauthorized / stale tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Quiz Generator APIs
export const generateQuiz = (data) => {
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    return api.post("/quiz/generate", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("/quiz/generate", data);
};
export const evaluateQuiz = (payload) => api.post("/quiz/evaluate", payload);
export const getQuizById = (quizId) => api.get(`/quiz/${quizId}`);
export const getRecentQuizzes = () => api.get("/quiz/recent");

// SSO Authentication API
export const ssoLogin = (payload) => api.post("/auth/sso/login", payload);

// Security & Governance APIs
export const getAuditLogs = (params) => api.get("/security/audit-logs", { params });
export const switchRole = (targetRole) => api.post("/security/switch-role", { targetRole });
export const getComplianceReport = () => api.get("/security/compliance-report");

// Data Privacy & GDPR APIs
export const exportUserData = () => api.get("/privacy/export-data");
export const updatePrivacyConsent = (payload) => api.post("/privacy/consent", payload);
export const purgeUserData = () => api.delete("/privacy/purge");

// Cloud Health & Interoperability APIs
export const getSystemHealth = () => api.get("/system/health");
export const getInteropSpec = () => api.get("/system/interop-spec");

export default api;
