import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LearnXLogo, LearnXIcon } from "../components/LearnXLogo.jsx";
import * as THREE from "three";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 3D Canvas Reference
  const canvasContainerRef = useRef(null);

  // Interactive IDE State
  const [activeCodeTab, setActiveCodeTab] = useState("cpp");
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState(null);
  const [aiMentorQuery, setAiMentorQuery] = useState("");
  const [aiMentorResponse, setAiMentorResponse] = useState(null);
  const [isAiAnswering, setIsAiAnswering] = useState(false);

  // Interactive Diagnostic Quiz State
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Demo Tutor Q&A index
  const [activeTutorIndex, setActiveTutorIndex] = useState(0);

  // 3D Background Three.js Effect
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 750;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Particle nodes network
    const particleCount = 110;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 340;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        vz: (Math.random() - 0.5) * 0.2
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 3.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const pointCloud = new THREE.Points(geometry, pMaterial);
    scene.add(pointCloud);

    // Proximity dynamic lines
    const maxConnections = 450;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Floating 3D algorithmic geometric core
    const coreGroup = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(34, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    const innerGeo = new THREE.SphereGeometry(17, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    const torusGeo = new THREE.TorusGeometry(50, 1.2, 12, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.65
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    coreGroup.add(torusMesh);

    coreGroup.position.set(75, 15, 0);
    scene.add(coreGroup);

    // Parallax mouse movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.08;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animFrameId;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (-targetY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      coreGroup.rotation.x += 0.005;
      coreGroup.rotation.y += 0.008;
      innerMesh.rotation.y -= 0.015;
      torusMesh.rotation.z += 0.006;

      const posArr = geometry.attributes.position.array;
      let lineIdx = 0;
      let colorIdx = 0;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i].vx;
        posArr[i * 3 + 1] += velocities[i].vy;
        posArr[i * 3 + 2] += velocities[i].vz;

        if (posArr[i * 3] < -170 || posArr[i * 3] > 170) velocities[i].vx *= -1;
        if (posArr[i * 3 + 1] < -110 || posArr[i * 3 + 1] > 110) velocities[i].vy *= -1;
        if (posArr[i * 3 + 2] < -80 || posArr[i * 3 + 2] > 80) velocities[i].vz *= -1;

        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < 2200 && lineIdx < maxConnections * 6) {
            linePositions[lineIdx++] = posArr[i * 3];
            linePositions[lineIdx++] = posArr[i * 3 + 1];
            linePositions[lineIdx++] = posArr[i * 3 + 2];

            linePositions[lineIdx++] = posArr[j * 3];
            linePositions[lineIdx++] = posArr[j * 3 + 1];
            linePositions[lineIdx++] = posArr[j * 3 + 2];

            const alpha = Math.max(0, 1.0 - Math.sqrt(distSq) / 47);
            lineColors[colorIdx++] = 0.54 * alpha;
            lineColors[colorIdx++] = 0.36 * alpha;
            lineColors[colorIdx++] = 0.96 * alpha;

            lineColors[colorIdx++] = 0.02 * alpha;
            lineColors[colorIdx++] = 0.71 * alpha;
            lineColors[colorIdx++] = 0.83 * alpha;
          }
        }
      }

      for (let k = lineIdx; k < maxConnections * 6; k++) {
        linePositions[k] = 0;
      }
      for (let k = colorIdx; k < maxConnections * 6; k++) {
        lineColors[k] = 0;
      }

      geometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 750;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Code Snippets for Interactive IDE
  const codeSnippets = {
    cpp: {
      file: "median_two_sorted_arrays.cpp",
      lang: "C++20",
      code: `// Amazon L5 / Google L4 Optimal Median Search
#include <vector>
#include <climits>
#include <iostream>
using namespace std;

double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
    if (A.size() > B.size()) return findMedianSortedArrays(B, A);
    int m = A.size(), n = B.size();
    int low = 0, high = m;
    
    while (low <= high) {
        int px = (low + high) / 2;
        int py = (m + n + 1) / 2 - px;
        
        int maxLeftX = (px == 0) ? INT_MIN : A[px - 1];
        int minRightX = (px == m) ? INT_MAX : A[px];
        int maxLeftY = (py == 0) ? INT_MIN : B[py - 1];
        int minRightY = (py == n) ? INT_MAX : B[py];
        
        if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
            if ((m + n) % 2 == 0)
                return (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2.0;
            return max(maxLeftX, maxLeftY);
        } else if (maxLeftX > minRightY) high = px - 1;
        else low = px + 1;
    }
    return 0.0;
}`
    },
    py: {
      file: "lru_cache_o1.py",
      lang: "Python 3.12",
      code: `# Meta E4 / Uber Systems - O(1) LRU Cache Architecture
class Node:
    def __init__(self, key: int, val: int):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # key -> node
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]`
    },
    rs: {
      file: "concurrency_mutex.rs",
      lang: "Rust (Kernel)",
      code: `// Lock-free Ring Buffer & Atomic Synchronization
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;

pub struct LockFreeRingBuffer<T> {
    buffer: Vec<Option<T>>,
    capacity: usize,
    head: AtomicUsize,
    tail: AtomicUsize,
}

impl<T> LockFreeRingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        Self {
            buffer: (0..capacity).map(|_| None).collect(),
            capacity,
            head: AtomicUsize::new(0),
            tail: AtomicUsize::new(0),
        }
    }
    
    pub fn try_push(&self, item: T) -> Result<(), &'static str> {
        let current_tail = self.tail.load(Ordering::Acquire);
        let next_tail = (current_tail + 1) % self.capacity;
        if next_tail == self.head.load(Ordering::Acquire) {
            return Err("Ring Buffer Full");
        }
        self.tail.store(next_tail, Ordering::Release);
        Ok(())
    }
}`
    }
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setCodeOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setCodeOutput({
        status: "SUCCESS (200 OK)",
        runtime: "0.04 ms",
        memory: "12.4 MB (Top 98.2%)",
        diagnostics: "All 18 Hidden Test Cases Passed. Zero Memory Leaks.",
        complexity: "Time: O(log(min(N,M))) | Space: O(1)"
      });
    }, 600);
  };

  const handleAskAiMentor = (e) => {
    e.preventDefault();
    if (!aiMentorQuery.trim()) return;
    setIsAiAnswering(true);
    setAiMentorResponse(null);

    setTimeout(() => {
      setIsAiAnswering(false);
      setAiMentorResponse({
        query: aiMentorQuery,
        insight: `For '${aiMentorQuery}', in interview settings: Always state the brute-force baseline O(M+N) merge first to show progression, then transition to binary search on the shorter array partition. This proves logarithmic bounds O(log(min(M,N))) with zero auxiliary allocation!`
      });
      setAiMentorQuery("");
    }, 700);
  };

  // Demo Tutor Questions
  const demoTutorQuestions = [
    {
      q: "Explain BCNF with a real-world database anomaly example.",
      tag: "DBMS • Normalization",
      a: "A relation is in Boyce-Codd Normal Form (BCNF) if for every non-trivial functional dependency X → Y, X is a Superkey. In simpler terms: every determinant must be a candidate key! Unlike 3NF, BCNF completely prevents update/delete anomalies when a relation has multiple overlapping candidate keys."
    },
    {
      q: "Why use B+ Trees over Hash Tables for database indexing?",
      tag: "DBMS • Storage Engines",
      a: "Hash indexes provide O(1) point lookups (e.g. WHERE id = 42), but fail completely for range queries (WHERE age BETWEEN 20 AND 30). B+ Trees keep leaf nodes linked in a sorted sequential doubly-linked list, allowing O(log N) point search AND blazing fast range scans with optimal disk I/O page caching."
    },
    {
      q: "Preemptive vs Non-Preemptive Scheduling: What happens in Linux CFS?",
      tag: "OS • Kernel Architecture",
      a: "In preemptive scheduling, the OS kernel can interrupt a running task via timer interrupts to allocate CPU to higher-priority processes (e.g., Round Robin, CFS). Linux Completely Fair Scheduler (CFS) uses red-black trees indexed by 'vruntime' to guarantee fairness in O(log N) preemption."
    },
    {
      q: "How does Raft Consensus handle Network Partitions?",
      tag: "System Design • Distributed Systems",
      a: "Raft guarantees safety through majority quorum ((N/2) + 1). If a cluster of 5 nodes is split into 2 and 3: the minority partition (2 nodes) cannot elect a leader or commit entries, preventing split-brain. When the network heals, the majority log overwrites the stale minority."
    }
  ];

  // Diagnostic Sample Question
  const sampleDiagnostic = {
    subject: "Operating Systems",
    question: "Which condition is NOT strictly necessary for a Deadlock to occur in a multi-threaded OS?",
    options: [
      { id: "A", text: "Mutual Exclusion" },
      { id: "B", text: "Hold and Wait" },
      { id: "C", text: "Preemption Allowed by Kernel", isCorrect: true },
      { id: "D", text: "Circular Wait" }
    ],
    explanation: "Coffman's 4 Necessary Conditions for Deadlock are: 1) Mutual Exclusion, 2) Hold and Wait, 3) NO Preemption, and 4) Circular Wait. If preemption is allowed, the OS can forcibly reclaim resources, which breaks the deadlock condition!"
  };

  return (
    <div className="bg-[#090D16] text-[#DFE2EF] min-h-screen relative overflow-x-hidden selection:bg-purple-600 selection:text-white font-sans">
      {/* 3D Ambient Glowing Light Orbs */}
      <div className="fixed top-[-10rem] left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[35%] -left-[15rem] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-[70%] -right-[15rem] w-[650px] h-[650px] bg-purple-700/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ─── 1. 3D GLASSMORPHIC STICKY TOP NAVIGATION ─── */}
      <header className="sticky top-0 z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-purple-900/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                  <LearnXIcon className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white font-mono">
                  Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">X</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold tracking-wide">
                  v4.2 3D AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#tracks" className="hover:text-cyan-400 transition-colors">Curriculum</a>
              <a href="#terminal-playground" className="hover:text-purple-400 transition-colors">Interactive IDE</a>
              <a href="#ai-tutor-preview" className="hover:text-cyan-400 transition-colors">AI Copilot</a>
              <a href="#diagnostic-preview" className="hover:text-purple-400 transition-colors">Skill Diagnostic</a>
              <a href="#leaderboard-stats" className="hover:text-cyan-400 transition-colors">Telemetry</a>
            </nav>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Gamification Streak Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141A2B] border border-purple-800/40 text-xs font-mono">
              <span className="text-amber-400 animate-pulse">🔥</span>
              <span className="text-slate-200 font-semibold">18-Day Streak</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-purple-400 font-bold">4,850 XP</span>
            </div>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:brightness-110 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-600/25 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. HERO SECTION WITH 3D WEBGL PARTICLE SCENE ─── */}
      <section className="relative min-h-[720px] lg:min-h-[820px] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-purple-950/40">
        {/* 3D WebGL / Three.js Scene Container */}
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          style={{ display: "block" }}
        />

        {/* Cyberpunk Subtle Grid Overlay */}
        <div className="absolute inset-0 grid-bg-cyber opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Futuristic Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#141A2B]/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 mb-6 shadow-lg shadow-cyan-500/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-semibold tracking-wider uppercase">
              ⚡ NEURAL PLACEMENT ENGINE v4.2 • 98.4% OFFER CONVERSION
            </span>
          </div>

          {/* Master 3D Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Master Computer Science with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-300">
              Autonomous 3D AI Mentorship
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Accelerate your engineering career with real-time algorithm visualizers, production-grade OS kernel sandboxes, deep DBMS internals, and personalized FAANG mock interview simulations.
          </p>

          {/* Dual Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
            <Link
              to={user ? "/learn" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 glow-violet hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-purple-600/30"
            >
              <span>🚀 Start Placement Track Free</span>
              <span className="text-cyan-300 font-mono text-xs">→</span>
            </Link>

            <a
              href="#terminal-playground"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel-3d hover:border-cyan-400 text-cyan-300 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#141A2B]/80 active:scale-95 transition-all"
            >
              <span>⚡ Explore Live Interactive IDE</span>
            </a>
          </div>

          {/* Telemetry Proof Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-8 border-t border-purple-900/30">
            <div className="flex items-center justify-center gap-2.5 text-slate-300 font-mono text-xs">
              <span className="text-cyan-400 text-base">✓</span>
              <span><strong className="text-white text-sm">45,000+</strong> Offers Cracked</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-slate-300 font-mono text-xs">
              <span className="text-amber-400 text-base">★</span>
              <span><strong className="text-white text-sm">4.9/5</strong> Rating from FAANG Devs</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-slate-300 font-mono text-xs">
              <span className="text-purple-400 text-base">⚡</span>
              <span><strong className="text-white text-sm">Zero Setup</strong> Cloud Kernels</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. 3D HOLOGRAPHIC DIAGNOSTIC & METRIC CARDS ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Tutor Real-Time */}
          <div className="glass-panel-elevated p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                  Neural Diagnostic
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                99.2% ACCURACY
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">AI Tutor 2.0 (Real-Time Debugger)</h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Autonomous execution stack analyzing memory leaks, asymptotic efficiency, and logic boundaries instantly.
            </p>
            <div className="p-3 rounded-xl bg-[#070A10] border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
              <span className="text-[11px]">&gt;_ Explaining AVL Tree Rotations...</span>
              <span className="text-purple-400">🤖</span>
            </div>
          </div>

          {/* Card 2: FAANG Placement Readiness */}
          <div className="glass-panel-elevated p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-purple-500/20 hover:border-cyan-500/50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-semibold">
                  Target Readiness
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
                TOP 1.2% NATIONWIDE
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">FAANG Placement Engine</h2>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                94.8%
              </span>
              <span className="text-xs font-mono text-slate-400">Readiness Score</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Recent offers:</span>
              <span className="text-white font-semibold">Google L4</span> •
              <span className="text-white font-semibold">Meta E4</span> •
              <span className="text-white font-semibold">Stripe L3</span>
            </div>
          </div>

          {/* Card 3: OS Concurrency Visualizer */}
          <div className="glass-panel-elevated p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-purple-500/20 hover:border-emerald-500/50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                  Kernel Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold">
                POSIX Threads
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Concurrency & OS Visualizer</h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Interactive race condition detector, deadlock graphing, and dirty-page cache inspection in live WASM sandbox.
            </p>
            <div className="flex items-center justify-between text-xs font-mono bg-[#070A10] p-2.5 rounded-xl border border-slate-800">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mutex Guard Active
              </span>
              <span className="text-slate-300">Thread #4 Acquired</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. INTERACTIVE CODE PLAYGROUND & AI SANDBOX ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="terminal-playground">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <span>💻 Cloud Execution Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Next-Gen Interactive IDE & AI Diagnostic</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400">Kernel Engine:</span>
            <span className="px-3 py-1 rounded-lg bg-[#141A2B] border border-cyan-500/30 font-mono text-xs text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Ubuntu 24.04 (v6.8-LTS Cloud)
            </span>
          </div>
        </div>

        {/* Main IDE Frame */}
        <div className="glass-panel-3d rounded-2xl border border-purple-900/40 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Code Editor Pane (8 Cols) */}
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-[#070A10]">
            {/* Editor Tabs Header */}
            <div className="flex items-center justify-between bg-[#0B0F1A] border-b border-slate-800 px-4 py-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                {Object.keys(codeSnippets).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveCodeTab(key);
                      setCodeOutput(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                      activeCodeTab === key
                        ? "bg-[#141A2B] text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>📄 {codeSnippets[key].file}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs font-mono text-slate-400">
                {codeSnippets[activeCodeTab].lang}
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed text-slate-200">
              <pre>
                <code>{codeSnippets[activeCodeTab].code}</code>
              </pre>
            </div>

            {/* Live Execution Console Bar */}
            <div className="p-3.5 bg-[#0B0F1A] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white font-mono font-semibold text-xs flex items-center gap-1.5 glow-cyan active:scale-95 transition-all disabled:opacity-50"
                >
                  {isRunningCode ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Executing in Sandbox...</span>
                    </>
                  ) : (
                    <>
                      <span>▶</span>
                      <span>Run Code (Ctrl+Enter)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCodeOutput({
                      status: "CALL STACK VISUALIZED",
                      runtime: "Active Stack Frames: 3",
                      memory: "Heap Partition: 0x7ffd20a -> 0x7ffd23f",
                      diagnostics: "Recursion depth safe. Binary divide-and-conquer active.",
                      complexity: "In-Place Execution"
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#141A2B] hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>📊 Visualize Call Stack</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Time: <span className="text-cyan-400">0.04ms</span></span>
                <span>Memory: <span className="text-purple-400">12.4 MB</span></span>
              </div>
            </div>

            {/* Output Display */}
            {codeOutput && (
              <div className="p-4 bg-[#05070C] border-t border-purple-900/30 text-xs font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                  <span>● {codeOutput.status}</span>
                  <span className="text-slate-400 font-normal">{codeOutput.complexity}</span>
                </div>
                <div className="text-slate-300">{codeOutput.diagnostics}</div>
                <div className="text-slate-400 mt-1">Runtime: {codeOutput.runtime} | Memory: {codeOutput.memory}</div>
              </div>
            )}
          </div>

          {/* Live AI Diagnostic & Copilot Side Panel (4 Cols) */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-[#0B0F1A]/80">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">🧠</span>
                  <span className="font-semibold text-sm text-white">AI Neural Copilot</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                  ONLINE
                </span>
              </div>

              {/* Diagnostic Insight Box */}
              <div className="p-3.5 rounded-xl bg-[#070A10] border border-purple-500/30 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-1">
                  <span>⚡</span>
                  <span>Optimal Complexity Achieved</span>
                </div>
                <p className="font-mono text-xs text-slate-300 leading-relaxed mb-3">
                  Partition reached <strong className="text-cyan-300">O(log(min(n,m)))</strong>. Aligned for <span className="text-white font-semibold">Amazon L5</span> & <span className="text-white font-semibold">Google L4</span> benchmark tests.
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full" style={{ width: "96%" }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Algorithmic Optimality</span>
                  <span className="text-cyan-400 font-bold">96%</span>
                </div>
              </div>

              {/* Stack Telemetry Warnings */}
              <div className="space-y-2 mb-4">
                <div className="p-2.5 rounded-lg bg-[#141A2B] border border-slate-800 flex items-start gap-2">
                  <span className="text-cyan-400 text-xs mt-0.5">✓</span>
                  <div className="font-mono text-xs">
                    <div className="text-white font-medium">Zero Cache Misses</div>
                    <div className="text-slate-400 text-[11px]">Continuous memory alignment in stack frame.</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#141A2B] border border-slate-800 flex items-start gap-2">
                  <span className="text-purple-400 text-xs mt-0.5">💡</span>
                  <div className="font-mono text-xs">
                    <div className="text-white font-medium">Pass-By-Reference Verified</div>
                    <div className="text-slate-400 text-[11px]">Memory copy overhead reduced by 100%.</div>
                  </div>
                </div>
              </div>

              {/* AI Mentor Answer Preview if any */}
              {aiMentorResponse && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-slate-200 mb-3 animate-fade-in">
                  <div className="text-purple-300 font-semibold mb-1">Mentor Feedback:</div>
                  <div className="leading-relaxed">{aiMentorResponse.insight}</div>
                </div>
              )}
            </div>

            {/* Ask AI Mentor Query Box */}
            <form onSubmit={handleAskAiMentor} className="pt-3 border-t border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  value={aiMentorQuery}
                  onChange={(e) => setAiMentorQuery(e.target.value)}
                  placeholder="Ask AI Mentor for hint..."
                  className="w-full pl-3 pr-16 py-2 text-xs font-mono rounded-lg bg-[#070A10] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={isAiAnswering}
                  className="absolute right-1 top-1 px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-[11px] font-mono font-semibold text-white transition-all disabled:opacity-50"
                >
                  {isAiAnswering ? "..." : "Ask"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ─── 5. CORE CURRICULUM TRACKS MATRIX ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="tracks">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-bold">
            FOUNDATIONAL SYLLABUS MATRIX
          </span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">Master Four Core Engineering Pillars</h2>
          <p className="text-sm text-slate-300">
            Surgically crafted curriculum mapped directly against actual FAANG, quant hedge fund, and unicorn engineering assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track 1: DSA */}
          <div className="glass-panel-3d p-6 rounded-2xl border border-purple-900/40 hover:border-purple-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#141A2B] flex items-center justify-center border border-purple-500/30 group-hover:border-purple-400 transition-colors text-2xl">
                  🌲
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                1. Data Structures & Algorithms
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Dynamic Programming on Trees, Segment Trees, Disjoint Set Union (DSU), Max-Flow Graph Kernels, and NP-Complete reduction heuristics.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  250+ Problems
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Graph Theory
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Monotonic Queues
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Hiring:</span>
                <span className="text-white">Google</span> • <span className="text-white">Amazon</span> • <span className="text-white">Uber</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>

          {/* Track 2: DBMS */}
          <div className="glass-panel-3d p-6 rounded-2xl border border-purple-900/40 hover:border-cyan-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#141A2B] flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400 transition-colors text-2xl">
                  🗄️
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                2. Database Management Systems
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Deep dive into B+ Tree page layouts, WAL write-ahead logs, 2-Phase Locking, Distributed Multi-Version Concurrency (MVCC), and Sharded PostgreSQL.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  ACID Internals
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  LSM Trees
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Query Planner Cost
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Hiring:</span>
                <span className="text-white">Snowflake</span> • <span className="text-white">Stripe</span> • <span className="text-white">Oracle</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>

          {/* Track 3: Operating Systems */}
          <div className="glass-panel-3d p-6 rounded-2xl border border-purple-900/40 hover:border-indigo-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#141A2B] flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-400 transition-colors text-2xl">
                  ⚡
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                3. Operating Systems & Low-Level
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Build simple UNIX schedulers, manage virtual memory page tables (TLB), trace POSIX signals, and write lock-free ring buffers in C and Rust.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Kernel Drivers
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  epoll / kqueue
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Memory Virtualization
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Hiring:</span>
                <span className="text-white">Apple</span> • <span className="text-white">Nvidia</span> • <span className="text-white">Microsoft</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>

          {/* Track 4: System Design */}
          <div className="glass-panel-3d p-6 rounded-2xl border border-purple-900/40 hover:border-emerald-500/60 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#141A2B] flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-400 transition-colors text-2xl">
                  🌐
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                4. System Design & Distributed Networks
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Architect hyper-scale services: Raft consensus protocols, consistent hashing rings, idempotency keys, and multi-region Kafka ingestion pipelines.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Raft Consensus
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Rate Limiters
                </span>
                <span className="px-2.5 py-1 rounded bg-[#141A2B] font-mono text-[11px] text-slate-300 border border-slate-800">
                  Distributed Tracing
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Hiring:</span>
                <span className="text-white">Meta</span> • <span className="text-white">Netflix</span> • <span className="text-white">Palantir</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. INTERACTIVE AI TUTOR & DIAGNOSTIC DEMOS ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="ai-tutor-preview">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: AI Contextual Doubt Solver Preview */}
          <div className="glass-panel-3d p-6 sm:p-8 rounded-2xl border border-purple-900/40">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">
                🤖 24/7 Contextual CS AI Tutor
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Viva & Concept Explanations</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Ask deep conceptual questions across DBMS normalization, OS concurrency, or distributed algorithms and get crystal-clear breakdowns.
            </p>

            {/* Questions Picker */}
            <div className="space-y-2.5 mb-6">
              {demoTutorQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTutorIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all ${
                    activeTutorIndex === idx
                      ? "bg-[#141A2B] border-cyan-500/50 text-cyan-300 shadow-md"
                      : "bg-[#0B0F1A] border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-[10px] text-purple-400 font-bold mb-1">{item.tag}</div>
                  <div className="font-semibold text-white">{item.q}</div>
                </button>
              ))}
            </div>

            {/* Answer Display */}
            <div className="p-4 rounded-xl bg-[#070A10] border border-purple-500/30 text-xs text-slate-200 leading-relaxed font-mono">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                <span>AI Tutor Response</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                  Zero Hallucination Mode
                </span>
              </div>
              <p>{demoTutorQuestions[activeTutorIndex].a}</p>
            </div>
          </div>

          {/* Right: Live Interactive Diagnostic Assessment Quiz */}
          <div className="glass-panel-3d p-6 sm:p-8 rounded-2xl border border-purple-900/40" id="diagnostic-preview">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-400 font-mono text-xs uppercase font-bold tracking-wider">
                🎯 Live Skill Assessment Demo
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Level: Mid-Senior
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Topic Diagnostic Check</h3>
            <p className="text-xs text-slate-300 mb-6">
              Test your foundational knowledge. Our diagnostic engine pinpoints sub-topic vulnerabilities automatically.
            </p>

            <div className="p-4 rounded-xl bg-[#0B0F1A] border border-slate-800 mb-4">
              <div className="text-xs font-semibold text-slate-300 mb-4">
                {sampleDiagnostic.question}
              </div>

              <div className="space-y-2.5">
                {sampleDiagnostic.options.map((opt) => {
                  const isSelected = selectedQuizOption === opt.id;
                  let btnStyle = "bg-[#070A10] border-slate-800 text-slate-300 hover:border-slate-700";

                  if (quizSubmitted) {
                    if (opt.isCorrect) {
                      btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold";
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = "bg-red-950/60 border-red-500 text-red-300";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-[#141A2B] border-purple-500 text-purple-300";
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (!quizSubmitted) setSelectedQuizOption(opt.id);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {quizSubmitted && opt.isCorrect && (
                        <span className="text-emerald-400 font-bold">✓ Correct</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {!quizSubmitted ? (
                <button
                  onClick={() => {
                    if (selectedQuizOption) setQuizSubmitted(true);
                  }}
                  disabled={!selectedQuizOption}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white font-mono text-xs font-semibold disabled:opacity-50 transition-all active:scale-95"
                >
                  Submit Diagnostic Answer
                </button>
              ) : (
                <div className="w-full">
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-slate-200 mb-3">
                    <span className="text-purple-300 font-bold">Diagnostic Insight: </span>
                    {sampleDiagnostic.explanation}
                  </div>
                  <Link
                    to="/assessment"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold"
                  >
                    Take Full Diagnostic Test (15 Topics) →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. GAMIFIED DEVELOPER STATS & CONSISTENCY MATRIX ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="leaderboard-stats">
        <div className="glass-panel-3d p-6 md:p-8 rounded-3xl border border-purple-900/40 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-800">
            {/* Profile Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-600/30">
                  <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center font-bold text-xl text-cyan-400 font-mono">
                    AM
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold font-mono">
                  #42
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">Alex Mercer</h4>
                  <span className="font-mono text-xs text-cyan-400">@alex_dev</span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Targeting: Staff Systems Engineer • Global Placement Percentile: 98.8%
                </p>
              </div>
            </div>

            {/* Unlocked Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#141A2B] border border-purple-500/40 text-purple-300 font-mono text-xs flex items-center gap-1.5">
                ✨ DP Sorcerer
              </span>
              <span className="px-3 py-1 rounded-full bg-[#141A2B] border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5">
                ⚡ Kernel Hacker
              </span>
              <span className="px-3 py-1 rounded-full bg-[#141A2B] border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
                🌐 System Architect
              </span>
            </div>
          </div>

          {/* Metric Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
            {/* Problem Breakdown */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-white font-mono">Total Solved</span>
                  <span className="font-mono font-bold text-lg text-cyan-400">
                    412 <span className="text-xs text-slate-500 font-normal">/ 500</span>
                  </span>
                </div>
                {/* Progress Stack */}
                <div className="w-full bg-[#070A10] h-3 rounded-full flex overflow-hidden mb-4 border border-slate-800">
                  <div className="bg-emerald-500 h-full" style={{ width: "25%" }} title="Easy: 88" />
                  <div className="bg-amber-500 h-full" style={{ width: "50%" }} title="Medium: 214" />
                  <div className="bg-rose-500 h-full" style={{ width: "25%" }} title="Hard: 110" />
                </div>
                {/* Difficulty Stats Details */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Easy
                    </span>
                    <span className="text-white font-semibold">88 / 100</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium
                    </span>
                    <span className="text-white font-semibold">214 / 250</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Hard (FAANG Target)
                    </span>
                    <span className="text-white font-semibold">110 / 150</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Global Rating: <strong className="text-cyan-400 font-bold">2,410</strong></span>
                <span>Top 0.8% Worldwide</span>
              </div>
            </div>

            {/* Heatmap Matrix */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-white font-mono">Daily Solve Consistency Matrix</span>
                  <span className="font-mono text-xs text-cyan-400">365 Days Active</span>
                </div>
                {/* Glowing Heatmap Matrix Grid */}
                <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto p-3 rounded-xl bg-[#070A10] border border-slate-800">
                  {Array.from({ length: 196 }).map((_, i) => {
                    const intensity = (i * 17) % 5;
                    let colorClass = "bg-slate-800/40";
                    if (intensity === 1) colorClass = "bg-purple-900/60";
                    if (intensity === 2) colorClass = "bg-purple-600/70";
                    if (intensity === 3) colorClass = "bg-cyan-500/80";
                    if (intensity === 4) colorClass = "bg-cyan-400";
                    return (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-sm ${colorClass} transition-all hover:scale-125`}
                        title={`Day ${i + 1}: ${intensity * 3} Solves`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-3">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-slate-800/40" />
                  <span className="w-2 h-2 rounded-sm bg-purple-900/60" />
                  <span className="w-2 h-2 rounded-sm bg-purple-600/70" />
                  <span className="w-2 h-2 rounded-sm bg-cyan-400" />
                </div>
                <span>More (12 Solves / Day)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. ENTERPRISE & ALUMNI ENDORSEMENTS ─── */}
      <section className="py-12 border-y border-purple-900/20 bg-[#06080F]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-8">
            Engineers at top tech powerhouses prepare and evaluate with LearnX
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75 font-mono text-sm sm:text-base font-bold text-slate-300">
            <span className="hover:text-white transition-colors">GOOGLE</span>
            <span className="hover:text-white transition-colors">META</span>
            <span className="hover:text-white transition-colors">AMAZON</span>
            <span className="hover:text-white transition-colors">APPLE</span>
            <span className="hover:text-white transition-colors">MICROSOFT</span>
            <span className="hover:text-white transition-colors">NETFLIX</span>
            <span className="hover:text-white transition-colors">PALANTIR</span>
            <span className="hover:text-white transition-colors">SNOWFLAKE</span>
          </div>
        </div>
      </section>

      {/* ─── 9. CALL TO ACTION BANNER ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-panel-elevated p-10 sm:p-14 rounded-3xl border border-purple-500/30 glow-violet relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Accelerate Your Placement Journey?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Join thousands of students and engineers mastering core computer science and landing dream engineering roles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                {user ? "Open Your Dashboard →" : "Get Started Free Today →"}
              </Link>
              <Link
                to="/learn"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#090D16] border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 font-semibold text-sm transition-all"
              >
                Browse All 4 Tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. FUTURISTIC TERMINAL FOOTER ─── */}
      <footer className="bg-[#05070C] border-t border-purple-950/40 font-mono text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white">LearnX</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300">Neural Node Online</span>
            </div>
            <p className="text-slate-500">
              © 2026 LearnX AI Platform. All nodes operational (99.98% uptime).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400">
            <a href="#tracks" className="hover:text-cyan-400 transition-colors">Curriculum Matrix</a>
            <Link to="/assessment" className="hover:text-purple-400 transition-colors">Diagnostic Engine</Link>
            <Link to="/tutor" className="hover:text-cyan-400 transition-colors">AI Mentor</Link>
            <Link to="/learn" className="hover:text-purple-400 transition-colors">Tracks</Link>
            <a href="#leaderboard-stats" className="hover:text-cyan-400 transition-colors">System Telemetry</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
