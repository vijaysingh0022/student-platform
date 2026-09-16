import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TestPage from "./pages/TestPage.jsx";
import Tutor from "./pages/Tutor.jsx";
import PlacementPrediction from "./pages/PlacementPrediction.jsx";
import CareerReadiness from "./pages/CareerReadiness.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import OfflineLearning from "./pages/OfflineLearning.jsx";
import QuizGenerator from "./pages/QuizGenerator.jsx";
import SecurityGovernance from "./pages/SecurityGovernance.jsx";
import { OfflineProvider } from "./context/OfflineContext.jsx";

// Clerk-hosted sign-in / sign-up pages — styled to match app
const ClerkSignInPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorPrimary: "#7c3aed",
            colorBackground: "#0f172a",
            colorText: "#f1f5f9",
            colorInputBackground: "#1e293b",
            colorInputText: "#f1f5f9",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
};

const ClerkSignUpPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <SignUp
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#7c3aed",
            colorBackground: "#0f172a",
            colorText: "#f1f5f9",
            colorInputBackground: "#1e293b",
            colorInputText: "#f1f5f9",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <OfflineProvider>
      <div className="relative min-h-screen">
        {/* Animated background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Main content */}
        <div className="relative z-10">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in/*" element={<ClerkSignInPage />} />
            <Route path="/sign-up/*" element={<ClerkSignUpPage />} />

            {/* Legacy /login and /register redirect to Clerk pages */}
            <Route path="/login" element={<Navigate to="/sign-in" replace />} />
            <Route path="/register" element={<Navigate to="/sign-up" replace />} />

            {/* Public (no auth needed) */}
            <Route path="/quiz-generator" element={<QuizGenerator />} />
            <Route path="/security" element={<SecurityGovernance />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offline-learning"
              element={
                <ProtectedRoute>
                  <OfflineLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution-dashboard"
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/career-readiness"
              element={
                <ProtectedRoute>
                  <CareerReadiness />
                </ProtectedRoute>
              }
            />
            <Route
              path="/placement-readiness"
              element={
                <ProtectedRoute>
                  <PlacementPrediction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test/:subject"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tutor"
              element={
                <ProtectedRoute>
                  <Tutor />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </OfflineProvider>
  );
}

export default App;
