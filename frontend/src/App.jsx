import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
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
  return (
    <OfflineProvider>
      <div className="relative min-h-screen">
        {/* Animated background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Main Routes */}
        <div className="relative z-10">
          <Routes>
            {/* Public standalone pages (landing & auth) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in/*" element={<ClerkSignInPage />} />
            <Route path="/sign-up/*" element={<ClerkSignUpPage />} />
            <Route path="/login" element={<Navigate to="/sign-in" replace />} />
            <Route path="/register" element={<Navigate to="/sign-up" replace />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Platform Application Pages (Fixed Left Sidebar + Minimal Top Header Layout) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/learn"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CurriculumSubjectsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SubjectCurriculumPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId/:topicId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TopicLearningPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:subjectId/:topicId/quiz"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TopicQuizPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exam-prep"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ExamPrepPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exam"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ExamPrepPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TestPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TestPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test/:subject"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TestPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz-generator"
              element={
                <AppLayout>
                  <QuizGenerator />
                </AppLayout>
              }
            />

            <Route
              path="/tutor"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Tutor />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RoadmapPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap/:subject"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RoadmapPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/placement-readiness"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlacementPrediction />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/career-readiness"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CareerReadiness />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/coding-lab"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CodingLabPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/coding"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CodingLabPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/algorithm-visualizer"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AlgorithmVisualizerPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/visualizer"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AlgorithmVisualizerPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MockInterviewPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MockInterviewPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/skill-graph"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SkillGraphPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/offline-learning"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <OfflineLearning />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Portal Protected Routes */}
            <Route
              path="/teacher-dashboard"
              element={
                <AdminRoute>
                  <AppLayout>
                    <TeacherDashboard />
                  </AppLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/institution-dashboard"
              element={
                <AdminRoute>
                  <AppLayout>
                    <TeacherDashboard />
                  </AppLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/security"
              element={
                <AdminRoute>
                  <AppLayout>
                    <SecurityGovernance />
                  </AppLayout>
                </AdminRoute>
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
