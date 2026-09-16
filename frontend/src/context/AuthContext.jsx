import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkUserLoaded } = useUser();
  const { getToken, isSignedIn } = useClerkAuth();

  // dbUser holds the MongoDB profile (role, course, etc.)
  const [dbUser, setDbUser] = useState(null);
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

  // Unified user object: immediate Clerk profile + MongoDB enrichment
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
    : null;

  // Unblock UI immediately once Clerk user state has loaded
  const isLoading = !clerkUserLoaded;

  const login = () => {};

  return (
    <AuthContext.Provider value={{ user, login, isLoading, isSyncing: syncing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
