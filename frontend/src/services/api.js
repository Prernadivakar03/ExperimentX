

import axios from "axios";

// In dev: uses VITE_API_URL from .env.local (defaults to localhost)
// In prod: set VITE_API_URL in Vercel dashboard
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  // Required so the browser sends/receives the httpOnly refresh-token
  // cookie on cross-origin requests (Vercel frontend -> Railway backend).
  withCredentials: true,
});

// Attach access token and active organization to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("experimentx_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const activeOrgId = localStorage.getItem("experimentx_active_org_id");
  if (activeOrgId) {
    config.headers["X-Organization-Id"] = activeOrgId;
  }
  return config;
});

// On 401 — try refreshing once, then redirect to login
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // No body needed — the refresh token travels as an httpOnly
        // cookie and is sent automatically because of withCredentials.
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        localStorage.setItem("experimentx_access_token", res.data.access_token);

        processQueue(null, res.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("experimentx_access_token");
        localStorage.removeItem("experimentx_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;