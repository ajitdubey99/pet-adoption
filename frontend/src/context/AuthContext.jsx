/**
 * @fileoverview Global authentication context and provider.
 * Manages user session state and exposes login/register/logout actions.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as loginApi, register as registerApi } from "../api/services";

const AuthContext = createContext(null);

/**
 * AuthProvider initializes auth state from localStorage and provides
 * login, register, and logout actions to child components.
 *
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const persist = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Authenticates a user and persists the session.
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials);
    persist(res.data.user, res.data.token);
    return res.data.user;
  }, []);

  /**
   * Registers a new user and immediately logs them in.
   * @param {Object} userData
   */
  const register = useCallback(async (userData) => {
    const res = await registerApi(userData);
    persist(res.data.user, res.data.token);
    return res.data.user;
  }, []);

  /**
   * Clears all session data.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for consuming AuthContext.
 * @returns {{ user, loading, login, register, logout, isAuthenticated, isAdmin }}
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
