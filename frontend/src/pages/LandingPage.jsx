import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Bot,
  Brain,
  Code2,
  Target,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Award,
  Sparkles,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Compass,
  GraduationCap,
  Shield,
  Layers,
  Search,
  Activity,
  Cpu,
  UserCheck,
  TrendingUp,
  Star,
  Play,
  Terminal,
  Check,
  Volume2,
  Mic,
  MessageSquare,
  FileText,
  Sliders
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import { LearnXLogo } from "../components/LearnXLogo.jsx";
import * as THREE from "three";

// Recharts radar data for Section 4 (AI Learning Profile)
const RADAR_DATA = [
  { subject: "DSA", score: 88 },
  { subject: "DBMS", score: 79 },
  { subject: "OS", score: 72 },
  { subject: "CN", score: 68 },
  { subject: "OOPs", score: 92 },
  { subject: "System Design", score: 82 }
];

const TOP_COMPANIES = [
  { name: "Google", role: "Software Engineer", ctc: "₹38 LPA", color: "from-blue-500 to-red-500" },
  { name: "Microsoft", role: "SDE-1", ctc: "₹44 LPA", color: "from-blue-600 to-cyan-500" },
  { name: "Amazon", role: "SDE-1", ctc: "₹32 LPA", color: "from-amber-500 to-orange-500" },
  { name: "Atlassian", role: "Software Engineer", ctc: "₹52 LPA", color: "from-blue-600 to-indigo-600" },
  { name: "Uber", role: "Backend Engineer", ctc: "₹35 LPA", color: "from-slate-800 to-slate-900" },
  { name: "Goldman Sachs", role: "Tech Analyst", ctc: "₹28 LPA", color: "from-sky-600 to-blue-700" },
  { name: "Adobe", role: "Member Tech Staff", ctc: "₹30 LPA", color: "from-rose-500 to-red-600" },
  { name: "Flipkart", role: "SDE-1", ctc: "₹26 LPA", color: "from-blue-500 to-amber-500" }
];

const TESTIMONIALS = [
  {
    name: "Aman Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Placed at Microsoft",
    ctc: "₹44 LPA",
    college: "Tier-3 Engineering College",
    quote: "LearnX's 7-Day Roadmap and AI Mock Interviewer completely changed my prep. I went from failing online assessments to cracking Microsoft on day 1!",
    tag: "DSA & System Design"
  },
  {
    name: "Priya Verma",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    role: "Placed at Amazon",
    ctc: "₹32 LPA",
    college: "State Govt University",
    quote: "The 159+ Coding Lab problems with real-time AI code debugger helped me master edge cases that typical platforms never explain.",
    tag: "Coding Lab & Debugger"
  },
  {
    name: "Rahul Nair",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    role: "Placed at Google",
    ctc: "₹38 LPA",
    college: "NIT Trichy",
    quote: "The 3D Algorithm Visualizer makes complex Dijkstra, Graph Traversals, and DP transitions instantly intuitive. A must-have for all CSE students!",
    tag: "Algorithm 3D Visualizer"
  }
];

const FAQ_ITEMS = [
  {
    q: "Is LearnX free for engineering students?",
    a: "Yes! LearnX provides generous free access to 159+ DSA problems, CS curriculum notes, algorithm visualizers, and initial AI mock interviews for all students."
  },
  {
    q: "How does the AI Coding Lab work with hidden test cases?",
    a: "Our sandboxed multi-language compiler runs your solution across Python, C++, Java, and JS against real edge cases and hidden test cases, accompanied by an AI senior examiner audit."
  },
  {
    q: "Can I prepare for both Semester Exams and Placements?",
    a: "Absolutely! LearnX maps academic university curricula (DSA, OS, DBMS, Computer Networks, OOPs) directly to industry placement interview requirements."
  },
  {
    q: "What makes the AI Mock Interviewer different from ChatGPT?",
    a: "LearnX's AI Mock Interviewer evaluates coding correctness, time/space complexity, verbal communication, and problem-solving composure with actionable rubric scoring."
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasContainerRef = useRef(null);

  // Hero state
  const [heroTab, setHeroTab] = useState("mastery"); // 'mastery' | 'coding' | 'interview' | 'roadmap'
  const [simulatedRun, setSimulatedRun] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState(null);
  const [interviewVoiceActive, setInterviewVoiceActive] = useState(true);

  // Interactive Calculator State
  const [calcYear, setCalcYear] = useState("3rd Year");
  const [calcRole, setCalcRole] = useState("Product SDE-1");
  const [calcSolved, setCalcSolved] = useState(60);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  // 3D Background Three.js Effect (Multi-Shape 3D Depth Landscape & Dynamic Scroll Reactive Motion)
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 210;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Particle nodes network
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 360;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        vz: (Math.random() - 0.5) * 0.08
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pMaterial = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 3.6,
      transparent: true,
      opacity: 0.7
    });
    const pointCloud = new THREE.Points(geometry, pMaterial);
    scene.add(pointCloud);

    // Dynamic Proximity Lines
    const maxConnections = 300;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Main 3D Geometric Crystal Core Group
    const coreGroup = new THREE.Group();

    const icoGeo = new THREE.IcosahedronGeometry(36, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    const dodecaGeo = new THREE.DodecahedronGeometry(22, 0);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    coreGroup.add(dodecaMesh);

    const ringGeo = new THREE.TorusGeometry(50, 0.8, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh);

    coreGroup.position.set(70, 15, 0);
    scene.add(coreGroup);

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      coreGroup.rotation.x += 0.004;
      coreGroup.rotation.y += 0.006;
      icoMesh.rotation.y -= 0.003;
      dodecaMesh.rotation.x += 0.005;
      ringMesh.rotation.z += 0.005;

      const posArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].vx;
        posArray[i * 3 + 1] += velocities[i].vy;

        if (Math.abs(posArray[i * 3]) > 180) velocities[i].vx *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 300) velocities[i].vy *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      let connectionCount = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 48 && connectionCount < maxConnections) {
            linePositions[connectionCount * 6] = posArray[i * 3];
            linePositions[connectionCount * 6 + 1] = posArray[i * 3 + 1];
            linePositions[connectionCount * 6 + 2] = posArray[i * 3 + 2];

            linePositions[connectionCount * 6 + 3] = posArray[j * 3];
            linePositions[connectionCount * 6 + 4] = posArray[j * 3 + 1];
            linePositions[connectionCount * 6 + 5] = posArray[j * 3 + 2];

            lineColors[connectionCount * 6] = 0.14;
            lineColors[connectionCount * 6 + 1] = 0.38;
            lineColors[connectionCount * 6 + 2] = 0.92;

            lineColors[connectionCount * 6 + 3] = 0.49;
            lineColors[connectionCount * 6 + 4] = 0.23;
            lineColors[connectionCount * 6 + 5] = 0.96;

            connectionCount++;
          }
        }
      }

      lineGeometry.setDrawRange(0, connectionCount * 2);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      pointCloud.rotation.y += 0.0006;
      lines.rotation.y += 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const featureCards = [
    {
      title: "Interactive AI Coding Lab",
      desc: "Practice 159+ curated DSA & SQL problems with real-time multi-language compiler, AI debugger, and automatic edge-case tester.",
      icon: Code2,
      link: "/coding-lab",
      tag: "159+ Problems",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      title: "3D & Interactive Algorithm Visualizer",
      desc: "Watch Dijkstra, Sorting, and Binary Tree traversals execute in real-time step-by-step with interactive speed controls.",
      icon: Layers,
      link: "/algorithm-visualizer",
      tag: "3D Sandbox",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      title: "AI Voice & Coding Mock Interview",
      desc: "Conduct real-time mock interviews with an adaptive AI examiner that analyzes code efficiency, time complexity, and verbal explanations.",
      icon: Bot,
      link: "/mock-interview",
      tag: "Speech & Code AI",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "Personalized 7-Day Career Roadmap",
      desc: "Get an AI-curated day-by-day sprint covering high-frequency topics, custom quizzes, and placement drills.",
      icon: Target,
      link: "/roadmap",
      tag: "AI Adaptive",
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      title: "Complete CSE Curriculum & Flashcards",
      desc: "Semester-ready coverage of DSA, DBMS, OS, Computer Networks, and System Design with AI summaries and formula sheets.",
      icon: BookOpen,
      link: "/learn",
      tag: "All Semesters",
      gradient: "from-cyan-600 to-blue-600"
    },
    {
      title: "Placement Readiness Predictor",
      desc: "Know your placement odds across Tier-1, Tier-2, and Product companies with data-backed skill gap analysis.",
      icon: Rocket,
      link: "/placement-predict",
      tag: "Career Engine",
      gradient: "from-amber-600 to-orange-600"
    }
  ];

  // Calculated placement score for interactive calculator
  const calculatedReadiness = Math.min(
    98,
    Math.round(40 + (calcSolved / 159) * 45 + (calcYear === "4th Year" ? 10 : calcYear === "3rd Year" ? 6 : 2))
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ─── ULTRA-MODERN FLOATING NAV BAR ────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-[#EBE5DA] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <LearnXLogo size="md" showBadge={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-black uppercase tracking-wider text-slate-600">
            <Link to="/learn" className="hover:text-blue-600 transition flex items-center gap-1.5">
              <span>Curriculum</span>
            </Link>
            <Link to="/coding-lab" className="hover:text-blue-600 transition flex items-center gap-1.5 text-blue-600 font-black">
              <span>159+ Coding Lab</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[9px] text-blue-700">NEW</span>
            </Link>
            <Link to="/algorithm-visualizer" className="hover:text-blue-600 transition">
              3D Visualizer
            </Link>
            <Link to="/mock-interview" className="hover:text-blue-600 transition">
              AI Mock Interview
            </Link>
            <Link to="/roadmap" className="hover:text-blue-600 transition">
              7-Day Sprint
            </Link>
            <Link to="/placement-predict" className="hover:text-blue-600 transition">
              Placement Engine
            </Link>
          </nav>

          {/* Right Action & User Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-extrabold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>1,840 Students Active</span>
            </div>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/sign-in"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-[#F2EDE4] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── SECTION 1: HERO SECTION (WARM IVORY + THREE.JS ANIMATION) ─────── */}
      <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F6F3EC] to-[#F2EDE4]/60 border-b border-[#EBE5DA]">
        {/* Three.js Background Canvas */}
        <div ref={canvasContainerRef} className="fixed inset-0 pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              {/* Release Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-300/80 text-blue-800 text-xs font-black tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span className="text-blue-700 font-extrabold uppercase">LearnX 2.0 Live</span>
                <span className="text-slate-400">•</span>
                <span className="text-indigo-700 font-bold">159+ Coding Problems & AI Debugger</span>
              </div>

              {/* High-Impact Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E2022] tracking-tight leading-[1.1]">
                Master Computer Science. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  Ace Top Placements.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
                The all-in-one AI platform for engineering students. Master 150+ DSA problems, practice AI mock interviews, track skill gaps, and follow a personalized 7-day roadmap to your dream tech job.
              </p>

              {/* Social Proof Star Rating */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">VS</span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold text-[10px] flex items-center justify-center">AK</span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-purple-500 to-pink-600 text-white font-bold text-[10px] flex items-center justify-center">PR</span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-bold text-[10px] flex items-center justify-center">NJ</span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-black text-slate-800 ml-1">4.9/5</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">from 15,000+ students & FAANG-placed alumni</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={user ? "/dashboard" : "/sign-up"}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>🚀 Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/coding-lab"
                  className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-sm sm:text-base shadow-xs transition flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4 text-violet-600" />
                  <span>Interactive Coding Lab</span>
                </Link>
              </div>

              {/* Checklist Below CTAs */}
              <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#EBE5DA] max-w-lg">
                {[
                  "159+ Curated DSA Problems",
                  "AI Mock Interview Simulator",
                  "Real-time Skill Gap Analysis",
                  "Algorithm 3D Visualizers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Interactive 4-in-1 Glass Dashboard Hub */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              {/* Multi-layer Ambient Glow Auras */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-purple-600/30 rounded-[2.5rem] blur-3xl opacity-75 pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

              {/* Floating Top Pill Badge */}
              <div className="absolute -top-4 -right-2 sm:right-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white text-[11px] font-bold shadow-xl shadow-slate-900/20 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-amber-300 font-extrabold">⭐ Top 3%</span>
                <span className="text-slate-300">Tier 1 Placement Ready</span>
              </div>

              {/* Interactive Dashboard Container */}
              <div className="relative bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.22)] space-y-4">
                {/* Hub Interactive Switcher Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
                    {[
                      { id: "mastery", label: "📊 Intelligence" },
                      { id: "coding", label: "💻 Coding Lab" },
                      { id: "interview", label: "🎙️ AI Mock" },
                      { id: "roadmap", label: "🎯 7-Day Plan" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setHeroTab(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          heroTab === tab.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-300/60 text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>

                {/* TAB 1: SKILL MASTERY & INTELLIGENCE */}
                {heroTab === "mastery" && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Career Readiness Metric Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4.5 sm:p-5 border border-slate-800 shadow-lg shadow-indigo-950/20">
                      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="space-y-0.5">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-blue-400 tracking-wider">
                            <Rocket className="w-3.5 h-3.5" />
                            <span>Career Readiness Score</span>
                          </div>
                          <div className="text-xs text-slate-300 font-medium">
                            Target: <strong className="text-white">85%</strong> for Tier-1 Product Companies
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 font-mono">
                            84%
                          </span>
                          <div className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +6.4% this week
                          </div>
                        </div>
                      </div>

                      {/* Gradient Progress Bar */}
                      <div className="h-3 rounded-full bg-slate-800/80 p-0.5 overflow-hidden border border-slate-700/50">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full w-[84%] shadow-sm transition-all duration-1000" />
                      </div>

                      {/* Milestone Indicators */}
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 font-mono">
                        <span>Foundations (60%)</span>
                        <span className="text-indigo-300 font-extrabold">Service-Based (75%)</span>
                        <span className="text-emerald-300 font-extrabold">Product/FAANG (85%+)</span>
                      </div>
                    </div>

                    {/* Skill Progress Bars with Topics */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                        <span>Subject Mastery</span>
                        <span className="text-[11px] font-bold text-blue-600">4 Subjects Tracked</span>
                      </div>

                      {[
                        { name: "DSA (Algorithms)", pct: 88, tag: "Graphs & Dynamic Prog.", gradient: "from-blue-600 to-cyan-500", icon: "⚡" },
                        { name: "System Design & LLD", pct: 82, tag: "Microservices & Scalability", gradient: "from-indigo-600 to-purple-500", icon: "🏗️" },
                        { name: "DBMS & SQL", pct: 79, tag: "Indexing & Transactions", gradient: "from-purple-600 to-pink-500", icon: "🗄️" },
                        { name: "Operating Systems", pct: 72, tag: "Concurrency & Memory", gradient: "from-emerald-500 to-teal-400", icon: "⚙️" }
                      ].map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/70 hover:border-blue-300/80 transition-all">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{s.icon}</span>
                              <span className="font-extrabold">{s.name}</span>
                              <span className="text-[10px] font-medium text-slate-500 hidden sm:inline">• {s.tag}</span>
                            </div>
                            <span className="font-mono font-black text-slate-800">{s.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200/80 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${s.gradient} transition-all duration-1000`}
                              style={{ width: `${s.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Recommendation Callout */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-blue-500/10 border border-violet-200/80 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
                      <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-violet-900 uppercase tracking-wider">AI Neural Recommendation</span>
                          <span className="text-[9px] font-bold text-violet-700 bg-violet-100/80 px-2 py-0.5 rounded-full">High Priority</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 leading-snug">
                          "Master <strong className="text-violet-900 font-bold">Graph Algorithms & B-Trees</strong> next to boost your Placement readiness by <strong className="text-emerald-700 font-bold">+11%</strong>."
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: INTERACTIVE AI CODING LAB PREVIEW */}
                {heroTab === "coding" && (
                  <div className="space-y-3 font-mono animate-fade-in">
                    {/* Editor Terminal Shell */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-bold text-slate-400 ml-2 font-mono">solution.py (Two Sum - Easy)</span>
                        </div>
                        <button
                          onClick={() => {
                            setSimulatedRun(true);
                            setSimulatedOutput(null);
                            setTimeout(() => {
                              setSimulatedRun(false);
                              setSimulatedOutput({
                                stdout: "[0, 1]",
                                testsPassed: "3/3",
                                time: "0.04ms",
                                audit: "Optimal O(N) Time & O(N) Space Complexity with Hash Map."
                              });
                            }, 450);
                          }}
                          disabled={simulatedRun}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-sm transition active:scale-95"
                        >
                          {simulatedRun ? (
                            <>
                              <div className="w-2.5 h-2.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              <span>Executing...</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Run Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Snippet */}
                      <pre className="text-slate-300 font-mono text-[11px] leading-5 overflow-x-auto">
                        <span className="text-purple-400">def</span> <span className="text-blue-400">twoSum</span>(nums, target):{"\n"}
                        {"    "}hash_map = {"{}"}{"\n"}
                        {"    "}<span className="text-purple-400">for</span> i, n <span className="text-purple-400">in</span> enumerate(nums):{"\n"}
                        {"        "}diff = target - n{"\n"}
                        {"        "}<span className="text-purple-400">if</span> diff <span className="text-purple-400">in</span> hash_map:{"\n"}
                        {"            "}<span className="text-purple-400">return</span> [hash_map[diff], i]{"\n"}
                        {"        "}hash_map[n] = i
                      </pre>
                    </div>

                    {/* Output Console Box */}
                    <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase">
                        <span>Console Output & AI Evaluation</span>
                        {simulatedOutput && (
                          <span className="text-emerald-400 font-black">✔ 100% Passed</span>
                        )}
                      </div>
                      
                      {!simulatedOutput && !simulatedRun && (
                        <div className="text-slate-500 py-1 text-center italic font-sans text-xs">
                          Click <strong className="text-emerald-400">"Run Code"</strong> above to see instant compilation & AI audit!
                        </div>
                      )}

                      {simulatedRun && (
                        <div className="flex items-center justify-center gap-2 py-2 text-slate-400 text-xs font-sans">
                          <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <span>Testing against hidden inputs...</span>
                        </div>
                      )}

                      {simulatedOutput && (
                        <div className="space-y-1 pt-1">
                          <div className="text-emerald-400 font-mono font-bold">STDOUT: {simulatedOutput.stdout}</div>
                          <div className="text-slate-400 text-[10px]">Tests Passed: {simulatedOutput.testsPassed} | Runtime: {simulatedOutput.time}</div>
                          <div className="text-violet-300 text-[10px] font-sans font-medium bg-violet-950/40 p-1.5 rounded-lg border border-violet-800/40">
                            🤖 <strong>AI Audit:</strong> {simulatedOutput.audit}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: AI MOCK INTERVIEW LIVE SIMULATOR */}
                {heroTab === "interview" && (
                  <div className="space-y-3.5 animate-fade-in font-sans">
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-white space-y-3">
                      {/* Interviewer Status Bar */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                            🤖
                          </div>
                          <div>
                            <div className="text-xs font-black text-white">LearnX AI Technical Examiner</div>
                            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Active Round 1 (System Design & DSA)
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">
                          Live Voice
                        </span>
                      </div>

                      {/* Question Speech Bubble */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Question:</span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          "Can you explain how Dijkstra's Algorithm finds the shortest path, and what happens if the graph contains negative weights?"
                        </p>
                      </div>

                      {/* Real-time Voice Wave Animation */}
                      <div className="flex items-center justify-between bg-purple-950/30 p-2.5 rounded-xl border border-purple-800/30">
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-[11px] font-bold text-purple-200">Listening to candidate speech...</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[40, 75, 90, 60, 100, 45, 80, 50].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-purple-400 rounded-full animate-pulse"
                              style={{ height: `${h * 0.2}px`, animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Rubric Breakdown */}
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Correctness</span>
                          <div className="text-sm font-black text-emerald-400">92%</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Clarity</span>
                          <div className="text-sm font-black text-blue-400">88%</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Composure</span>
                          <div className="text-sm font-black text-purple-400">95%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: 7-DAY CAREER ROADMAP PREVIEW */}
                {heroTab === "roadmap" && (
                  <div className="space-y-2.5 animate-fade-in font-sans">
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
                      <span>7-Day Fast-Track Placement Sprint</span>
                      <span className="text-[10px] font-bold text-emerald-600">AI Adaptive</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { day: "Day 1", topic: "Arrays & HashMaps Mastery", status: "Completed", icon: "✅" },
                        { day: "Day 2", topic: "Two Pointers & Sliding Window", status: "Completed", icon: "✅" },
                        { day: "Day 3", topic: "Binary Trees & Graph Traversals", status: "Active Today", icon: "⚡" },
                        { day: "Day 4", topic: "Dynamic Programming Patterns", status: "Upcoming", icon: "⏳" },
                        { day: "Day 5", topic: "AI Mock Tech Interview & Feedback", status: "Upcoming", icon: "🎯" },
                      ].map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                            step.status === "Active Today"
                              ? "bg-blue-50/90 border-blue-300 text-blue-900 shadow-xs"
                              : step.status === "Completed"
                              ? "bg-slate-50/70 border-slate-200 text-slate-700"
                              : "bg-white border-slate-100 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{step.icon}</span>
                            <span className="font-mono text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-white border border-slate-200">
                              {step.day}
                            </span>
                            <span className="font-bold">{step.topic}</span>
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              step.status === "Active Today"
                                ? "bg-blue-600 text-white animate-pulse"
                                : step.status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "text-slate-400"
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floating Bottom Performance Badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-b from-blue-50/90 to-blue-100/40 border border-blue-200/70 text-center shadow-xs">
                    <div className="text-xs font-black text-blue-700 font-mono">+14.8%</div>
                    <div className="text-[10px] font-bold text-slate-600 mt-0.5">Weekly Velocity</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 border border-amber-200/70 text-center shadow-xs">
                    <div className="text-xs font-black text-amber-700">🔥 14-Day</div>
                    <div className="text-[10px] font-bold text-slate-600 mt-0.5">Active Streak</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-50/90 to-emerald-100/40 border border-emerald-200/70 text-center shadow-xs">
                    <div className="text-xs font-black text-emerald-700 font-mono">92% Match</div>
                    <div className="text-[10px] font-bold text-slate-600 mt-0.5">Placement Odds</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: TOP COMPANIES MARQUEE & STATS ──────────────────────── */}
      <section className="py-12 bg-white border-b border-[#EBE5DA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              PROVEN RESULTS ACROSS TOP TECH RECRUITERS
            </span>
            <p className="text-xs font-semibold text-slate-600">
              Students and graduates using LearnX have received placement offers from:
            </p>
          </div>

          {/* Marquee Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {TOP_COMPANIES.map((comp, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className={`w-7 h-7 rounded-xl bg-gradient-to-r ${comp.color} text-white flex items-center justify-center font-black text-xs shadow-sm`}>
                  {comp.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition">{comp.name}</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-bold">{comp.ctc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-2">
              <div className="text-3xl font-black text-[#1E2022]">15,000+</div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Active CSE Students</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-black text-blue-600">159+</div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Curated DSA Problems</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-black text-purple-600">94.2%</div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Interview Pass Rate</div>
            </div>
            <div className="p-2">
              <div className="text-3xl font-black text-emerald-600">₹18.4 LPA</div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Average Placed Package</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: 6 CORE FEATURE PILLARS ─────────────────────────────── */}
      <section id="features" className="py-20 bg-[#F5F2EA]/70 border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">
              Comprehensive Tech Stack
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              Everything You Need to Dominate CSE & Placements.
            </h2>
            <p className="text-base text-slate-600 font-medium">
              From university exams to FAANG technical rounds, LearnX gives you a clear unfair advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featureCards.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/95 border border-[#EBE5DA] rounded-3xl p-7 sm:p-8 shadow-xs hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feat.gradient} text-white flex items-center justify-center shadow-md`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FAF8F5] text-slate-700 border border-[#EBE5DA] uppercase tracking-wider">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#1E2022] group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#F2EDE4]">
                    <Link
                      to={feat.link}
                      className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:gap-2.5 transition-all uppercase tracking-wider"
                    >
                      <span>Explore {feat.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: INTERACTIVE PLACEMENT READINESS CALCULATOR ─────────────── */}
      <section className="py-20 bg-white border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Interactive Career Estimator</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Calculate Your Placement Readiness Score
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Select your college year, target software role, and problem-solving level to simulate your readiness odds across top product companies.
              </p>

              {/* Controls */}
              <div className="space-y-4">
                {/* Year Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">College Year:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setCalcYear(yr)}
                        className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition ${
                          calcYear === yr
                            ? "bg-blue-600 text-white border-blue-500 shadow-md"
                            : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Target Software Role:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Product SDE-1", "Backend Engineer", "Data Engineer"].map((role) => (
                      <button
                        key={role}
                        onClick={() => setCalcRole(role)}
                        className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition ${
                          calcRole === role
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                            : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DSA Solved Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>DSA Problems Solved:</span>
                    <span className="font-mono text-emerald-400 text-sm font-black">{calcSolved} / 159</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="159"
                    value={calcSolved}
                    onChange={(e) => setCalcSolved(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Score Display Gauge */}
            <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Placement Probability</span>
                <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 font-mono">
                  {calculatedReadiness}%
                </div>
                <p className="text-xs font-bold text-slate-300">
                  {calculatedReadiness >= 80 ? "🔥 Tier 1 Product Ready (Google / Microsoft threshold)" : calculatedReadiness >= 65 ? "⚡ Solid Tier 2 / High-Growth Startup Odds" : "📚 Needs 7-Day Sprint on Dynamic Programming"}
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                <span className="font-bold text-purple-400 uppercase text-[10px] block">AI Actionable Recommendation:</span>
                <p className="text-slate-300">
                  {calcSolved < 80 
                    ? `Solve 20 more Medium problems in Coding Lab focusing on Graphs & Dynamic Programming to boost your score to 92%.`
                    : `Your coding foundation is strong! Take 2 AI Mock Interviews to sharpen your verbal communication and time complexity explanations.`}
                </p>
              </div>

              <Link
                to={user ? "/roadmap" : "/sign-up"}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 transition hover:opacity-95 flex items-center justify-center gap-2"
              >
                <span>Launch Your Customized 7-Day Sprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: AI RADAR & DIAGNOSTIC INTELLIGENCE ──────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-black text-purple-700 uppercase tracking-widest bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/80">
              Adaptive Neural Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              LearnX Understands Your Strengths & Weaknesses.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Our AI constantly models your retention, identifies critical skill gaps, and recommends high-yield topics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Recharts Radar AI Brain Chart */}
            <div className="lg:col-span-6 bg-white border border-[#EBE5DA] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[400px] shadow-sm">
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Multi-Dimensional Subject Diagnostic
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12, fontWeight: 800 }} />
                    <Radar
                      name="Student Mastery"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs font-bold text-slate-500 mt-2 text-center">
                Live AI Diagnostic Assessment Map
              </div>
            </div>

            {/* Right: Learning Profile Summary */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-7 sm:p-8 text-white shadow-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">Candidate Assessment</div>
                    <h3 className="text-xl font-black text-white mt-0.5">LEARNING PROFILE SNAPSHOT</h3>
                  </div>
                  <UserCheck className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Mastery Tier</div>
                    <div className="text-base font-black text-amber-300 mt-0.5">Tier 1 Placement Ready</div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Top Skill</div>
                    <div className="text-base font-black text-emerald-400 mt-0.5">OOPs & System Design (92%)</div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Focus Area</div>
                    <div className="text-base font-black text-rose-400 mt-0.5">Graph Algorithms (68%)</div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
                    <div className="text-[11px] text-slate-400 font-bold uppercase">Sprint Goal</div>
                    <div className="text-base font-black text-cyan-400 mt-0.5">Dijkstra & DP Patterns</div>
                  </div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Weekly Practice Goal</span>
                    <span className="font-mono text-cyan-400 font-black">12 / 14 Hours (86%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-[86%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: WALL OF LOVE / TESTIMONIALS ──────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/80">
              Student Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              From Campus to Dream Offer Letters.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              See how engineering students transformed their careers with LearnX's targeted AI guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((testi, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                    "{testi.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={testi.avatar}
                      alt={testi.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{testi.name}</h4>
                      <p className="text-[10px] font-bold text-emerald-600">{testi.role} • {testi.ctc}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{testi.college}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-blue-100 text-blue-700">
                    {testi.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FAQ ACCORDION ───────────────────────────────────────── */}
      <section className="py-20 bg-[#F5F2EA]/60 border-b border-[#EBE5DA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/80">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Everything you need to know about the LearnX platform and AI features.
            </p>
          </div>

          <div className="space-y-3.5">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base hover:text-blue-600 transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: ULTRA LUXURY FINAL CTA ──────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Join 15,000+ Future Tech Leaders</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop Guessing. Start Mastering. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
              Crack Your Dream Placements.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Get instant access to 159+ LeetCode DSA problems, AI Mock Interviewer, 3D Visualizer, and your custom 7-day sprint.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={user ? "/dashboard" : "/sign-up"}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-base shadow-2xl shadow-blue-500/40 transition transform hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <span>🚀 Start Learning Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/coding-lab"
              className="px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-base transition flex items-center gap-2"
            >
              <Code2 className="w-5 h-5 text-violet-400" />
              <span>Explore 159+ Coding Lab</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-900 pb-8">
            <div className="space-y-2 text-center md:text-left">
              <LearnXLogo size="md" showBadge={true} />
              <p className="text-xs text-slate-500 font-medium">
                Learn. Practice. Grow. Succeed.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 font-semibold text-slate-300 text-xs sm:text-sm">
              <Link to="/about" className="hover:text-blue-400 transition">About</Link>
              <Link to="/learn" className="hover:text-blue-400 transition">Curriculum</Link>
              <Link to="/coding-lab" className="hover:text-blue-400 transition">159+ Coding Lab</Link>
              <Link to="/algorithm-visualizer" className="hover:text-blue-400 transition">3D Visualizer</Link>
              <Link to="/mock-interview" className="hover:text-blue-400 transition">AI Mock Interview</Link>
              <Link to="/roadmap" className="hover:text-blue-400 transition">7-Day Sprint</Link>
              <Link to="/placement-predict" className="hover:text-blue-400 transition">Placement Engine</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LearnX. All rights reserved.</p>
            <p>Empowering 15,000+ Students with AI-Driven Engineering Mastery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
