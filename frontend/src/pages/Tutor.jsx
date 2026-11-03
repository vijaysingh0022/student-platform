import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import api, { getSkillGraph } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// Modular Subcomponents
import AITutorHero from "../components/tutor/AITutorHero.jsx";
import SubjectTabs from "../components/tutor/SubjectTabs.jsx";
import TutorModePanel from "../components/tutor/TutorModePanel.jsx";
import ChatHeader from "../components/tutor/ChatHeader.jsx";
import ChatMessage from "../components/tutor/ChatMessage.jsx";
import TutorInput from "../components/tutor/TutorInput.jsx";
import LearningContext from "../components/tutor/LearningContext.jsx";
import PopularTopics from "../components/tutor/PopularTopics.jsx";
import RecentConversations from "../components/tutor/RecentConversations.jsx";
import RecommendedForYou from "../components/tutor/RecommendedForYou.jsx";

// Initial recent chats matching reference UI
const INITIAL_RECENT_CHATS = [
  { id: "r1", title: "Explain Dijkstra's algorithm", time: "2 hours ago", subject: "DSA" },
  { id: "r2", title: "Difference between BFS and DFS", time: "5 hours ago", subject: "DSA" },
  { id: "r3", title: "Normalization in DBMS", time: "Yesterday", subject: "DBMS" },
  { id: "r4", title: "What is virtual memory", time: "2 days ago", subject: "OS" },
  { id: "r5", title: "Explain TCP 3-way handshake", time: "2 days ago", subject: "CN" },
];

// Typing Indicator Bubble
const TypingIndicator = () => (
  <div className="flex items-start gap-3 justify-start animate-in fade-in duration-200">
    <div className="w-8 h-8 rounded-xl bg-[#0B1020] border border-slate-700/80 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
      <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2">
      <span className="text-xs font-bold text-slate-700">LearnX AI Tutor is formulating your answer</span>
      <div className="flex items-center gap-1 ml-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default function Tutor() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const studentName = user?.name ? user.name.split(" ")[0] : "Vijay";

  // State Management
  const [activeSubject, setActiveSubject] = useState("All Subjects");
  const [activeMode, setActiveMode] = useState("chat");
  const [activeTopic, setActiveTopic] = useState("");
  const [isHinglish, setIsHinglish] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [skillData, setSkillData] = useState(null);
  const [recentConversations, setRecentConversations] = useState(INITIAL_RECENT_CHATS);

  // Initial Welcome Message
  const [messages, setMessages] = useState(() => {
    const navTopic = location.state?.topicTitle || searchParams.get("topic") || "";
    const navSubject = location.state?.subjectId || searchParams.get("subject") || "";
    if (navTopic) {
      return [
        {
          role: "ai",
          time: "Just now",
          text: `### Hi ${studentName}! 👋
I see you're focusing on **${navTopic}**${navSubject ? ` in **${navSubject.toUpperCase()}**` : ""}.

I am ready to help you:
* **Master the core fundamentals** with real-world examples
* **Break down common mistakes** and edge cases
* **Solve practice questions** step-by-step

Let's dive into **${navTopic}**!`,
        },
      ];
    }
    return [
      {
        role: "ai",
        time: "Just now",
        text: `### Hi ${studentName}! 👋
I'm your **LearnX AI Tutor**. I can help you with:

* **Concept explanations** (with examples)
* **Code help** (debug, optimize, explain)
* **Practice questions** (topic-wise)
* **Interview preparation** (with company patterns)
* **Personalized study plans**

What would you like to learn today?`,
      },
    ];
  });

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const hasAutoAsked = useRef(false);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load real student telemetry from Skill Graph API
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await getSkillGraph();
        if (res.data) setSkillData(res.data);
      } catch (err) {
        console.warn("Telemetry warning:", err.message);
      }
    };
    fetchTelemetry();
  }, []);

  // Handle URL query parameters or location.state (e.g. from Skill Graph, Roadmap or Test review links)
  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("question") || location.state?.initialPrompt;
    const subject = searchParams.get("subject") || location.state?.subjectId || "";
    const topic = searchParams.get("topic") || location.state?.topicTitle || "";

    if (subject) setActiveSubject(subject);
    if (topic) setActiveTopic(topic);

    if (q && !hasAutoAsked.current) {
      hasAutoAsked.current = true;
      executeQuestion(q, subject || activeSubject, topic || activeTopic);
    }
  }, [searchParams, location.state]);

  // Core Question Execution Handler
  const executeQuestion = async (
    questionText,
    subjectContext = activeSubject,
    topicContext = activeTopic,
    actionType = "explain"
  ) => {
    if (!questionText.trim() || loading) return;

    let finalPrompt = questionText.trim();
    if (attachment) {
      finalPrompt = `[Attached Context: ${attachment.name}]\n${
        attachment.content ? `\`\`\`\n${attachment.content}\n\`\`\`\n` : ""
      }${finalPrompt}`;
      setAttachment(null);
    }

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { role: "user", text: finalPrompt, time: now }];
    setMessages(newMessages);
    setLoading(true);

    // Track in Recent Conversations list
    const truncatedTitle = finalPrompt.length > 36 ? `${finalPrompt.slice(0, 34)}…` : finalPrompt;
    setRecentConversations((prev) => [
      {
        id: Date.now().toString(),
        title: truncatedTitle,
        time: "Just now",
        subject: subjectContext,
      },
      ...prev.filter((c) => c.title !== truncatedTitle).slice(0, 4),
    ]);

    try {
      const historyForApi = newMessages
        .filter((m) => m.role === "user" || m.role === "ai")
        .slice(1);

      const { data } = await api.post("/tutor/ask", {
        question: finalPrompt,
        subject: subjectContext !== "All Subjects" ? subjectContext : undefined,
        topic: topicContext || undefined,
        history: historyForApi,
        action: actionType,
        isHinglish,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          time: now,
          text: `⚠️ **Unable to complete request**: ${
            err.response?.data?.message || "Please check your network connection or API service configuration."
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    executeQuestion(q);
  };

  // Clear chat handler
  const handleClearChat = () => {
    setMessages([
      {
        role: "ai",
        time: "Just now",
        text: `### Chat Session Reset
What CSE topic or coding challenge would you like to explore next?`,
      },
    ]);
  };

  // Regenerate last response handler
  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      executeQuestion(lastUserMsg.text);
    }
  };

  // Mode Selection Handler
  const handleSelectMode = (mode) => {
    setActiveMode(mode.id);
    const subStr = activeSubject !== "All Subjects" ? activeSubject : "CSE";

    switch (mode.id) {
      case "code":
        executeQuestion(`Provide clean, optimized production code with Big-O time and space complexity for ${subStr}.`, activeSubject, activeTopic, "code");
        break;
      case "practice":
        executeQuestion(`Give me 3 practice problems on ${subStr} with progressive hints and complexity benchmarks.`, activeSubject, activeTopic, "quiz");
        break;
      case "interview":
        executeQuestion(`What are the top 3 technical interview questions asked at Tier-1 product companies on ${subStr}?`, activeSubject, activeTopic, "exam");
        break;
      case "planner":
        executeQuestion(`Create a structured 7-day study plan to master ${subStr} from fundamentals to placement standard.`, activeSubject, activeTopic, "explain");
        break;
      case "visualizer":
        executeQuestion(`Explain ${subStr} using ASCII architectural diagrams and step-by-step state traces.`, activeSubject, activeTopic, "example");
        break;
      default:
        break;
    }
  };

  // Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: event.target?.result || "",
      });
    };
    reader.readAsText(file);
  };

  // Dynamic Weak Topics for "Recommended for You"
  const dynamicRecommendations = useMemo(() => {
    if (skillData?.weakTopics && skillData.weakTopics.length > 0) {
      return skillData.weakTopics.slice(0, 3).map((t, idx) => ({
        title: t.title,
        priority: idx === 0 ? "High Priority" : idx === 1 ? "Important" : "Focus",
        priorityColor:
          idx === 0
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : idx === 1
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-purple-50 text-purple-700 border-purple-200",
        reason: `${t.masteryPercentage}% mastery • Below recommended placement benchmark`,
        query: `Teach me ${t.title} step-by-step from scratch with clear mental models and solved problems.`,
      }));
    }
    return [
      {
        title: "Dynamic Programming",
        priority: "High Priority",
        priorityColor: "bg-rose-50 text-rose-700 border-rose-200",
        reason: "Many students find this challenging",
        query: "Explain Dynamic Programming memoization vs tabulation with 0/1 Knapsack.",
      },
      {
        title: "Linked Lists",
        priority: "Important",
        priorityColor: "bg-amber-50 text-amber-700 border-amber-200",
        reason: "Strengthen fundamentals",
        query: "Explain Fast & Slow Pointer technique in Linked Lists for cycle detection.",
      },
      {
        title: "OS Process Scheduling",
        priority: "Focus",
        priorityColor: "bg-purple-50 text-purple-700 border-purple-200",
        reason: "Improve conceptual clarity",
        query: "Explain Round Robin vs SJF CPU scheduling with turn-around and waiting times.",
      },
    ];
  }, [skillData]);

  return (
    <div className="w-full text-[#0B1220] pb-16 space-y-6 font-sans">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".txt,.cpp,.java,.py,.c,.sql,.json,.md,.js,.ts"
      />

      {/* ── 5. AI TUTOR HERO SECTION ── */}
      <AITutorHero
        onCapabilityClick={(query) => executeQuestion(query)}
      />

      {/* ── 6. SUBJECT NAVIGATION (Horizontal Bar) ── */}
      <SubjectTabs
        activeSubject={activeSubject}
        onSelectSubject={(subj) => {
          setActiveSubject(subj);
          setActiveTopic("");
        }}
      />

      {/* ── 7. MAIN AI WORKSPACE (3-COLUMN LAYOUT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: AI Assistant Modes (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <TutorModePanel
            activeMode={activeMode}
            onSelectMode={handleSelectMode}
            activeSubject={activeSubject}
          />
        </div>

        {/* CENTER COLUMN: Main AI Conversation (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col h-[740px] overflow-hidden">
          {/* Header */}
          <ChatHeader
            isHinglish={isHinglish}
            onToggleHinglish={() => setIsHinglish((prev) => !prev)}
            onUploadClick={() => fileInputRef.current?.click()}
            onClearChat={handleClearChat}
            activeSubject={activeSubject}
          />

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                msg={msg}
                index={idx}
                totalMsgs={messages.length}
                onQuickFollowUp={(followUp) =>
                  executeQuestion(`${followUp} for the previous concept.`)
                }
                onRegenerate={handleRegenerate}
                onSelectPrompt={(promptQuery) => executeQuestion(promptQuery)}
                activeSubject={activeSubject}
              />
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area + Quick Actions */}
          <TutorInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
            attachment={attachment}
            setAttachment={setAttachment}
            onAttachClick={() => fileInputRef.current?.click()}
            isListening={isListening}
            toggleListening={toggleListening}
            activeSubject={activeSubject}
            activeTopic={activeTopic}
            onTriggerAction={(actionQuery, actionId) =>
              executeQuestion(actionQuery, activeSubject, activeTopic, actionId)
            }
          />
        </div>

        {/* RIGHT COLUMN: Personal Learning Context Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Today's Learning + Quick Tools */}
          <LearningContext
            onQuickToolClick={(query) => executeQuestion(query)}
            activeSubject={activeSubject}
          />

          {/* Popular Topics */}
          <PopularTopics
            onSelectTopic={(query, subject) => executeQuestion(query, subject)}
          />

          {/* Recent Conversations */}
          <RecentConversations
            conversations={recentConversations}
            onSelectConversation={(chat) =>
              executeQuestion(`Review: ${chat.title}`, chat.subject)
            }
          />
        </div>
      </div>

      {/* ── 10. PERSONALIZED RECOMMENDATIONS (Bottom Section) ── */}
      <RecommendedForYou
        recommendations={dynamicRecommendations}
        onSelectRecommendation={(query) => executeQuestion(query)}
      />
    </div>
  );
}
