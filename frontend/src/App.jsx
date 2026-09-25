import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
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
import RoadmapPage from "./pages/RoadmapPage.jsx";
import CurriculumSubjectsPage from "./pages/CurriculumSubjectsPage.jsx";
import SubjectCurriculumPage from "./pages/SubjectCurriculumPage.jsx";
import TopicLearningPage from "./pages/TopicLearningPage.jsx";
import TopicQuizPage from "./pages/TopicQuizPage.jsx";
import SkillGraphPage from "./pages/SkillGraphPage.jsx";
import AlgorithmVisualizerPage from "./pages/AlgorithmVisualizerPage.jsx";
import CodingLabPage from "./pages/CodingLabPage.jsx";
import MockInterviewPage from "./pages/MockInterviewPage.jsx";
import ExamPrepPage from "./pages/ExamPrepPage.jsx";
import { OfflineProvider } from "./context/OfflineContext.jsx";
import { ClerkSignInPage, ClerkSignUpPage } from "./pages/AuthPages.jsx";

function App() {
  const location = useLocation();

  // Pages that have their own built-in navbar — suppress the global one
  const pagesWithOwnNavbar = ["/", "/sign-in", "/sign-up", "/login", "/register", "/admin-login", "/dashboard"];
  const showGlobalNavbar = !pagesWithOwnNavbar.some(
    (path) => location.pathname === path || location.pathname.startsWith("/sign-in") || location.pathname.startsWith("/sign-up")
  );

  return (
    <OfflineProvider>
      <div className="relative min-h-screen">
        {/* Animated background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Main content */}
        <div className="relative z-10">
          {/* Global Navbar — hidden on pages that have their own built-in header */}
          {showGlobalNavbar && <Navbar />}
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

            {/* Admin Portal — separate credentials required */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin-guarded routes */}
            <Route
              path="/teacher-dashboard"
              element={
                <AdminRoute>
                  <TeacherDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/institution-dashboard"
              element={
                <AdminRoute>
                  <TeacherDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/security"
              element={
                <AdminRoute>
                  <SecurityGovernance />
                </AdminRoute>
              }
            />

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
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap/:subject"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />

            {/* Skill Graph */}
            <Route
              path="/skill-graph"
              element={
                <ProtectedRoute>
                  <SkillGraphPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visualizer"
              element={
                <ProtectedRoute>
                  <AlgorithmVisualizerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/algorithm-visualizer"
              element={
                <ProtectedRoute>
                  <AlgorithmVisualizerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding-lab"
              element={
                <ProtectedRoute>
                  <CodingLabPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding"
              element={
                <ProtectedRoute>
                  <CodingLabPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute>
                  <MockInterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <MockInterviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam-prep"
              element={
                <ProtectedRoute>
                  <ExamPrepPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam"
              element={
                <ProtectedRoute>
                  <ExamPrepPage />
                </ProtectedRoute>
              }
            />

            {/* Core Learning System Routes */}
            <Route
              path="/learn"
              element={
                <ProtectedRoute>
                  <CurriculumSubjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId"
              element={
                <ProtectedRoute>
                  <SubjectCurriculumPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId/:topicId"
              element={
                <ProtectedRoute>
                  <TopicLearningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId/:topicId/quiz"
              element={
                <ProtectedRoute>
                  <TopicQuizPage />
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
