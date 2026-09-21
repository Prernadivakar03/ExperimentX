import api from "./api";

const ACCESS_KEY = "experimentx_access_token";
const USER_KEY = "experimentx_user";

export function saveSession({ access_token, user }) {
  localStorage.setItem(ACCESS_KEY, access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  saveSession(res.data);
  return res.data;
}

export async function register({ name, email, password, company }) {
  const res = await api.post("/auth/register", { name, email, password, company });
  saveSession(res.data);
  return res.data;
}

export async function logout() {
  try {
    // No body needed — the backend reads the refresh token from its
    // httpOnly cookie and clears that cookie in the response.
    await api.post("/auth/logout");
  } finally {
    clearSession();
  }
}

export async function forgotPassword(email) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
}

export async function resetPassword(token, newPassword) {
  const res = await api.post("/auth/reset-password", { token, new_password: newPassword });
  return res.data;
}