import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  BarChart3,
  Compass,
  GraduationCap,
  Shield,
  Layers,
  Search,
  Activity,
  Cpu,
  UserCheck
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
  { subject: "DSA", score: 82 },
  { subject: "DBMS", score: 74 },
  { subject: "OS", score: 68 },
  { subject: "CN", score: 61 },
  { subject: "OOPs", score: 88 },
  { subject: "System Design", score: 65 }
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasContainerRef = useRef(null);

  // Active state for feature exploration preview
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

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
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600; // Spread vertically across full landing page
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        vz: (Math.random() - 0.5) * 0.08
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pMaterial = new THREE.PointsMaterial({
      color: 0x2563eb, // Electric Blue
      size: 3.6,
      transparent: true,
      opacity: 0.7
    });
    const pointCloud = new THREE.Points(geometry, pMaterial);
    scene.add(pointCloud);

    // Proximity dynamic lines
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

    // Outer wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(36, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner wireframe dodecahedron
    const dodecaGeo = new THREE.DodecahedronGeometry(22, 0);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    coreGroup.add(dodecaMesh);

    // Orbital Ring Torus
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

    // Secondary Floating 3D Polyhedra Group (Spread vertically across the canvas)
    const floatingPolyGroup = new THREE.Group();
    const polyGeometries = [
      new THREE.OctahedronGeometry(12, 0),
      new THREE.TetrahedronGeometry(10, 0),
      new THREE.IcosahedronGeometry(14, 0),
      new THREE.DodecahedronGeometry(11, 0)
    ];

    const polyColors = [0x2563eb, 0x7c3aed, 0x0284c7, 0x059669];
    const floatingPolys = [];

    for (let i = 0; i < 12; i++) {
      const geo = polyGeometries[i % polyGeometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: polyColors[i % polyColors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.35 + (i % 3) * 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);

      const posX = (Math.random() - 0.5) * 320;
      const posY = (Math.random() - 0.5) * 500;
      const posZ = (Math.random() - 0.5) * 120;

      mesh.position.set(posX, posY, posZ);
      floatingPolyGroup.add(mesh);

      floatingPolys.push({
        mesh,
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        baseY: posY
      });
    }
    scene.add(floatingPolyGroup);

    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Main 3D Core
      coreGroup.rotation.x += 0.004;
      coreGroup.rotation.y += 0.006;
      icoMesh.rotation.y -= 0.003;
      dodecaMesh.rotation.x += 0.005;
      ringMesh.rotation.z += 0.005;

      // Rotate Floating Polyhedra
      floatingPolys.forEach((p) => {
        p.mesh.rotation.x += p.rotX;
        p.mesh.rotation.y += p.rotY;
      });

      // Update Particle Positions
      const posArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i].vx;
        posArray[i * 3 + 1] += velocities[i].vy;

        if (Math.abs(posArray[i * 3]) > 180) velocities[i].vx *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 300) velocities[i].vy *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Update Proximity Lines
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

    // Continuous 3D Scroll Reactive Engine
    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        1
      ) - window.innerHeight;

      const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

      // Core group transforms dynamically as user scrolls down the landing page
      if (coreGroup) {
        coreGroup.rotation.y = scrollY * 0.0035;
        coreGroup.rotation.x = scrollY * 0.0018;
        coreGroup.rotation.z = scrollY * 0.001;

        // Orbit back & forth smoothly down the page
        const xPos = 70 + Math.sin(progress * Math.PI * 3) * 60;
        const yPos = 15 - (scrollY * 0.04) % 250;
        coreGroup.position.set(xPos, yPos, Math.cos(progress * Math.PI * 2) * 30);

        // Morph orbital ring angle on scroll
        ringMesh.rotation.x = (Math.PI / 3) + progress * Math.PI * 4;
        ringMesh.scale.setScalar(1 + Math.sin(progress * Math.PI * 6) * 0.2);
      }

      // Floating polyhedra move in 3D parallax space relative to scroll
      if (floatingPolyGroup) {
        floatingPolyGroup.rotation.y = scrollY * 0.001;
        floatingPolys.forEach((p, idx) => {
          p.mesh.position.y = p.baseY + Math.sin(scrollY * 0.002 + idx) * 15;
        });
      }

      // Particle net scroll movement
      if (pointCloud && lines) {
        pointCloud.rotation.x = scrollY * 0.0005;
        lines.rotation.x = scrollY * 0.0005;
        pointCloud.position.y = -(scrollY * 0.02);
        lines.position.y = -(scrollY * 0.02);
      }

      // Camera perspective depth changes on scroll
      if (camera) {
        camera.position.z = 210 + Math.sin(progress * Math.PI * 4) * 30;
        camera.position.x = Math.sin(progress * Math.PI * 2) * 15;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (container) container.innerHTML = "";
    };
  }, []);

  const featureCards = [
    {
      icon: BookOpen,
      title: "1. 📚 Smart Learning",
      desc: "Learn complete CSE subjects organized systematically by Semester → Unit → Chapter → Topic with video tutorials & quizzes.",
      link: "/learn",
      tag: "Curriculum Track"
    },
    {
      icon: Bot,
      title: "2. 🤖 AI Tutor 24/7",
      desc: "Ask any technical concept question, get step-by-step code explanations, real-world examples, and personalized tutoring.",
      link: "/tutor",
      tag: "Instant AI Mentor"
    },
    {
      icon: Brain,
      title: "3. 🧠 Skill Diagnostic",
      desc: "AI continuously analyzes your strengths & weak concepts through adaptive quizzes and generates your real-time CSE Skill Graph.",
      link: "/skill-graph",
      tag: "Adaptive Analytics"
    },
    {
      icon: Code2,
      title: "4. 💻 AI Coding Lab",
      desc: "Practice DSA problems with multi-language compiler (C, C++, Java, Python, JS, SQL), custom test cases & instant AI debugging.",
      link: "/coding-lab",
      tag: "Hands-on Practice"
    },
    {
      icon: Target,
      title: "5. 🎯 Career Roadmap",
      desc: "Generate a personalized day-by-day learning roadmap tailored specifically to your target CSE role and current skill level.",
      link: "/roadmap",
      tag: "AI Roadmaps"
    },
    {
      icon: Rocket,
      title: "6. 🚀 Placement Preparation",
      desc: "Comprehensive preparation covering DSA, Core CS, Aptitude, AI Mock Interviews (5 rounds with live feedback) & CTC estimation.",
      link: "/placement-readiness",
      tag: "Interview Ready"
    }
  ];

  const targetRoles = [
    { name: "Software Developer", icon: Code2, color: "from-blue-600 to-indigo-600" },
    { name: "Full Stack Developer", icon: Layers, color: "from-indigo-600 to-purple-600" },
    { name: "Data Analyst", icon: BarChart3, color: "from-purple-600 to-pink-600" },
    { name: "AI/ML Engineer", icon: Cpu, color: "from-pink-600 to-rose-600" },
    { name: "Cyber Security Analyst", icon: Shield, color: "from-cyan-600 to-blue-600" }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E2022] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <style>{`
        .card-3d {
          transition: transform 0.35s cubic-bezier(0.1, 0.8, 0.2, 1), box-shadow 0.35s ease;
          transform-style: preserve-3d;
        }
        .card-3d:hover {
          transform: translateY(-8px) rotateX(3deg) rotateY(-2deg) translateZ(12px);
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.18), 0 12px 24px -6px rgba(124, 58, 237, 0.12);
        }
        .float-3d-1 { animation: float3d 6s ease-in-out infinite; }
        .float-3d-2 { animation: float3d 7s ease-in-out infinite 1.5s; }
        .float-3d-3 { animation: float3d 8s ease-in-out infinite 3s; }
        @keyframes float3d {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
      `}</style>
      {/* ─── TOP NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-[#EFEBE4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <LearnXLogo size="md" showBadge={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link to="/" className="text-blue-600 hover:text-blue-700 transition">Home</Link>
            <Link to="/learn" className="hover:text-blue-600 transition">Learn</Link>
            <Link to="/coding-lab" className="hover:text-blue-600 transition">Practice</Link>
            <Link to="/tutor" className="hover:text-blue-600 transition flex items-center gap-1">
              <span>AI Tutor</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">AI</span>
            </Link>
            <Link to="/skill-graph" className="hover:text-blue-600 transition">Skill Diagnostic</Link>
            <Link to="/roadmap" className="hover:text-blue-600 transition">Career Roadmap</Link>
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2EDE4] border border-[#E5DFD3] text-xs font-semibold text-slate-700">
                <span className="text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" /> {user.streakDays || 18} Day Streak
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-indigo-600 font-extrabold">{user.totalXP || 4850} XP</span>
              </div>
            )}

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/sign-in"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-[#F2EDE4] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1"
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
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F6F3EC] to-[#F2EDE4]/60 border-b border-[#EBE5DA]">
        {/* Three.js Background Canvas (FIXED FULLSCREEN 3D SCROLL ANIMATION!) */}
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
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>AI-POWERED PERSONAL LEARNING</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E2022] tracking-tight leading-[1.12]">
                Your Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  AI-Powered Learning
                </span> <br />
                & Career Mentor.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
                Learn every CSE subject, master coding, discover your skill gaps, and follow a personalized roadmap from classroom to career.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={user ? "/dashboard" : "/sign-up"}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#features"
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F2EDE4] border border-[#E5DFD3] text-slate-800 font-bold text-base shadow-xs transition"
                >
                  Explore LearnX
                </a>
              </div>

              {/* Checklist Below CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EBE5DA] max-w-lg">
                {[
                  "Personalized Learning",
                  "AI Tutor 24/7",
                  "Skill Gap Analysis",
                  "Placement Preparation"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Floating Glass Dashboard Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              {/* Glowing aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-amber-500/15 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

              {/* Floating Glass Dashboard Card */}
              <div className="relative bg-white/95 backdrop-blur-xl border border-[#EBE5DA] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-300/40 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#1E2022] text-base">Your Learning Intelligence</h3>
                      <p className="text-xs font-semibold text-slate-500">Real-time CSE Subject Mastery</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active Sync
                  </span>
                </div>

                {/* Skill Progress Bars */}
                <div className="space-y-3">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Skill Progress</div>
                  {[
                    { name: "DSA", pct: 82, color: "bg-blue-600" },
                    { name: "DBMS", pct: 74, color: "bg-indigo-600" },
                    { name: "OS", pct: 68, color: "bg-purple-600" },
                    { name: "CN", pct: 61, color: "bg-sky-600" }
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{s.name}</span>
                        <span className="font-mono text-blue-600">{s.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#F5F2EA] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.color} transition-all duration-1000`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Career Readiness */}
                <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#EBE5DA] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Rocket className="w-4 h-4 text-blue-600" /> Career Readiness Score
                    </span>
                    <span className="text-blue-600 font-extrabold font-mono text-sm">78%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#EBE5DA] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[78%]" />
                  </div>
                </div>

                {/* AI Recommendation Callout */}
                <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">AI Recommendation</div>
                    <p className="text-xs font-semibold text-purple-800 mt-0.5">
                      "Focus on Graph Algorithms next to bridge your Placement readiness gap."
                    </p>
                  </div>
                </div>

                {/* Floating Small Badges */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-center">
                    <div className="text-xs font-extrabold text-blue-700">+12%</div>
                    <div className="text-[10px] font-semibold text-slate-500">Skill Growth</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100 text-center">
                    <div className="text-xs font-extrabold text-amber-700">🔥 7 Day</div>
                    <div className="text-[10px] font-semibold text-slate-500">Streak</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-center">
                    <div className="text-xs font-extrabold text-emerald-700">🎯 3 Topics</div>
                    <div className="text-[10px] font-semibold text-slate-500">Completed</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: TRUST / STATS ────────────────────────────────────────── */}
      <section className="py-12 bg-[#FAF8F5] border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#EBE5DA]">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">10K+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">Learning Sessions</div>
            </div>
            <div className="p-4 pt-6 md:pt-4">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">50+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">CSE Topics Covered</div>
            </div>
            <div className="p-4 pt-6 md:pt-4">
              <div className="text-3xl sm:text-4xl font-black text-purple-600 tracking-tight">24/7</div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">AI Tutor Availability</div>
            </div>
            <div className="p-4 pt-6 md:pt-4">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">Personalized</div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mt-1">Adaptive Learning Paths</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: EVERYTHING YOU NEED TO GROW ─────────────────────────── */}
      <section id="features" className="py-20 bg-[#F5F2EA]/70 border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Complete Feature Suite
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              One Platform. Your Complete CSE Journey.
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Everything you need to excel in semester exams, master computer science fundamentals, and crack company placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="card-3d bg-white/95 border border-[#EBE5DA] rounded-3xl p-8 shadow-sm hover:border-blue-400 transition flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-blue-600 border border-[#E5DFD3] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#FAF8F5] text-slate-600 border border-[#EBE5DA] uppercase tracking-wider">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1E2022] group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#F2EDE4]">
                    <Link
                      to={feat.link}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                    >
                      <span>Explore Feature</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: AI PERSONALIZATION ──────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200/80">
              Adaptive Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              LearnX Understands How You Learn.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Our AI constantly models your retention, identifies high-risk concept zones, and delivers targeted micro-lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Recharts Radar AI Brain Chart */}
            <div className="lg:col-span-6 bg-[#F5F2EA] border border-[#EBE5DA] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[380px]">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Multi-Dimensional Subject Diagnostic
              </div>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={RADAR_DATA}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }} />
                    <Radar
                      name="Student Mastery"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs font-bold text-slate-500 mt-2 text-center">
                Live AI Assessment Diagnostic Map
              </div>
            </div>

            {/* Right: Learning Profile Summary */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-blue-800/80 pb-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">Profile Snapshot</div>
                    <h3 className="text-xl font-black text-white mt-0.5">YOUR LEARNING PROFILE</h3>
                  </div>
                  <UserCheck className="w-6 h-6 text-blue-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 border border-blue-800/60 rounded-2xl p-4">
                    <div className="text-xs text-blue-300 font-semibold">Current Level</div>
                    <div className="text-lg font-bold text-white mt-1">Intermediate</div>
                  </div>
                  <div className="bg-slate-950/60 border border-blue-800/60 rounded-2xl p-4">
                    <div className="text-xs text-blue-300 font-semibold">Strongest Skill</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">Programming</div>
                  </div>
                  <div className="bg-slate-950/60 border border-blue-800/60 rounded-2xl p-4">
                    <div className="text-xs text-blue-300 font-semibold">Needs Improvement</div>
                    <div className="text-lg font-bold text-rose-400 mt-1">Operating Systems</div>
                  </div>
                  <div className="bg-slate-950/60 border border-blue-800/60 rounded-2xl p-4">
                    <div className="text-xs text-blue-300 font-semibold">Recommended Next Step</div>
                    <div className="text-lg font-bold text-cyan-400 mt-1">Graph Algorithms</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-blue-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-blue-200">
                    <span>Weekly Goal Progress</span>
                    <span className="font-mono text-cyan-400">8 / 10 Hours (80%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full w-[80%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: LEARNING JOURNEY ────────────────────────────────────── */}
      <section className="py-20 bg-[#F5F2EA]/80 border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200/80">
              Proven Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              From Confused to Career Ready.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              LearnX continuously updates your personalized roadmap based on every quiz, coding solution, and diagnostic score.
            </p>
          </div>

          {/* Horizontal Journey Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { num: "01", title: "Diagnose", desc: "Identify skill gaps" },
              { num: "02", title: "Plan", desc: "AI custom roadmap" },
              { num: "03", title: "Learn", desc: "Structured units" },
              { num: "04", title: "Practice", desc: "Coding & quizzes" },
              { num: "05", title: "Measure", desc: "Track progress" },
              { num: "06", title: "Improve", desc: "Target weaknesses" },
              { num: "07", title: "Career Ready", desc: "Crack interviews" }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EBE5DA] rounded-2xl p-4 text-center shadow-xs hover:border-blue-400 transition"
              >
                <div className="text-xs font-mono font-extrabold text-blue-600 mb-1">{step.num}</div>
                <div className="text-sm font-bold text-[#1E2022]">{step.title}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: DASHBOARD PREVIEW ────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/80">
              Student Command Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              Experience the LearnX Dashboard.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              A single unified hub for your subject progress, daily goals, XP streaks, and AI recommendations.
            </p>
          </div>

          {/* Realistic Student Dashboard Mockup Card */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 space-y-8">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <h3 className="text-2xl font-black text-white">
                  {user ? `Welcome back, ${user.name || "Student"} 👋` : "Student Command Center Preview 👋"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Your CSE learning command center is up to date.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 font-extrabold text-xs flex items-center gap-1.5 border border-slate-700">
                  <Flame className="w-4 h-4 fill-amber-400" /> Current Streak: 18 Days
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-indigo-400 font-extrabold text-xs flex items-center gap-1.5 border border-slate-700">
                  <Award className="w-4 h-4" /> XP: 4,850
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Continue Learning */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Continue Learning</div>
                <div className="text-lg font-bold text-white">Data Structures & Algorithms</div>
                <div className="flex justify-between text-xs text-slate-300 pt-2 font-mono">
                  <span>Progress</span>
                  <span className="text-cyan-400 font-bold">78%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[78%]" />
                </div>
              </div>

              {/* Card 2: Today's Goal */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Focus Goal</div>
                <div className="text-lg font-bold text-emerald-400">Complete Graph Traversal</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Finish BFS & DFS unit quiz to maintain your 18-day streak.
                </div>
              </div>

              {/* Card 3: Skill Overview */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Overview</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["DSA", "DBMS", "OS", "Computer Networks", "Java"].map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200 text-xs font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Recommendation */}
            <div className="bg-indigo-950/60 border border-indigo-800/80 rounded-2xl p-4 flex items-center gap-3">
              <Bot className="w-6 h-6 text-indigo-400 shrink-0" />
              <div className="text-xs text-indigo-200">
                <strong className="text-white">AI Recommendation:</strong> "Revise BFS before starting Advanced Graphs to optimize your diagnostic score."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: CAREER INTELLIGENCE ────────────────────────────────── */}
      <section className="py-20 bg-[#F5F2EA]/70 border-b border-[#EBE5DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200/80">
              Placement Readiness Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E2022] tracking-tight">
              Know Where You Stand. Know What To Learn Next.
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Bridge the gap between academic curriculum and high-growth industry roles with data-backed skill intelligence.
            </p>
          </div>

          {/* Flow Pipeline */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-xs sm:text-sm font-bold text-slate-700 bg-white p-6 rounded-3xl border border-[#EBE5DA] shadow-xs max-w-4xl mx-auto">
            <span className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] text-slate-800 border border-[#E5DFD3]">Current Skills</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/60">Skill Gap Analysis</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60">Target Role</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60">Personalized Roadmap</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">Placement Prep</span>
          </div>

          {/* Target Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {targetRoles.map((role, idx) => {
              const RoleIcon = role.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#EBE5DA] rounded-2xl p-5 text-center shadow-xs hover:shadow-md hover:border-blue-300 transition space-y-3"
                >
                  <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-r ${role.color} text-white flex items-center justify-center shadow-sm`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-[#1E2022]">{role.name}</div>
                  <Link
                    to="/career-readiness"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <span>View Role Path</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 font-medium italic">
            * LearnX provides objective skill diagnostic intelligence to assist in candidate placement readiness.
          </p>
        </div>
      </section>

      {/* ─── SECTION 8: FINAL CTA & FOOTER ───────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Career Doesn't Need <br />
            Another Generic Course.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium max-w-2xl mx-auto">
            Build the skills. Follow the roadmap. Let AI guide your next step from classroom to tech industry.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={user ? "/dashboard" : "/sign-up"}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start Your LearnX Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/learn"
              className="px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-base transition"
            >
              Explore Platform
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
              <Link to="/learn" className="hover:text-blue-400 transition">Learn</Link>
              <Link to="/coding-lab" className="hover:text-blue-400 transition">Practice</Link>
              <Link to="/tutor" className="hover:text-blue-400 transition">AI Tutor</Link>
              <Link to="/career-readiness" className="hover:text-blue-400 transition">Career</Link>
              <Link to="/privacy" className="hover:text-blue-400 transition">Privacy</Link>
              <Link to="/terms" className="hover:text-blue-400 transition">Terms</Link>
              <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} LearnX. All rights reserved.</p>
            <p>Student Growth & Career Intelligence Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
