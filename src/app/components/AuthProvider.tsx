"use client";

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

type AuthState =
  | { status: "loading"; user: null }
  | { status: "unauthenticated"; user: null }
  | { status: "authenticated"; user: User };

type Ctx = AuthState & {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setAuthenticated: (user: User) => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data?.user) setState({ status: "authenticated", user: data.user });
      else setState({ status: "unauthenticated", user: null });
    } catch {
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  const setAuthenticated = useCallback((user: User) => {
    setState({ status: "authenticated", user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ ...state, refresh, logout, setAuthenticated }), [state, refresh, logout, setAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
