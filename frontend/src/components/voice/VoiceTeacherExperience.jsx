import React, { useState, useEffect, useRef, useCallback } from "react";
import { formatTeachingScript, getBestBrowserVoice } from "../../utils/voiceScriptFormatter.js";
import { askLearningCompanion, evaluateStudentAnswer } from "../../services/api.js";

const TEACHING_MODES = [
  { id: "teacher", label: "🎓 Teacher Mode", rate: 0.88, desc: "Slow, clear, educational pacing" },
  { id: "exam", label: "🎯 Exam Mode", rate: 0.95, desc: "Structured, university answer format" },
  { id: "simple", label: "💡 Simple Explanation", rate: 0.85, desc: "Slowest, intuitive analogies" },
  { id: "conversational", label: "🗣 Conversational", rate: 1.0, desc: "Natural normal discussion" },
];

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5];
const WAVE_HEIGHTS = [35, 72, 52, 90, 60, 80, 45, 68, 55, 82, 40, 70, 50];

const STATUS_CONFIG = {
  ready:  { label: "● Ready",       dot: "bg-slate-400",             badge: "bg-slate-100 text-slate-600 border-slate-200" },
  listening: { label: "🔵 Listening...", dot: "bg-rose-500 animate-ping",  badge: "bg-rose-100 text-rose-800 border-rose-300" },
  thinking:  { label: "🟣 Thinking...", dot: "bg-purple-500 animate-bounce", badge: "bg-purple-100 text-purple-800 border-purple-300" },
  speaking:  { label: "🔊 Speaking...", dot: "bg-emerald-500 animate-pulse", badge: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  paused:    { label: "⏸ Paused",      dot: "bg-amber-500",            badge: "bg-amber-100 text-amber-800 border-amber-300" },
  finished:  { label: "✓ Finished",    dot: "bg-blue-500",             badge: "bg-blue-100 text-blue-800 border-blue-300" },
  error:     { label: "⚠ Error",       dot: "bg-red-500",              badge: "bg-red-100 text-red-800 border-red-300" },
};

const VoiceTeacherExperience = ({
  topicId = "dbms-u5-normalization",
  topicTitle = "Database Normalization",
  subjectId = "dbms",
  subjectName = "Database Management Systems",
  initialText = "",
  onClose,
  embedded = false,
}) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(
    () => localStorage.getItem("learnx_voice_uri") || ""
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("learnx_voice_lang") || "english"
  );
  const [teachingMode, setTeachingMode] = useState("teacher");
  const [speed, setSpeed] = useState(
    () => parseFloat(localStorage.getItem("learnx_voice_speed")) || 0.88
  );
  const [volume, setVolume] = useState(
    () => parseFloat(localStorage.getItem("learnx_voice_vol")) || 1.0
  );
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [highlightSpoken, setHighlightSpoken] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [rawExplanation, setRawExplanation] = useState(initialText || "");
  const [scriptChunks, setScriptChunks] = useState([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const [status, setStatus] = useState("ready");
  const [errorMessage, setErrorMessage] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [difficulty, setDifficulty] = useState(
    () => localStorage.getItem("learnx_voice_diff") || "beginner"
  );
  const [prereqAlert, setPrereqAlert] = useState(null);
  const [nextConcept, setNextConcept] = useState(null);
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);

  // Active Learning & Adaptive Telemetry state
  const [activeTestQuestion, setActiveTestQuestion] = useState(null);
  const [studentAnswerInput, setStudentAnswerInput] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  // Learning Session Tracking Memory
  const [sessionStats, setSessionStats] = useState(() => {
    try {
      const saved = localStorage.getItem(`learnx_session_${subjectId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      subject: subjectName,
      chapter: "Core Foundations",
      currentConcept: topicTitle,
      completedConcepts: ["SQL", "ER Model"],
      questionsAttempted: 0,
      correctCount: 0,
      weakConcepts: ["Functional Dependency", "Normalization"],
      strongConcepts: ["SQL", "ER Model"],
      mistakes: [],
      recommendedSequence: [
        "Functional Dependency",
        "1NF (Atomicity)",
        "2NF (No Partial Dependency)",
        "3NF (No Transitive Dependency)",
        "BCNF (Super Key Strict)",
      ],
    };
  });

  const [conversationHistory, setConversationHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Refs to avoid stale closures in recursive speech engine
  const recognitionRef = useRef(null);
  const nextChunkTimeoutRef = useRef(null);
  const isPlayingRef = useRef(false);
  const scriptChunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const speedRef = useRef(speed);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  const voicesRef = useRef([]);
  const selectedVoiceURIRef = useRef(selectedVoiceURI);
  const languageRef = useRef(language);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { volumeRef.current = isMuted ? 0 : volume; }, [volume, isMuted]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { currentChunkIndexRef.current = currentChunkIndex; }, [currentChunkIndex]);
  useEffect(() => { voicesRef.current = voices; }, [voices]);
  useEffect(() => { selectedVoiceURIRef.current = selectedVoiceURI; }, [selectedVoiceURI]);
  useEffect(() => { languageRef.current = language; }, [language]);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const available = window.speechSynthesis.getVoices() || [];
        setVoices(available);
        voicesRef.current = available;
      }
    };
    updateVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    if (rawExplanation) {
      const { chunks } = formatTeachingScript(rawExplanation, { language });
      scriptChunksRef.current = chunks;
      setScriptChunks(chunks);
      setCurrentChunkIndex(0);
      currentChunkIndexRef.current = 0;
      setStatus("ready");
    }
  }, [rawExplanation, language]);

  const fetchInitialExplanation = useCallback(async (lang) => {
    const activeLang = lang || languageRef.current;
    setIsInitialLoading(true);
    setErrorMessage("");
    try {
      // Build a language-specific prompt so AI responds in the correct language
      const langPrompt =
        activeLang === "hindi"
          ? `आप एक अनुभवी हिंदी शिक्षक हैं। ${topicTitle} विषय को हिंदी में विस्तार से समझाइए। परिचय, सरल परिभाषा, वास्तविक जीवन का उदाहरण, चरण-दर-चरण व्याख्या, मुख्य नियम और संक्षिप्त सारांश शामिल करें। पूरा उत्तर प्राकृतिक हिंदी में दें। Python keywords, code, variable names और technical terms अंग्रेज़ी में ही रखें।`
          : activeLang === "hinglish"
          ? `Aap ek experienced teacher hain. ${topicTitle} ko Hinglish mein samjhao — jaise ek senior mentor junior ko samjhata hai. Introduction, simple definition with real-life analogy, step-by-step explanation, ek worked example, key rules, aur brief summary include karo. Python keywords, code, variable names English mein hi rakho.`
          : `Explain ${topicTitle} as a clear, friendly teacher. Provide a complete structured teaching session: introduction, definition with a simple real-world analogy, step-by-step explanation, a worked example, key rules to remember, and a brief summary. Write in a natural, conversational teaching style.`;

      const res = await askLearningCompanion({
        topicId,
        subjectId,
        prompt: langPrompt,
        mode: "beginner",
        language: activeLang,
        history: [],
        isVoice: true,
      });
      const reply =
        res?.data?.text ||
        (activeLang === "hindi"
          ? `आज हम ${topicTitle} के बारे में सीखेंगे। यह ${subjectName} का एक महत्वपूर्ण विषय है।`
          : activeLang === "hinglish"
          ? `Aaj hum ${topicTitle} ke baare mein padhenge. Yeh ${subjectName} ka ek important topic hai.`
          : `Welcome. Today we will learn about ${topicTitle} in ${subjectName}.`);
      setRawExplanation(reply);
    } catch (err) {
      console.warn("Initial voice explanation fetch failed:", err);
      const activeLang2 = languageRef.current;
      const fallback =
        activeLang2 === "hindi"
          ? `${topicTitle} में आपका स्वागत है। यह ${subjectName} का एक महत्वपूर्ण अध्याय है। कोई प्रश्न पूछने के लिए माइक्रोफ़ोन पर क्लिक करें या नीचे टाइप करें।`
          : activeLang2 === "hinglish"
          ? `${topicTitle} mein aapka swagat hai. Koi doubt pucho ya niche type karo.`
          : `Welcome to LearnX Voice Teacher. Today we are learning about ${topicTitle} in ${subjectName}. This is an important topic in your curriculum. Click the microphone to ask a specific doubt, or type your question below.`;
      const { chunks } = formatTeachingScript(fallback, { language: activeLang2 });
      scriptChunksRef.current = chunks;
      setScriptChunks(chunks);
      setStatus("ready");
    } finally {
      setIsInitialLoading(false);
    }
  }, [topicId, subjectId, topicTitle, subjectName]);

  useEffect(() => {
    if (!initialText && topicId && topicTitle) {
      fetchInitialExplanation(languageRef.current);
    }
  }, [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch explanation when language changes so script is in the new language
  const prevLangRef = useRef(language);
  useEffect(() => {
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      // Stop current playback and fetch new script in selected language
      isPlayingRef.current = false;
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
      if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
      setStatus("ready");
      fetchInitialExplanation(language);
    }
  }, [language, fetchInitialExplanation]);

  useEffect(() => {
    return () => {
      if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
      isPlayingRef.current = false;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  const getActiveVoice = useCallback(() => {
    const v = voicesRef.current;
    if (!v || v.length === 0) return null;
    if (selectedVoiceURIRef.current) {
      const found = v.find((voice) => voice.voiceURI === selectedVoiceURIRef.current);
      if (found) return found;
    }
    return getBestBrowserVoice(v, languageRef.current);
  }, []);

  // Core speech engine — reads only from refs, never stale
  const speakChunkInternal = useCallback((index) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setStatus("error");
      setErrorMessage("Speech synthesis is not supported in this browser.");
      return;
    }
    const chunks = scriptChunksRef.current;
    if (index >= chunks.length) {
      isPlayingRef.current = false;
      setStatus("finished");
      return;
    }
    window.speechSynthesis.cancel();
    const chunkText = chunks[index];
    if (!chunkText || chunkText.trim() === "") {
      speakChunkInternal(index + 1);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunkText);
    const targetLang = languageRef.current;
    const voice = getActiveVoice();

    if (voice) {
      utterance.voice = voice;
    } else if (targetLang === "hindi") {
      // No hi-IN voice available — warn user and abort to prevent English mispronunciation
      console.warn("[VoiceTeacher] No Hindi (hi-IN) voice found on this device.");
      isPlayingRef.current = false;
      setStatus("error");
      setErrorMessage(
        "इस डिवाइस पर Hindi (hi-IN) voice उपलब्ध नहीं है। Chrome पर जाएं: Settings → Manage Languages → Hindi add करें। अभी text पढ़कर सीखें।"
      );
      return;
    }

    utterance.rate = speedRef.current;
    utterance.pitch = 1.0;
    utterance.volume = isMutedRef.current ? 0 : volumeRef.current;
    utterance.lang =
      targetLang === "hindi" ? "hi-IN" :
      targetLang === "hinglish" ? "hi-IN" : "en-US";

    utterance.onstart = () => {
      isPlayingRef.current = true;
      setCurrentChunkIndex(index);
      currentChunkIndexRef.current = index;
      setStatus("speaking");
      setErrorMessage("");
    };
    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      nextChunkTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) speakChunkInternal(index + 1);
      }, 280);
    };
    utterance.onerror = (e) => {
      if (e.error === "canceled" || e.error === "interrupted") return;
      console.warn("Speech synthesis error:", e);
      isPlayingRef.current = false;
      setStatus("error");
      setErrorMessage("Voice playback couldn't start. Try another voice or use text mode.");
    };
    window.speechSynthesis.speak(utterance);
  }, [getActiveVoice]);

  const handlePlay = useCallback(() => {
    if (scriptChunksRef.current.length === 0) return;
    isPlayingRef.current = true;
    const startIndex = status === "finished" ? 0 : currentChunkIndexRef.current;
    setStatus("speaking");
    speakChunkInternal(startIndex);
  }, [status, speakChunkInternal]);

  const handlePause = useCallback(() => {
    isPlayingRef.current = false;
    if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setStatus("paused");
  }, []);

  const handleReplay = useCallback(() => {
    if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    isPlayingRef.current = true;
    setCurrentChunkIndex(0);
    currentChunkIndexRef.current = 0;
    setStatus("speaking");
    setTimeout(() => speakChunkInternal(0), 80);
  }, [speakChunkInternal]);

  const handleStop = useCallback(() => {
    isPlayingRef.current = false;
    if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setCurrentChunkIndex(0);
    currentChunkIndexRef.current = 0;
    setStatus("ready");
  }, []);

  const handleNextSentence = useCallback(() => {
    const next = currentChunkIndexRef.current + 1;
    if (next < scriptChunksRef.current.length) {
      setCurrentChunkIndex(next);
      currentChunkIndexRef.current = next;
      if (isPlayingRef.current) {
        if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
        window.speechSynthesis.cancel();
        setTimeout(() => speakChunkInternal(next), 80);
      }
    }
  }, [speakChunkInternal]);

  const handlePrevSentence = useCallback(() => {
    const prev = Math.max(0, currentChunkIndexRef.current - 1);
    setCurrentChunkIndex(prev);
    currentChunkIndexRef.current = prev;
    if (isPlayingRef.current) {
      if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
      window.speechSynthesis.cancel();
      setTimeout(() => speakChunkInternal(prev), 80);
    }
  }, [speakChunkInternal]);

  const handleRepeatSentence = useCallback(() => {
    if (nextChunkTimeoutRef.current) clearTimeout(nextChunkTimeoutRef.current);
    window.speechSynthesis.cancel();
    isPlayingRef.current = true;
    setStatus("speaking");
    setTimeout(() => speakChunkInternal(currentChunkIndexRef.current), 80);
  }, [speakChunkInternal]);

  const handleSelectMode = (modeObj) => {
    setTeachingMode(modeObj.id);
    setSpeed(modeObj.rate);
    speedRef.current = modeObj.rate;
    localStorage.setItem("learnx_voice_speed", String(modeObj.rate));
  };

  const isAskingRef = useRef(false);

  const handleAskAI = useCallback(async (queryText, options = {}) => {
    if (!queryText || !queryText.trim()) return;
    if (isAskingRef.current || status === "thinking") return; // prevent duplicate requests

    isAskingRef.current = true;
    handleStop();
    setStatus("thinking");
    setErrorMessage("");

    const modeMap = { exam: "exam_ready", simple: "simpler", conversational: "beginner", teacher: "beginner" };
    const activeLang = languageRef.current;

    // Detect if this is a quick action prompt that needs contextual subject/topic/chunk backing
    let contextualQuery = queryText.trim();
    const currentContext = currentChunkIndexRef.current < scriptChunksRef.current.length && scriptChunksRef.current[currentChunkIndexRef.current]
      ? scriptChunksRef.current[currentChunkIndexRef.current]
      : topicTitle;

    const lowerQ = contextualQuery.toLowerCase();
    if (lowerQ.includes("example") || lowerQ.includes("उदाहरण")) {
      contextualQuery = `${topicTitle} (${currentContext}) ko ek realistic, real-life practical example ke saath detail mein samjhao.`;
    } else if (lowerQ.includes("exam") || lowerQ.includes("लिखूं") || lowerQ.includes("likhun")) {
      contextualQuery = `${topicTitle} (${currentContext}) par semester exam mein 5-10 marks ka structured answer kaise likhna hai? Point-wise, definition, diagram aur key points ke saath samjhao.`;
    } else if (lowerQ.includes("analogy") || lowerQ.includes("सरल")) {
      contextualQuery = `${topicTitle} (${currentContext}) ko ek simple real-world analogy ke saath samjhao taaki concept bilkul clear ho jaye.`;
    } else if (lowerQ.includes("numerical") || lowerQ.includes("problem")) {
      contextualQuery = `${topicTitle} (${currentContext}) par ek standard solved numerical/practical problem step-by-step calculate karke samjhao.`;
    } else if (lowerQ.includes("difference") || lowerQ.includes("comparison") || lowerQ.includes("अंतर")) {
      contextualQuery = `${topicTitle} (${currentContext}) ke main components ya related concepts ke beech clear differences aur comparative analysis point-wise samjhao.`;
    }

    // Wrap the user query with strict language instructions
    let enrichedQuery = contextualQuery;
    if (activeLang === "hindi") {
      enrichedQuery = `[IMPORTANT: Respond ONLY in Hindi (Devanagari script). Do NOT use English sentences. Technical terms like Python keywords, code, variable names may stay in English.]

प्रश्न: ${contextualQuery}`;
    } else if (activeLang === "hinglish") {
      enrichedQuery = `[IMPORTANT: Respond in Hinglish — conversational Hindi mixed with English technical terms. Do NOT respond in pure English.]

Question: ${contextualQuery}`;
    }

    try {
      const res = await askLearningCompanion({
        topicId,
        subjectId,
        prompt: enrichedQuery,
        mode: modeMap[teachingMode] || "beginner",
        difficulty,
        skipPrereq: options.skipPrereq || false,
        language: activeLang,
        history: conversationHistory.slice(-4),
        isVoice: true,
      });

      if (res?.data?.prerequisiteAlert) {
        setPrereqAlert(res.data.prerequisiteAlert);
      } else {
        setPrereqAlert(null);
      }

      if (res?.data?.nextRecommendedConcept) {
        setNextConcept(res.data.nextRecommendedConcept);
      }

      if (res?.data?.concept) {
        setActiveConceptInfo(res.data.concept);
      }

      const reply = res?.data?.text || (
        activeLang === "hindi"
          ? `${topicTitle} में यह concept बहुत महत्वपूर्ण है। कृपया अपना प्रश्न दोबारा पूछें।`
          : activeLang === "hinglish"
          ? `${topicTitle} mein yeh concept important hai. Please dobara pucho.`
          : `In ${topicTitle}, this concept organizes data with clear structural constraints.`
      );
      setConversationHistory((prev) => [...prev, { role: "user", content: queryText }, { role: "assistant", content: reply }]);
      const { chunks } = formatTeachingScript(reply, { language: activeLang });
      scriptChunksRef.current = chunks;
      setScriptChunks(chunks);
      setCurrentChunkIndex(0);
      currentChunkIndexRef.current = 0;
      if (autoPlay) {
        setTimeout(() => {
          isPlayingRef.current = true;
          setStatus("speaking");
          speakChunkInternal(0);
        }, 200);
      } else {
        setStatus("ready");
      }
    } catch (err) {
      console.error("AI teacher request failed:", err);
      setStatus("ready");
      setErrorMessage(
        activeLang === "hindi"
          ? "AI Teacher से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।"
          : activeLang === "hinglish"
          ? "AI Teacher se contact nahi ho paya. Please dobara try karo."
          : "Could not reach AI Teacher. Please check connection and try again."
      );
    } finally {
      isAskingRef.current = false;
    }
  }, [topicId, subjectId, teachingMode, difficulty, conversationHistory, autoPlay, handleStop, speakChunkInternal, topicTitle, status]);

  const handleTriggerConceptTest = (specificQuestion = null) => {
    const activeConcept = activeConceptInfo?.activeSubconcept || activeConceptInfo?.name || topicTitle;
    let testQ = specificQuestion;
    if (!testQ) {
      if (activeConcept.toLowerCase().includes("2nf")) {
        testQ = "Does 2NF eliminate partial functional dependencies, and what is the exact condition required for a relation to be in 2NF?";
      } else if (activeConcept.toLowerCase().includes("3nf")) {
        testQ = "What is transitive functional dependency in 3NF and what is the condition for every non-trivial FD X -> Y?";
      } else if (activeConcept.toLowerCase().includes("bcnf")) {
        testQ = "How is BCNF stricter than 3NF? In BCNF, what must the determinant X strictly be?";
      } else if (activeConcept.toLowerCase().includes("functional dependency")) {
        testQ = "If attribute X functionally determines Y (X -> Y), does that mean two tuples with the same X must have the same Y value?";
      } else {
        testQ = `Quick Concept Check on ${activeConcept}: State the main invariant or condition required for ${activeConcept} and give one scenario where it is violated.`;
      }
    }
    setActiveTestQuestion(testQ);
    setEvaluationResult(null);
    setStudentAnswerInput("");
  };

  const handleSubmitStudentAnswer = async (e) => {
    if (e) e.preventDefault();
    if (!studentAnswerInput.trim() || isEvaluating) return;

    setIsEvaluating(true);
    try {
      const activeConcept = activeConceptInfo?.name || topicTitle;
      const res = await evaluateStudentAnswer({
        questionText: activeTestQuestion || `Check on ${activeConcept}`,
        studentAnswer: studentAnswerInput,
        conceptName: activeConcept,
        subjectId,
        language,
        difficulty,
      });

      const evalData = res?.data || {
        status: "correct",
        badge: "🟢 Correct",
        feedback: "Great job! Your answer demonstrates a clear understanding.",
      };

      setEvaluationResult(evalData);

      // Update adaptive session statistics & update recommendations
      setSessionStats((prev) => {
        const isCorr = evalData.status === "correct";
        const isPart = evalData.status === "partial";
        const newAttempts = prev.questionsAttempted + 1;
        const newCorrect = prev.correctCount + (isCorr ? 1 : isPart ? 0.5 : 0);

        let newWeak = [...prev.weakConcepts];
        let newStrong = [...prev.strongConcepts];
        let newMistakes = [...prev.mistakes];

        if (isCorr) {
          if (!newStrong.includes(activeConcept)) newStrong.push(activeConcept);
          newWeak = newWeak.filter((c) => c !== activeConcept);
        } else {
          if (!newWeak.includes(activeConcept)) newWeak.push(activeConcept);
          newStrong = newStrong.filter((c) => c !== activeConcept);
          if (evalData.missingPart && !newMistakes.includes(evalData.missingPart)) {
            newMistakes.push(evalData.missingPart);
          }
        }

        const updated = {
          ...prev,
          questionsAttempted: newAttempts,
          correctCount: newCorrect,
          weakConcepts: newWeak,
          strongConcepts: newStrong,
          mistakes: newMistakes,
          recommendedSequence: newWeak.length > 0 ? [...newWeak, "BCNF (Super Key Strict)"] : prev.recommendedSequence,
        };

        try {
          localStorage.setItem(`learnx_session_${subjectId}`, JSON.stringify(updated));
        } catch (e) {}

        return updated;
      });

      // If student was incorrect, speak the re-teaching explanation or feedback
      if (evalData.reteachExplanation) {
        const { chunks } = formatTeachingScript(evalData.reteachExplanation, { language });
        scriptChunksRef.current = chunks;
        setScriptChunks(chunks);
        setCurrentChunkIndex(0);
        currentChunkIndexRef.current = 0;
        if (autoPlay) {
          setTimeout(() => {
            isPlayingRef.current = true;
            setStatus("speaking");
            speakChunkInternal(0);
          }, 300);
        }
      }
    } catch (err) {
      console.warn("Evaluation failed:", err);
      setEvaluationResult({
        status: "partial",
        badge: "🟡 Evaluated",
        feedback: "Concept check recorded. Keep practicing to build confidence!",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartListening = () => {
    const SpeechRecognition = typeof window !== "undefined"
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;
    if (!SpeechRecognition) {
      const activeLang = languageRef.current;
      setErrorMessage(
        activeLang === "hindi"
          ? "Voice input इस browser में support नहीं करता। कृपया question type करें।"
          : activeLang === "hinglish"
          ? "Voice input is browser mein support nahi karta. Question type karo."
          : "Voice input isn't supported in this browser. Please type your question."
      );
      return;
    }
    if (isPlayingRef.current) handlePause();
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      const activeLang = languageRef.current;
      recognition.lang = (activeLang === "hindi" || activeLang === "hinglish") ? "hi-IN" : "en-US";
      recognition.onstart = () => { setStatus("listening"); setErrorMessage(""); };
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) handleAskAI(transcript);
      };
      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setStatus("ready");
        const lang2 = languageRef.current;
        if (event.error === "not-allowed") {
          setErrorMessage(
            lang2 === "hindi"
              ? "Microphone permission नहीं मिली। Browser settings में allow करें।"
              : lang2 === "hinglish"
              ? "Microphone permission nahi mili. Browser settings mein allow karo."
              : "Microphone permission denied. Please allow microphone access."
          );
        } else if (event.error === "no-speech") {
          setErrorMessage(
            lang2 === "hindi"
              ? "कोई आवाज़ नहीं सुनाई दी। दोबारा बोलने की कोशिश करें।"
              : lang2 === "hinglish"
              ? "Koi awaaz nahi aayi. Dobara bolne ki koshish karo."
              : "No speech detected. Please try speaking again."
          );
        }
      };
      recognition.onend = () => { if (status === "listening") setStatus("ready"); };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Recognition start error:", err);
      setStatus("ready");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (status === "speaking") handlePause(); else handlePlay();
      }
      if (e.code === "KeyR") handleReplay();
      if (e.code === "ArrowUp") {
        e.preventDefault();
        const nv = Math.min(1, volume + 0.1);
        setVolume(nv); volumeRef.current = nv;
        localStorage.setItem("learnx_voice_vol", String(nv));
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        const nv = Math.max(0, volume - 0.1);
        setVolume(nv); volumeRef.current = nv;
        localStorage.setItem("learnx_voice_vol", String(nv));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, volume, handlePlay, handlePause, handleReplay]);

  const currentChunk = scriptChunks[currentChunkIndex] || "";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const activeVoice = getActiveVoice();
  const activeVoiceName = activeVoice?.name || (language === "hindi" ? "Hindi voice not found" : "Default Voice");
  const totalChunks = scriptChunks.length;
  const isSpeechSupported = typeof window !== "undefined" && !!window.speechSynthesis;

  // Language-aware UI strings
  const uiStr = {
    noHindiVoiceWarning: language === "hindi" && voices.length > 0 && !getActiveVoice()
      ? "⚠ Hindi (hi-IN) voice इस browser में नहीं मिला। Chrome Settings → Languages → Hindi add करें।"
      : null,
    loadingMsg:
      language === "hindi" ? `${topicTitle} के लिए teaching script तैयार हो रही है...`
      : language === "hinglish" ? `${topicTitle} ke liye teaching script ban rahi hai...`
      : `Preparing teaching script for ${topicTitle}...`,
    noScriptMsg:
      language === "hindi" ? "कोई teaching script load नहीं है। कोई प्रश्न पूछें।"
      : language === "hinglish" ? "Koi teaching script load nahi hai. Koi sawaal pucho."
      : "No teaching script loaded. Ask a question or wait for AI to prepare your lesson.",
    sentenceLabel:
      language === "hindi" ? `वाक्य ${currentChunkIndex + 1} / ${totalChunks}`
      : language === "hinglish" ? `Sentence ${currentChunkIndex + 1} of ${totalChunks}`
      : `Sentence ${currentChunkIndex + 1} of ${totalChunks}`,
    noScriptLabel:
      language === "hindi" ? "कोई script load नहीं"
      : language === "hinglish" ? "No script loaded"
      : "No script loaded",
    thinkingMsg:
      language === "hindi" ? "AI Teacher आपकी explanation तैयार कर रहा है..."
      : language === "hinglish" ? "AI Teacher aapki explanation prepare kar raha hai..."
      : "AI Teacher is preparing your explanation...",
    askPlaceholder:
      language === "hindi" ? `${topicTitle} के बारे में Hindi या Hinglish में पूछें...`
      : language === "hinglish" ? `${topicTitle} ke baare mein Hinglish mein pucho...`
      : `Ask in English or Hinglish about ${topicTitle}...`,
    askLabel:
      language === "hindi" ? "AI Teacher से प्रश्न पूछें:"
      : language === "hinglish" ? "AI Teacher se sawaal pucho:"
      : "Ask your AI Teacher a doubt:",
    testLabel:
      language === "hindi" ? "⚡ मेरी समझ परखें"
      : language === "hinglish" ? "⚡ Test My Understanding"
      : "⚡ Test My Understanding",
    speakBtn:
      language === "hindi" ? "बोलें" : language === "hinglish" ? "Bolo" : "Speak",
    listeningLabel:
      language === "hindi" ? "सुन रहे हैं..."
      : language === "hinglish" ? "Sun raha hoon..."
      : "Listening...",
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col transition-all ${embedded ? "w-full p-5 sm:p-7 space-y-5" : "w-full max-w-xl mx-auto p-5 space-y-4"}`}
      role="region"
      aria-label="LearnX Voice Teacher"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white text-lg shadow-md transition-all ${
            status === "speaking" ? "bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/30"
            : status === "listening" ? "bg-gradient-to-tr from-rose-500 to-pink-600 shadow-rose-500/30"
            : status === "thinking" ? "bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-purple-500/30"
            : "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20"
          }`}>
            {status === "listening" ? "🎙" : status === "thinking" ? "🧠" : "🔊"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">LearnX Voice Teacher</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 border ${statusCfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                <span>{statusCfg.label}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[280px]">{topicTitle} · {subjectName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoadmapModal(true)}
            title="Personalized Learning Roadmap & Session Memory"
            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 flex items-center gap-1 transition-colors shadow-xs"
          >
            <span>🗺️</span>
            <span className="hidden sm:inline">Adaptive Roadmap</span>
          </button>
          <button onClick={() => setShowSettings(!showSettings)} title="Voice Settings" aria-label="Open voice settings"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center justify-center transition-colors">⚙</button>
          {onClose && (
            <button onClick={() => { handleStop(); onClose(); }} aria-label="Close Voice Teacher"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center justify-center transition-colors">✕</button>
          )}
        </div>
      </div>

      {/* SETTINGS PANEL */}
      {showSettings && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs font-medium text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="font-extrabold uppercase text-[11px] text-slate-500">⚙ Voice Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-[11px] text-blue-600 font-bold">Done ✓</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Preferred Voice:</label>
              <select value={selectedVoiceURI} onChange={(e) => { setSelectedVoiceURI(e.target.value); selectedVoiceURIRef.current = e.target.value; localStorage.setItem("learnx_voice_uri", e.target.value); }}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2">
                <option value="">✨ Auto-Select Best Quality</option>
                {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Language:</label>
              <select value={language} onChange={(e) => { const l = e.target.value; setLanguage(l); languageRef.current = l; localStorage.setItem("learnx_voice_lang", l); }}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2">
                <option value="english">English (Clear Technical)</option>
                <option value="hinglish">Hinglish (Natural Student Style)</option>
                <option value="hindi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} className="rounded border-slate-300 text-blue-600" />
              <span className="text-[11px] font-bold">Auto-play AI response</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={highlightSpoken} onChange={(e) => setHighlightSpoken(e.target.checked)} className="rounded border-slate-300 text-blue-600" />
              <span className="text-[11px] font-bold">Highlight spoken sentence</span>
            </label>
          </div>
          <p className="text-[10px] text-slate-400 font-medium pt-1">
            Keyboard: <kbd className="bg-white border border-slate-200 px-1 rounded">Space</kbd> Play/Pause &nbsp;
            <kbd className="bg-white border border-slate-200 px-1 rounded">R</kbd> Replay &nbsp;
            <kbd className="bg-white border border-slate-200 px-1 rounded">↑↓</kbd> Volume
          </p>
        </div>
      )}

      {!isSpeechSupported && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
          ⚠ Your browser does not support text-to-speech. Please use Chrome, Edge, or Safari.
        </div>
      )}

      {/* TEACHING MODES & DIFFICULTY */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {TEACHING_MODES.map((m) => (
            <button key={m.id} onClick={() => handleSelectMode(m)} title={m.desc}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${teachingMode === m.id ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"}`}>
              {m.label}
            </button>
          ))}
        </div>

        {/* DIFFICULTY LEVEL SELECTOR */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 px-3">
          <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <span>🎯</span>
            <span>Level:</span>
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: "beginner", label: "🌱 Beginner", desc: "Simple Hinglish + Analogy" },
              { id: "intermediate", label: "⚡ Intermediate", desc: "Technical + Examples" },
              { id: "advanced", label: "🚀 Advanced", desc: "Deep Technical + Edge Cases" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setDifficulty(d.id);
                  localStorage.setItem("learnx_voice_diff", d.id);
                }}
                title={d.desc}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all ${
                  difficulty === d.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WAVEFORM VISUALIZER */}
      <div className="h-14 bg-slate-900 rounded-2xl flex items-center justify-between px-5 text-white overflow-hidden shadow-inner">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Voice Engine</span>
          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{activeVoiceName.slice(0, 22)} · {speed}x</span>
        </div>
        <div className="flex items-center gap-[3px]">
          {WAVE_HEIGHTS.map((h, i) => (
            <div key={i}
              className={`w-[3px] rounded-full transition-all ${status === "speaking" ? "bg-emerald-400" : status === "listening" ? "bg-rose-400" : status === "thinking" ? "bg-purple-400" : "bg-slate-700"}`}
              style={{
                height: (status === "speaking" || status === "listening" || status === "thinking") ? `${h}%` : "22%",
                animation: (status === "speaking" || status === "listening") ? `waveBar 0.6s ease-in-out ${i * 55}ms infinite alternate` : "none",
              }} />
          ))}
        </div>
        <span className={`text-xs font-black uppercase ${status === "speaking" ? "text-emerald-400" : status === "paused" ? "text-amber-400" : status === "finished" ? "text-blue-400" : "text-slate-500"}`}>
          {totalChunks > 0 ? `${currentChunkIndex + 1}/${totalChunks}` : "--/--"}
        </span>
      </div>

      {/* SPOKEN SENTENCE DISPLAY */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-200/60">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">📖 Teaching Script</span>
          <span className="text-[10px] font-bold text-slate-400">
            {totalChunks > 0 ? uiStr.sentenceLabel : uiStr.noScriptLabel}
          </span>
        </div>
        <div className="p-4 min-h-[90px] flex flex-col gap-3">
          {isInitialLoading ? (
            <div className="flex items-center gap-3 py-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-sm text-slate-500 font-medium italic">{uiStr.loadingMsg}</span>
            </div>
          ) : totalChunks > 0 ? (
            <>
              {currentChunkIndex > 0 && (
                <p className="text-xs text-slate-400 line-clamp-1 italic leading-relaxed">{scriptChunks[currentChunkIndex - 1]}</p>
              )}
              <p className={`text-sm sm:text-base font-semibold leading-relaxed transition-all ${highlightSpoken && status === "speaking" ? "text-slate-950 bg-amber-50 px-3 py-1.5 rounded-xl border-l-4 border-amber-400" : "text-slate-800"}`}>
                {currentChunk}
              </p>
              {currentChunkIndex < totalChunks - 1 && (
                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">Next: {scriptChunks[currentChunkIndex + 1]}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400 italic">{uiStr.noScriptMsg}</p>
          )}
        </div>
        <div className="flex items-center justify-between px-4 pb-3 border-t border-slate-200/60 pt-2 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevSentence} disabled={currentChunkIndex === 0 || totalChunks === 0} aria-label="Previous sentence"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 font-bold text-xs hover:bg-slate-100 transition-colors">← Prev</button>
            <button onClick={handleNextSentence} disabled={currentChunkIndex >= totalChunks - 1 || totalChunks === 0} aria-label="Next sentence"
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 font-bold text-xs hover:bg-slate-100 transition-colors">Next →</button>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={handleRepeatSentence} disabled={totalChunks === 0}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold hover:bg-blue-100 transition-colors disabled:opacity-40">🔁 Repeat</button>
            <button onClick={() => handleAskAI(
              language === "hindi"
                ? `इस वाक्य को और आसान भाषा में एक उदाहरण के साथ समझाएं: "${currentChunk || topicTitle}"`
                : language === "hinglish"
                ? `Ise simple analogy ke saath aur asaan karo: "${currentChunk || topicTitle}"`
                : `Explain this simpler with an analogy: "${currentChunk || topicTitle}"`
            )} disabled={totalChunks === 0}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold hover:bg-indigo-100 transition-colors disabled:opacity-40">💡 Simpler</button>
          </div>
        </div>

        {/* 10 CONTEXTUAL QUICK ACTION BUTTONS */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-3.5 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <span>⚡</span> Contextual Actions
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Click any to adapt lesson</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: "explain_again", label: "Explain Again", icon: "🔁", query: `${activeConceptInfo?.activeSubconcept || activeConceptInfo?.name || topicTitle} fir se detail mein samjhao` },
              { id: "simple_analogy", label: "Simple Analogy", icon: "💡", query: `Ek real-world everyday simple analogy ke saath samjhao: ${activeConceptInfo?.name || topicTitle}` },
              { id: "give_example", label: "Give Example", icon: "📌", query: `Ek realistic practical example ke saath samjhao: ${activeConceptInfo?.name || topicTitle}` },
              { id: "show_diagram", label: "Show Diagram", icon: "📊", query: `Ek clean ASCII diagram ya architectural flow ke saath samjhao: ${activeConceptInfo?.name || topicTitle}` },
              { id: "give_numerical", label: "Give Numerical", icon: "🔢", query: `Ek solved numerical ya step-by-step calculation problem samjhao: ${activeConceptInfo?.name || topicTitle}` },
              { id: "give_code", label: "Give Code", icon: "💻", query: `Syntax-highlighted code / SQL implementation aur line-by-line explanation do: ${activeConceptInfo?.name || topicTitle}` },
              { id: "exam_answer", label: "Exam Answer", icon: "🎓", query: `University semester exam ke liye 5-10 marks format structured answer likh ke do: ${activeConceptInfo?.name || topicTitle}` },
              { id: "test_me", label: "Test Me", icon: "⚡", isAction: true, onClick: () => handleTriggerConceptTest() },
              { id: "go_deeper", label: "Go Deeper", icon: "🚀", query: `Deep technical details, edge cases aur interview questions samjhao: ${activeConceptInfo?.name || topicTitle}` },
              { id: "next_concept", label: "Next Concept", icon: "⏩", query: nextConcept?.name ? `${nextConcept.name} samjhao detail mein` : `Iske baad ka next logical concept samjhao` },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => { if (btn.isAction && btn.onClick) { btn.onClick(); } else if (btn.query) { handleAskAI(btn.query); } }}
                disabled={status === "thinking" || isEvaluating}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm hover:border-blue-300 disabled:opacity-40"
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE LEARNING: DIAGNOSTIC QUESTION & EVALUATION PANEL */}
      {activeTestQuestion && (
        <div className="p-4 rounded-2xl bg-indigo-50/90 border-2 border-indigo-300 text-indigo-950 space-y-3 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">?</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900">
                Active Concept Check: {activeConceptInfo?.activeSubconcept || activeConceptInfo?.name || topicTitle}
              </h4>
            </div>
            <button
              onClick={() => { setActiveTestQuestion(null); setEvaluationResult(null); }}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold flex-shrink-0"
            >✕</button>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed bg-white/90 p-3 rounded-xl border border-indigo-200/80">
            {activeTestQuestion}
          </p>

          <form onSubmit={handleSubmitStudentAnswer} className="space-y-2">
            <textarea
              rows={2}
              value={studentAnswerInput}
              onChange={(e) => setStudentAnswerInput(e.target.value)}
              placeholder="Apna answer Hinglish ya English mein likhein..."
              className="w-full text-xs font-medium p-3 rounded-xl border border-indigo-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {isEvaluating ? "AI Teacher evaluating..." : "Explain the core invariant concisely"}
              </span>
              <button
                type="submit"
                disabled={!studentAnswerInput.trim() || isEvaluating}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isEvaluating ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Evaluating...</span></>
                ) : (
                  <><span>Submit Answer</span><span>✓</span></>
                )}
              </button>
            </div>
          </form>

          {evaluationResult && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
              evaluationResult.status === "correct" ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : evaluationResult.status === "partial" ? "bg-amber-50 border-amber-300 text-amber-950"
              : "bg-rose-50 border-rose-300 text-rose-950"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">
                  {evaluationResult.badge || (evaluationResult.status === "correct" ? "🟢 Correct" : evaluationResult.status === "partial" ? "🟡 Partially Correct" : "🔴 Incorrect")}
                </span>
                <span className="text-[10px] font-bold opacity-70">
                  {evaluationResult.status === "correct" ? "Praise & Continue" : evaluationResult.status === "partial" ? "Missing Part Explained" : "Re-teaching Triggered"}
                </span>
              </div>
              <p className="font-semibold leading-relaxed">{evaluationResult.feedback}</p>
              {evaluationResult.missingPart && (
                <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                  <span className="font-black text-amber-900 block text-[11px] mb-0.5">💡 Missing Condition:</span>
                  <span className="text-slate-700 text-[11px]">{evaluationResult.missingPart}</span>
                </div>
              )}
              {evaluationResult.reteachExplanation && (
                <div className="bg-white/90 p-2.5 rounded-lg border border-rose-200">
                  <span className="font-black text-rose-900 block text-[11px] mb-1">🔄 Re-teaching Weak Concept:</span>
                  <p className="text-slate-800 text-[11px] leading-relaxed">{evaluationResult.reteachExplanation}</p>
                </div>
              )}
              {evaluationResult.status === "correct" && (
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveTestQuestion(null);
                      setEvaluationResult(null);
                      if (nextConcept?.name) handleAskAI(`${nextConcept.name} samjhao detail mein`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >Continue to Next Concept →</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AUDIO CONTROL BAR */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status === "speaking" ? (
            <button onClick={handlePause} aria-label="Pause"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-colors">⏸ Pause</button>
          ) : (
            <button onClick={handlePlay} disabled={totalChunks === 0 || isInitialLoading} aria-label="Play"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50">▶ Play</button>
          )}
          <button onClick={handleReplay} disabled={totalChunks === 0 || isInitialLoading} aria-label="Replay"
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors disabled:opacity-40">🔄 Replay</button>
          <button onClick={handleStop} aria-label="Stop"
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors">⏹ Stop</button>
        </div>
        <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl">
          <span className="text-[10px] font-black uppercase text-slate-400 pl-1 mr-0.5">Speed:</span>
          {SPEED_PRESETS.map((p) => (
            <button key={p} onClick={() => { setSpeed(p); speedRef.current = p; localStorage.setItem("learnx_voice_speed", String(p)); }}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${Math.abs(speed - p) < 0.02 ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
              {p}x
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? "Unmute" : "Mute"} className="text-sm text-slate-600 hover:text-slate-900">
            {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>
          <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} aria-label="Volume"
            onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); volumeRef.current = v; setIsMuted(v === 0); localStorage.setItem("learnx_voice_vol", String(v)); }}
            className="w-20 accent-blue-600 cursor-pointer" />
        </div>
      </div>

      {/* ASK TEACHER BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>{uiStr.askLabel}</span>
          <button onClick={() => handleTriggerConceptTest()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">{uiStr.testLabel}</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleAskAI(chatInput); setChatInput(""); }} className="flex items-center gap-2">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
            placeholder={uiStr.askPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          <button type="button" onClick={handleStartListening} aria-label="Speak your doubt"
            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${status === "listening" ? "bg-rose-500 text-white border-rose-500 animate-pulse" : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"}`}>
            <span>🎙</span>
            <span>{status === "listening" ? uiStr.listeningLabel : uiStr.speakBtn}</span>
          </button>
          <button type="submit" disabled={!chatInput.trim() || status === "thinking"}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-sm">
            {status === "thinking" ? "..." : "Ask"}
          </button>
        </form>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {(
            language === "hindi"
              ? ["उदाहरण से समझाओ", "Exam में कैसे लिखूं?", "सरल analogy दो", "Numerical problem बताओ", "Difference और comparison बताओ"]
              : language === "hinglish"
              ? ["Example se samjhao", "Exam mein kaise likhun?", "Simple analogy do", "Numerical problem batao", "Difference aur comparison batao"]
              : ["Explain with an example", "How to write in exam?", "Give a simple analogy", "Give a numerical problem", "Show differences and comparison"]
          ).map((prompt, i) => (
            <button key={i} onClick={() => handleAskAI(prompt)} disabled={status === "thinking"}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap disabled:opacity-40">
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-2 text-xs text-rose-900 font-medium">
          <span className="flex-1">⚠️ {errorMessage}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => { setErrorMessage(""); handlePlay(); }} className="px-2 py-1 bg-white rounded border border-rose-300 font-bold text-rose-800 hover:bg-rose-50">Try Again</button>
            <button onClick={() => setErrorMessage("")} className="text-slate-500 font-bold hover:text-slate-700">✕</button>
          </div>
        </div>
      )}

      {status === "thinking" && (
        <div className="flex items-center gap-2.5 justify-center py-2 px-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 animate-pulse">
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-xs font-black tracking-wide flex items-center gap-1.5">
            <span>🧠</span><span>Teacher is thinking...</span>
          </span>
          <span className="text-[11px] text-purple-600 font-medium italic hidden sm:inline">({uiStr.thinkingMsg})</span>
        </div>
      )}

      {/* PREREQUISITE ALERT CARD */}
      {prereqAlert && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 space-y-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">Prerequisite Knowledge Recommended</h4>
              <p className="text-xs font-semibold text-amber-900/90 mt-1 leading-relaxed">{prereqAlert.message}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => { const reqName = prereqAlert.requiredConcept?.name || "Prerequisite"; handleAskAI(`${reqName} samjhao detail mein`); setPrereqAlert(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors flex items-center gap-1.5"
            ><span>📖</span><span>Learn Prerequisite</span></button>
            <button
              onClick={() => { const query = prereqAlert.targetConcept?.name || topicTitle; handleAskAI(query, { skipPrereq: true }); setPrereqAlert(null); }}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold text-xs transition-colors"
            >Skip and Continue ↗</button>
          </div>
        </div>
      )}

      {/* NEXT RECOMMENDED CONCEPT */}
      {nextConcept && nextConcept.name && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="text-sm">🚀</span>
            <span className="font-bold text-blue-900">Next Concept:</span>
            <span className="truncate max-w-[200px] text-blue-800">{nextConcept.name}</span>
          </div>
          <button
            onClick={() => handleAskAI(`${nextConcept.name} samjhao`)}
            className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-colors"
          >Teach Next →</button>
        </div>
      )}

      {/* No Hindi voice warning */}
      {uiStr.noHindiVoiceWarning && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
          {uiStr.noHindiVoiceWarning}
        </div>
      )}

      {/* PERSONALIZED ROADMAP & SESSION STATS MODAL */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>🗺️</span> Personalized Learning Roadmap
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{sessionStats.subject} · Adaptive Session Memory</p>
              </div>
              <button onClick={() => setShowRoadmapModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center justify-center transition-colors">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Questions", value: sessionStats.questionsAttempted, icon: "❓" },
                  { label: "Accuracy", value: sessionStats.questionsAttempted > 0 ? `${Math.round((sessionStats.correctCount / sessionStats.questionsAttempted) * 100)}%` : "—", icon: "🎯" },
                  { label: "Completed", value: sessionStats.completedConcepts.length, icon: "✅" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-200">
                    <span className="text-lg block">{s.icon}</span>
                    <span className="text-base font-black text-slate-900 block">{s.value}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">📍 Current Context</span>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Subject:</span>
                    <span className="font-bold text-slate-800">{sessionStats.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Current Concept:</span>
                    <span className="font-bold text-indigo-700">{activeConceptInfo?.activeSubconcept || activeConceptInfo?.name || sessionStats.currentConcept}</span>
                  </div>
                </div>
              </div>
              {sessionStats.strongConcepts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">💪 Strong Concepts</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sessionStats.strongConcepts.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {sessionStats.weakConcepts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">⚠️ Weak Concepts — Needs Revision</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sessionStats.weakConcepts.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => { setShowRoadmapModal(false); handleAskAI(`${c} fir se samjhao — simple analogy aur example ke saath`); }}
                        className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-200 hover:bg-rose-200 transition-colors"
                      >{c} 🔁</button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Tap any weak concept to revise it now</p>
                </div>
              )}
              {sessionStats.mistakes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">📝 Recorded Mistakes</span>
                  <div className="space-y-1">
                    {sessionStats.mistakes.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 font-medium">
                        <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[9px] font-black flex-shrink-0">{i + 1}</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sessionStats.recommendedSequence.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">🚀 Recommended Learning Roadmap</span>
                  <div className="space-y-1.5">
                    {sessionStats.recommendedSequence.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 flex-1">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                            sessionStats.completedConcepts.includes(c) ? "bg-emerald-500 text-white" : "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                          }`}>{sessionStats.completedConcepts.includes(c) ? "✓" : i + 1}</span>
                          <span className={`text-xs font-semibold ${
                            sessionStats.completedConcepts.includes(c) ? "text-slate-400 line-through" :
                            sessionStats.weakConcepts.includes(c) ? "text-rose-700 font-bold" : "text-slate-700"
                          }`}>{c}</span>
                          {sessionStats.weakConcepts.includes(c) && <span className="text-[10px] text-rose-500 font-bold">⚠️ Weak</span>}
                        </div>
                        {!sessionStats.completedConcepts.includes(c) && (
                          <button
                            onClick={() => { setShowRoadmapModal(false); handleAskAI(`${c} samjhao detail mein`); }}
                            className="px-2 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black transition-colors"
                          >Learn</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    const fresh = { subject: subjectName, chapter: "Core Foundations", currentConcept: topicTitle, completedConcepts: [], questionsAttempted: 0, correctCount: 0, weakConcepts: [], strongConcepts: [], mistakes: [], recommendedSequence: sessionStats.recommendedSequence };
                    setSessionStats(fresh);
                    try { localStorage.removeItem(`learnx_session_${subjectId}`); } catch (e) {}
                  }}
                  className="text-xs text-slate-400 hover:text-rose-500 font-bold transition-colors"
                >🗑 Reset Session Data</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default VoiceTeacherExperience;
