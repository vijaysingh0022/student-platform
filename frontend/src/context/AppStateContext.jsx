/**
 * AppStateContext — Global Reactive State Manager
 *
 * This context acts as the single source of truth for all live user metrics.
 * When any module (Test, Roadmap, Career) mutates data, they call the
 * appropriate `refresh*` function here, which re-fetches and broadcasts to
 * every subscribed component in real-time.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import api from "../services/api.js";

const AppStateContext = createContext(null);

export const AppStateProvider = ({ children }) => {
  // ── Core metrics ──────────────────────────────────────────────────────────
  const [testResults, setTestResults] = useState([]);
  const [careerReadiness, setCareerReadiness] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [roadmaps, setRoadmaps] = useState({});

  // ── Loading states per module ─────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState({
    tests: false,
    career: false,
    prediction: false,
  });

  // ── Version counters — increment to force subscriber re-renders ───────────
  const [testVersion, setTestVersion] = useState(0);
  const [careerVersion, setCareerVersion] = useState(0);
  const [roadmapVersion, setRoadmapVersion] = useState(0);
  const [learningVersion, setLearningVersion] = useState(0);

  // ── De-bounce refs ────────────────────────────────────────────────────────
  const debounceRef = useRef({});

  const debounced = useCallback((key, fn, delay = 400) => {
    if (debounceRef.current[key]) clearTimeout(debounceRef.current[key]);
    debounceRef.current[key] = setTimeout(fn, delay);
  }, []);

  // ── refreshLearning ───────────────────────────────────────────────────────
  const refreshLearning = useCallback(() => {
    setLearningVersion((v) => v + 1);
  }, []);

  // ── onTopicCompleted — called when user finishes a topic ──────────────────
  const onTopicCompleted = useCallback((topicId, subjectId) => {
    setLearningVersion((v) => v + 1);
    refreshCareer();
  }, []);

  // ── onTopicQuizSubmitted — called when user finishes a topic quiz ─────────
  const onTopicQuizSubmitted = useCallback((topicId, subjectId, quizResult) => {
    setLearningVersion((v) => v + 1);
    setTestVersion((v) => v + 1);
    refreshCareer();
    refreshPrediction();
  }, []);

  // ── refreshTests ──────────────────────────────────────────────────────────
  const refreshTests = useCallback(async () => {
    debounced("tests", async () => {
      setRefreshing((r) => ({ ...r, tests: true }));
      try {
        const { data } = await api.get("/tests/results");
        setTestResults(data || []);
        setTestVersion((v) => v + 1);
      } catch (err) {
        console.warn("[AppState] refreshTests failed:", err.message);
      } finally {
        setRefreshing((r) => ({ ...r, tests: false }));
      }
    });
  }, [debounced]);

  // ── refreshCareer ─────────────────────────────────────────────────────────
  const refreshCareer = useCallback(async () => {
    debounced("career", async () => {
      setRefreshing((r) => ({ ...r, career: true }));
      try {
        const { data } = await api.get("/career/dashboard");
        setCareerReadiness(data);
        setCareerVersion((v) => v + 1);
      } catch (err) {
        console.warn("[AppState] refreshCareer failed:", err.message);
      } finally {
        setRefreshing((r) => ({ ...r, career: false }));
      }
    });
  }, [debounced]);

  // ── refreshPrediction ─────────────────────────────────────────────────────
  const refreshPrediction = useCallback(async () => {
    debounced("prediction", async () => {
      setRefreshing((r) => ({ ...r, prediction: true }));
      try {
        const { data } = await api.get("/prediction/readiness");
        setPredictionData(data);
      } catch (err) {
        console.warn("[AppState] refreshPrediction failed:", err.message);
      } finally {
        setRefreshing((r) => ({ ...r, prediction: false }));
      }
    });
  }, [debounced]);

  // ── refreshRoadmap ────────────────────────────────────────────────────────
  const refreshRoadmap = useCallback(async (subject) => {
    if (!subject) return;
    debounced(`roadmap_${subject}`, async () => {
      try {
        const { data } = await api.get(`/roadmap/${subject}`);
        setRoadmaps((prev) => ({ ...prev, [subject]: data }));
        setRoadmapVersion((v) => v + 1);
      } catch (err) {
        // roadmap may not exist yet — not an error
      }
    });
  }, [debounced]);

  // ── onTestSubmitted — master trigger called right after a test is graded ──
  const onTestSubmitted = useCallback(
    (subject, resultData) => {
      if (resultData) {
        setTestResults((prev) => [resultData, ...prev]);
        setTestVersion((v) => v + 1);
      }
      refreshTests();
      refreshCareer();
      refreshPrediction();
      if (subject) refreshRoadmap(subject);
    },
    [refreshTests, refreshCareer, refreshPrediction, refreshRoadmap]
  );

  // ── onRoadmapDayToggled ───────────────────────────────────────────────────
  const onRoadmapDayToggled = useCallback(
    (subject, updatedRoadmap) => {
      if (subject && updatedRoadmap) {
        setRoadmaps((prev) => ({ ...prev, [subject]: updatedRoadmap }));
        setRoadmapVersion((v) => v + 1);
      }
      refreshCareer();
    },
    [refreshCareer]
  );

  // ── onResumeAnalyzed ──────────────────────────────────────────────────────
  const onResumeAnalyzed = useCallback(() => {
    refreshCareer();
    refreshPrediction();
  }, [refreshCareer, refreshPrediction]);

  // ── Derived aggregates ────────────────────────────────────────────────────
  const totalTestsTaken = testResults.length;

  const overallMasteryBySubject = testResults.reduce((acc, r) => {
    if (!acc[r.subject]) acc[r.subject] = [];
    acc[r.subject].push(r.scorePercent);
    return acc;
  }, {});

  const subjectAverages = Object.fromEntries(
    Object.entries(overallMasteryBySubject).map(([subj, scores]) => [
      subj,
      Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    ])
  );

  const jobReadinessScore = careerReadiness?.jobReadinessScore ?? null;
  const roadmapProgress = careerReadiness?.roadmapExecutionRate ?? 0;

  return (
    <AppStateContext.Provider
      value={{
        testResults,
        careerReadiness,
        predictionData,
        roadmaps,
        totalTestsTaken,
        subjectAverages,
        jobReadinessScore,
        roadmapProgress,
        testVersion,
        careerVersion,
        roadmapVersion,
        learningVersion,
        refreshing,
        onTestSubmitted,
        onRoadmapDayToggled,
        onResumeAnalyzed,
        onTopicCompleted,
        onTopicQuizSubmitted,
        refreshTests,
        refreshCareer,
        refreshPrediction,
        refreshRoadmap,
        refreshLearning,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
};
