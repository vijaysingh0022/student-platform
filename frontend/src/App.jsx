import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TestPage from "./pages/TestPage.jsx";
import Tutor from "./pages/Tutor.jsx";
import PlacementPrediction from "./pages/PlacementPrediction.jsx";
import CareerReadiness from "./pages/CareerReadiness.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import OfflineLearning from "./pages/OfflineLearning.jsx";
import { OfflineProvider } from "./context/OfflineContext.jsx";

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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
          </Routes>
        </div>
      </div>
    </OfflineProvider>
  );
}

export default App;
