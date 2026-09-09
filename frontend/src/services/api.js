import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
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

export default api;
