import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkUserLoaded } = useUser();
  const { getToken, isSignedIn } = useClerkAuth();

  // dbUser holds the MongoDB profile (role, course, etc.)
  const [dbUser, setDbUser] = useState(null);
  const [localUser, setLocalUser] = useState(() => {
    try {
      const saved = localStorage.getItem("learnx_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [syncing, setSyncing] = useState(false);

  const syncWithBackend = useCallback(async () => {
    if (!clerkUser || !isSignedIn) return;
    try {
      setSyncing(true);
      const token = await getToken();
      const { data } = await api.post(
        "/auth/sync",
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 8000,
        }
      );
      if (data && data._id) {
        setDbUser(data);
      }
    } catch (err) {
      console.warn("Auth sync notice (using Clerk profile fallback):", err?.response?.data || err.message);
    } finally {
      setSyncing(false);
    }
  }, [clerkUser, isSignedIn, getToken]);

  // Sync with MongoDB in the background whenever Clerk user is active
  useEffect(() => {
    if (clerkUserLoaded && isSignedIn) {
      syncWithBackend();
    } else if (clerkUserLoaded && !isSignedIn) {
      setDbUser(null);
    }
  }, [clerkUserLoaded, isSignedIn, syncWithBackend]);

  const login = (userData) => {
    if (userData) {
      if (userData.token) {
        localStorage.setItem("learnx_token", userData.token);
      }
      localStorage.setItem("learnx_user", JSON.stringify(userData));
      setLocalUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("learnx_user");
    localStorage.removeItem("learnx_token");
    setLocalUser(null);
    setDbUser(null);
  };

  // Unified user object: immediate Clerk profile + MongoDB enrichment + Local fallback
  const user = isSignedIn
    ? {
        clerkId: clerkUser?.id,
        imageUrl: clerkUser?.imageUrl,
        _id: dbUser?._id || clerkUser?.id,
        name:
          dbUser?.name ||
          clerkUser?.fullName ||
          clerkUser?.firstName ||
          clerkUser?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "Student Scholar",
        email: dbUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || "",
        role: dbUser?.role || "student",
        course: dbUser?.course || "B.Tech CSE",
        department: dbUser?.department || "Computer Science & Engineering",
        batch: dbUser?.batch || "2022-2026",
        rollNo: dbUser?.rollNo || "CSE-2024",
        attendanceRate: dbUser?.attendanceRate || 88,
      }
    : localUser
    ? {
        _id: localUser._id || "local-demo-id",
        name: localUser.name || "Demo Student",
        email: localUser.email || "demo@example.com",
        role: localUser.role || "student",
        course: localUser.course || "B.Tech CSE",
        department: localUser.department || "Computer Science & Engineering",
        batch: localUser.batch || "2022-2026",
        rollNo: localUser.rollNo || "CSE-2201",
        attendanceRate: localUser.attendanceRate || 85,
      }
    : null;

  // Unblock UI immediately once Clerk user state has loaded
  const isLoading = !clerkUserLoaded;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isSyncing: syncing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
