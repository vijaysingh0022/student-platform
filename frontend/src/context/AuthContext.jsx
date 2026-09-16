import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

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
      const { data } = await axios.post(
        "/api/auth/sync",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDbUser(data);
    } catch (err) {
      console.error("Auth sync error:", err?.response?.data || err.message);
    } finally {
      setSyncing(false);
    }
  }, [clerkUser, isSignedIn, getToken]);

  // Sync whenever the Clerk user changes (sign-in, page refresh)
  useEffect(() => {
    if (clerkUserLoaded && isSignedIn) {
      syncWithBackend();
    } else if (clerkUserLoaded && !isSignedIn) {
      setDbUser(null);
    }
  }, [clerkUserLoaded, isSignedIn, syncWithBackend]);

  // Build the unified `user` object that all pages use via useAuth()
  const user = isSignedIn && dbUser
    ? {
        // Clerk fields
        clerkId: clerkUser?.id,
        imageUrl: clerkUser?.imageUrl,
        // MongoDB fields
        _id: dbUser._id,
        name: dbUser.name || clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress,
        email: dbUser.email || clerkUser?.primaryEmailAddress?.emailAddress,
        role: dbUser.role || "student",
        course: dbUser.course,
        department: dbUser.department,
        batch: dbUser.batch,
        rollNo: dbUser.rollNo,
        attendanceRate: dbUser.attendanceRate,
      }
    : null;

  // isLoading is true while Clerk hasn't finished loading OR while we're syncing
  const isLoading = !clerkUserLoaded || (isSignedIn && syncing && !dbUser);

  // Kept for backwards compatibility — no-op since Clerk manages login
  const login = () => {};

  return (
    <AuthContext.Provider value={{ user, login, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
