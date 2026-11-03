import axios from "axios";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

// Base axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

// Automatic request interceptor: retrieves token from Clerk or localStorage
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      if (typeof window !== "undefined" && window.Clerk?.session) {
        token = await window.Clerk.session.getToken();
      }
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("learnx_token");
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Could not attach token to request:", err.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Hook-based API client (for React components with Clerk auth context) ─────
export const useApi = () => {
  const { getToken, isSignedIn } = useClerkAuth();

  const authApi = {
    get: async (url, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.get(url, mergeAuth(config, token));
    },
    post: async (url, data, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.post(url, data, mergeAuth(config, token));
    },
    put: async (url, data, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.put(url, data, mergeAuth(config, token));
    },
    patch: async (url, data, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.patch(url, data, mergeAuth(config, token));
    },
    delete: async (url, config = {}) => {
      const token = isSignedIn ? await getToken() : null;
      return api.delete(url, mergeAuth(config, token));
    },
  };

  return { authApi, api };
};

const mergeAuth = (config, token) => ({
  ...config,
  headers: {
    ...(config.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

// ─── Named API Helpers for Quiz, Security, Privacy, and System ─────────────

// AI Quiz Generator
export const generateQuiz = async (formDataOrPayload, config = {}) => {
  const isFormData = typeof FormData !== "undefined" && formDataOrPayload instanceof FormData;
  return api.post("/quiz/generate", formDataOrPayload, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(isFormData ? { "Content-Type": "multipart/form-data" } : {}),
    },
  });
};

export const evaluateQuiz = async (payload, config = {}) => {
  return api.post("/quiz/evaluate", payload, config);
};

export const getRecentQuizzes = async (config = {}) => {
  return api.get("/quiz/recent", config);
};

export const getQuizById = async (quizId, config = {}) => {
  return api.get(`/quiz/${quizId}`, config);
};

// Security & Governance
export const getAuditLogs = async (params = {}, config = {}) => {
  return api.get("/security/audit-logs", { ...config, params });
};

export const switchRole = async (targetRole, config = {}) => {
  return api.post("/security/switch-role", { role: targetRole }, config);
};

export const getComplianceReport = async (config = {}) => {
  return api.get("/security/compliance-report", config);
};

// Privacy & Consent
export const exportUserData = async (config = {}) => {
  return api.get("/privacy/export-data", config);
};

export const updatePrivacyConsent = async (consents, config = {}) => {
  return api.post("/privacy/consent", consents, config);
};

export const purgeUserData = async (confirmation, config = {}) => {
  return api.delete("/privacy/purge", { ...config, data: confirmation });
};

// System Health & Interoperability
export const getSystemHealth = async (config = {}) => {
  return api.get("/system/health", config);
};

export const getInteropSpec = async (config = {}) => {
  return api.get("/system/interop-spec", config);
};

// ─── Core Learning System APIs ──────────────────────────────────────────────
export const getCurriculumSubjects = async (config = {}) => {
  return api.get("/learning/subjects", config);
};

export const getSubjectCurriculum = async (subjectId, config = {}) => {
  return api.get(`/learning/subjects/${subjectId}`, config);
};

export const getTopicDetails = async (topicId, config = {}) => {
  return api.get(`/learning/topics/${topicId}`, config);
};

export const markTopicAsRead = async (topicId, config = {}) => {
  return api.post(`/learning/topics/${topicId}/read`, {}, config);
};

export const markTopicAsCompleted = async (topicId, config = {}) => {
  return api.post(`/learning/topics/${topicId}/complete`, {}, config);
};

export const getTopicQuizQuestions = async (topicId, count = 10, config = {}) => {
  return api.get(`/learning/topics/${topicId}/quiz?count=${count}`, config);
};

export const submitTopicQuizAnswers = async (topicId, payload, config = {}) => {
  return api.post(`/learning/topics/${topicId}/quiz/submit`, payload, config);
};

export const getStudentLearningDashboard = async (config = {}) => {
  return api.get("/learning/student/dashboard-summary", config);
};
export const getStudentLearningSummary = getStudentLearningDashboard;

export const getFacultyLearningStats = async (config = {}) => {
  return api.get("/learning/faculty/analytics", config);
};

export const generateUnitRoadmap = async (unitId, payload = {}, config = {}) => {
  return api.post(`/learning/units/${unitId}/roadmap`, payload, config);
};

export const searchCurriculum = async (params = {}, config = {}) => {
  return api.get("/learning/search", { params, ...config });
};

// AI Learning Companion & Voice Teacher
export const askLearningCompanion = async (payload, config = {}) => {
  return api.post("/learning/companion", payload, config);
};

export const evaluateStudentAnswer = async (payload, config = {}) => {
  return api.post("/learning/evaluate-answer", payload, config);
};

// Exam Answer & Revision Notes Generator
export const generateExamAnswer = async (payload, config = {}) => {
  return api.post("/learning/exam-answer", payload, config);
};

export const generateRevisionNotes = async (payload, config = {}) => {
  return api.post("/learning/revision-notes", payload, config);
};

// Learning Bookmarks
export const getLearningBookmarks = async (config = {}) => {
  return api.get("/learning/bookmarks", config);
};

export const toggleLearningBookmark = async (payload, config = {}) => {
  return api.post("/learning/bookmarks/toggle", payload, config);
};

// ─── Video Learning APIs (Inside My Learning) ──────────────────────────────
export const getTopicVideo = async (topicId, config = {}) => {
  return api.get(`/learning/topics/${topicId}/video`, config);
};

export const updateVideoProgress = async (topicId, payload, config = {}) => {
  return api.post(`/learning/topics/${topicId}/video/progress`, payload, config);
};

export const addVideoBookmark = async (topicId, payload, config = {}) => {
  return api.post(`/learning/topics/${topicId}/video/bookmark`, payload, config);
};

export const getSubjectVideoStats = async (subjectId, config = {}) => {
  return api.get(`/learning/subjects/${subjectId}/video-stats`, config);
};

// ─── Admin Video Validation APIs ───────────────────────────────────────────
export const getAdminVideoValidationReport = async (subjectId = "All", config = {}) => {
  return api.get(`/admin/videos/validation-report?subjectId=${encodeURIComponent(subjectId)}`, config);
};

export const verifyAdminSingleVideoUrl = async (videoUrl, config = {}) => {
  return api.post("/admin/videos/verify-url", { videoUrl }, config);
};

export const replaceAdminVideoUrl = async (id, payload, config = {}) => {
  return api.put(`/admin/videos/${id}/replace`, payload, config);
};

// Topic Mastery
export const updateTopicMastery = async (topicId, payload, config = {}) => {
  return api.post(`/learning/topics/${topicId}/mastery`, payload, config);
};

// Topic Notes (CRUD)
export const getTopicNotes = async (topicId, config = {}) => {
  return api.get(`/notes/${topicId}`, config);
};

export const createTopicNote = async (payload, config = {}) => {
  return api.post("/notes", payload, config);
};

export const deleteTopicNote = async (noteId, config = {}) => {
  return api.delete(`/notes/${noteId}`, config);
};

// Legacy SSO fallback
export const ssoLogin = async (provider, config = {}) => {
  return api.post("/auth/sso", { provider }, config);
};

// ─── Dynamic AI Study Planner ───────────────────────────────────────────────
export const generateStudyPlan = async (data, config = {}) => {
  return api.post("/roadmap/generate", data, config);
};

export const getStudyPlan = async (subject, config = {}) => {
  return api.get(`/roadmap/${subject}`, config);
};

export const updatePlanDayStatus = async (id, dayNumber, status, performanceRating = "good", config = {}) => {
  return api.patch(`/roadmap/${id}/day-status`, { dayNumber, status, performanceRating }, config);
};

export const rescheduleStudyPlan = async (id, config = {}) => {
  return api.post(`/roadmap/${id}/reschedule`, {}, config);
};

// ─── Skill Graph ─────────────────────────────────────────────────────────────
export const getSkillGraph = async (config = {}) => {
  return api.get("/skillgraph", config);
};

// ─── AI Coding Lab ────────────────────────────────────────────────────────────
export const getCodingProblems = async (config = {}) => {
  return api.get("/coding/problems", config);
};

export const getCodingStats = async (config = {}) => {
  return api.get("/coding/stats", config);
};

export const runCodingCode = async (data, config = {}) => {
  return api.post("/coding/run", data, config);
};

export const submitCodingCode = async (data, config = {}) => {
  return api.post("/coding/submit", data, config);
};

export const askCodingCopilot = async (data, config = {}) => {
  return api.post("/coding/copilot", data, config);
};

export const getCodingSubmissions = async (config = {}) => {
  return api.get("/coding/submissions", config);
};

export const getCodingBookmarks = async (config = {}) => {
  return api.get("/coding/bookmarks", config);
};

export const toggleCodingBookmark = async (data, config = {}) => {
  return api.post("/coding/bookmarks", data, config);
};

export const getCodingMistakes = async (config = {}) => {
  return api.get("/coding/mistakes", config);
};

export const debugCodingCode = async (data, config = {}) => {
  return api.post("/coding/debug", data, config);
};

export const generateCodingTestCases = async (data, config = {}) => {
  return api.post("/coding/generate-testcases", data, config);
};

// ─── AI Mock Interview ────────────────────────────────────────────────────────
export const getMockInterviewRecommendations = async (config = {}) => {
  return api.get("/interview/recommendations", config);
};

export const startMockInterview = async (payload, config = {}) => {
  const body = typeof payload === "string" ? { role: payload } : payload;
  return api.post("/interview/start", body, config);
};

export const getInterviewQuestionHint = async (id, data, config = {}) => {
  return api.post(`/interview/${id}/hint`, data, config);
};

export const submitInterviewAnswer = async (id, data, config = {}) => {
  return api.post(`/interview/${id}/answer`, data, config);
};

export const submitInterviewFollowUp = async (id, data, config = {}) => {
  return api.post(`/interview/${id}/follow-up-answer`, data, config);
};

export const completeMockInterview = async (id, config = {}) => {
  return api.post(`/interview/${id}/complete`, {}, config);
};

export const sendCoachChatMessage = async (id, message, config = {}) => {
  return api.post(`/interview/${id}/coach-chat`, { message }, config);
};

export const deleteMockInterview = async (id, config = {}) => {
  return api.delete(`/interview/${id}`, config);
};

export const getMockInterviewHistory = async (config = {}) => {
  return api.get("/interview/history", config);
};

// ─── Exam Preparation System ──────────────────────────────────────────────────
export const getExamFilters = async (config = {}) => {
  return api.get("/exam-prep/filters", config);
};

export const getExamQuestions = async (params = {}, config = {}) => {
  return api.get("/exam-prep/questions", { params, ...config });
};

export const submitExamAttempt = async (data, config = {}) => {
  return api.post("/exam-prep/submit", data, config);
};

export const getExamHistory = async (config = {}) => {
  return api.get("/exam-prep/history", config);
};

export const generateAIExamQuestions = async (data, config = {}) => {
  return api.post("/exam-prep/generate-ai", data, config);
};

// ─── AI Exam Copilot ──────────────────────────────────────────────────────────
export const askExamCopilot = async (data, config = {}) => {
  return api.post("/exam-prep/copilot/ask", data, config);
};

export const getMistakeBook = async (config = {}) => {
  return api.get("/exam-prep/copilot/mistake-book", config);
};

export const toggleMistakeBookItem = async (data, config = {}) => {
  return api.post("/exam-prep/copilot/mistake-book", data, config);
};

export const evaluateSimilarQuestion = async (data, config = {}) => {
  return api.post("/exam-prep/copilot/evaluate-similar", data, config);
};

// ─── Real AI Interactive Interview & Learning System ─────────────────────────
export const startCopilotInterview = async (data, config = {}) => {
  return api.post("/exam-prep/copilot/interview/start", data, config);
};

export const evaluateInterviewTurn = async (sessionId, data, config = {}) => {
  return api.post(`/exam-prep/copilot/interview/${sessionId}/evaluate-turn`, data, config);
};

export const submitInterviewFollowUpTurn = async (sessionId, data, config = {}) => {
  return api.post(`/exam-prep/copilot/interview/${sessionId}/submit-followup`, data, config);
};

export const completeCopilotInterview = async (sessionId, config = {}) => {
  return api.post(`/exam-prep/copilot/interview/${sessionId}/complete`, {}, config);
};

// ─── AI Career Twin ───────────────────────────────────────────────────────────
export const getCareerTwin = async (config = {}) => {
  return api.get("/career-twin", config);
};

export const refreshCareerTwin = async (data = {}, config = {}) => {
  return api.post("/career-twin/refresh", data, config);
};

export const updateCareerTwinSprintDay = async (day, status, config = {}) => {
  return api.patch(`/career-twin/sprint/${day}`, { status }, config);
};

export const updateCareerTwinRole = async (targetRole, config = {}) => {
  return api.patch("/career-twin/target-role", { targetRole }, config);
};

export const sendCareerTwinChatMessage = async (message, config = {}) => {
  return api.post("/career-twin/coach-chat", { message }, config);
};

export const simulateSkillImprovement = async (skill, targetScore, config = {}) => {
  return api.get("/career-twin/simulate", {
    params: { skill, targetScore },
    ...config,
  });
};

// ─── Rewards & Challenges Engine ─────────────────────────────────────────────
export const getRewardsOverview = async (config = {}) => {
  return api.get("/rewards", config);
};

export const getRewardHistory = async (type = "All", config = {}) => {
  return api.get("/rewards/history", {
    params: { type },
    ...config,
  });
};

export const getBadges = async (config = {}) => {
  return api.get("/rewards/badges", config);
};

export const getChallenges = async (config = {}) => {
  return api.get("/rewards/challenges", config);
};

export const startChallenge = async (challengeId, config = {}) => {
  return api.post(`/rewards/challenges/${challengeId}/start`, {}, config);
};

export const recordLearningActivityReward = async (activityData, config = {}) => {
  return api.post("/rewards/activity", activityData, config);
};

export const updateRewardSettings = async (settings, config = {}) => {
  return api.patch("/rewards/settings", { settings }, config);
};

export default api;

