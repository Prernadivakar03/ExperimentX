// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000"
// });

// export default api;









import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("experimentx_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try refreshing the token once, then retry the original request
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

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/")) {
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

      const refreshToken = localStorage.getItem("experimentx_refresh_token");

      try {
        const res = await axios.post("http://localhost:8000/auth/refresh", {
          refresh_token: refreshToken,
        });

        localStorage.setItem("experimentx_access_token", res.data.access_token);
        localStorage.setItem("experimentx_refresh_token", res.data.refresh_token);

        processQueue(null, res.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("experimentx_access_token");
        localStorage.removeItem("experimentx_refresh_token");
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