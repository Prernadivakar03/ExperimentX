import { createContext, useContext, useState, useEffect } from "react";
import { getStoredUser, isAuthenticated as checkAuth } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, [user]);

  const setSession = (sessionUser) => {
    setUser(sessionUser);
    setIsAuthenticated(true);
  };

  const clearAuth = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setSession, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}