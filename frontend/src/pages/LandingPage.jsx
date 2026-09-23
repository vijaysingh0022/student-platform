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

  // 3D Background Three.js Effect configured for crisp White / Light Background
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
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 340;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        vz: (Math.random() - 0.5) * 0.18
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Vibrant points visible on white background
    const pMaterial = new THREE.PointsMaterial({
      color: 0x7c3aed,
      size: 4.2,
      transparent: true,
      opacity: 0.85
    });
    const pointCloud = new THREE.Points(geometry, pMaterial);
    scene.add(pointCloud);

    // Proximity dynamic lines
    const maxConnections = 400;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Floating 3D algorithmic geometric core
    const coreGroup = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(34, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    const innerGeo = new THREE.SphereGeometry(17, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    const torusGeo = new THREE.TorusGeometry(50, 1.2, 12, 64);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.5
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
      mouseX = (e.clientX - window.innerWidth / 2) * 0.07;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.07;
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
            lineColors[colorIdx++] = 0.48 * alpha; // Purple
            lineColors[colorIdx++] = 0.22 * alpha;
            lineColors[colorIdx++] = 0.93 * alpha;

            lineColors[colorIdx++] = 0.01 * alpha; // Blue
            lineColors[colorIdx++] = 0.52 * alpha;
            lineColors[colorIdx++] = 0.78 * alpha;
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
    <div className="bg-white text-slate-900 min-h-screen relative overflow-x-hidden selection:bg-purple-600 selection:text-white font-sans">
      {/* 3D Soft Ambient Pastel Glow Orbs for Light Mode */}
      <div className="fixed top-[-8rem] left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-purple-200/50 via-indigo-100/40 to-cyan-100/50 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[35%] -left-[12rem] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="fixed top-[70%] -right-[12rem] w-[550px] h-[550px] bg-purple-100/50 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* ─── 1. 3D GLASSMORPHIC STICKY TOP NAVIGATION ─── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-md shadow-purple-500/15 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <LearnXIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 font-mono">
                  Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">X</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold tracking-wide">
                  v4.2 3D AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#tracks" className="hover:text-purple-600 transition-colors">Curriculum</a>
              <a href="#terminal-playground" className="hover:text-purple-600 transition-colors">Interactive IDE</a>
              <a href="#ai-tutor-preview" className="hover:text-purple-600 transition-colors">AI Copilot</a>
              <a href="#diagnostic-preview" className="hover:text-purple-600 transition-colors">Skill Diagnostic</a>
              <a href="#leaderboard-stats" className="hover:text-purple-600 transition-colors">Telemetry</a>
            </nav>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Gamification Streak Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono shadow-xs">
              <span className="text-amber-500">🔥</span>
              <span className="text-slate-700 font-semibold">18-Day Streak</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-purple-600 font-bold">4,850 XP</span>
            </div>

            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-purple-600/20 transition-all active:scale-95"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:brightness-105 text-white font-semibold text-xs tracking-wide shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center gap-1.5"
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
      <section className="relative min-h-[720px] lg:min-h-[800px] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-100 bg-gradient-to-b from-white via-slate-50/50 to-white">
        {/* 3D WebGL / Three.js Scene Container */}
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
          style={{ display: "block" }}
        />

        {/* Subtle Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Futuristic Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200 text-purple-700 mb-6 shadow-md shadow-purple-100 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span className="text-xs font-mono font-semibold tracking-wider uppercase">
              ⚡ NEURAL PLACEMENT ENGINE v4.2 • 98.4% OFFER CONVERSION
            </span>
          </div>

          {/* Master 3D Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight mb-6">
            Master Computer Science with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600">
              Autonomous 3D AI Mentorship
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Accelerate your engineering career with real-time algorithm visualizers, production-grade OS kernel sandboxes, deep DBMS internals, and personalized FAANG mock interview simulations.
          </p>

          {/* Dual Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
            <Link
              to={user ? "/learn" : "/register"}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:brightness-105 text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-purple-500/25 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span>🚀 Start Placement Track Free</span>
              <span className="text-cyan-200 font-mono text-xs">→</span>
            </Link>

            <a
              href="#terminal-playground"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-600 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 shadow-md shadow-slate-100 active:scale-95 transition-all"
            >
              <span>⚡ Explore Live Interactive IDE</span>
            </a>
          </div>

          {/* Telemetry Proof Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-8 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2.5 text-slate-600 font-mono text-xs">
              <span className="text-emerald-500 text-base">✓</span>
              <span><strong className="text-slate-900 text-sm">45,000+</strong> Offers Cracked</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-slate-600 font-mono text-xs">
              <span className="text-amber-500 text-base">★</span>
              <span><strong className="text-slate-900 text-sm">4.9/5</strong> Rating from FAANG Devs</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-slate-600 font-mono text-xs">
              <span className="text-purple-600 text-base">⚡</span>
              <span><strong className="text-slate-900 text-sm">Zero Setup</strong> Cloud Kernels</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. 3D HOLOGRAPHIC DIAGNOSTIC & METRIC CARDS ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Tutor Real-Time */}
          <div className="bg-white/95 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/90 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-purple-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-700 font-semibold">
                  Neural Diagnostic
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold">
                99.2% ACCURACY
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">AI Tutor 2.0 (Real-Time Debugger)</h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Autonomous execution stack analyzing memory leaks, asymptotic efficiency, and logic boundaries instantly.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
              <span className="text-[11px]">&gt;_ Explaining AVL Tree Rotations...</span>
              <span className="text-purple-400">🤖</span>
            </div>
          </div>

          {/* Card 2: FAANG Placement Readiness */}
          <div className="bg-white/95 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/90 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-purple-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-semibold">
                  Target Readiness
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-bold">
                TOP 1.2% NATIONWIDE
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">FAANG Placement Engine</h2>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600">
                94.8%
              </span>
              <span className="text-xs font-mono text-slate-500">Readiness Score</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Recent offers:</span>
              <span className="text-slate-900 font-semibold">Google L4</span> •
              <span className="text-slate-900 font-semibold">Meta E4</span> •
              <span className="text-slate-900 font-semibold">Stripe L3</span>
            </div>
          </div>

          {/* Card 3: OS Concurrency Visualizer */}
          <div className="bg-white/95 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/90 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-purple-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                  Kernel Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                POSIX Threads
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Concurrency & OS Visualizer</h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Interactive race condition detector, deadlock graphing, and dirty-page cache inspection in live WASM sandbox.
            </p>
            <div className="flex items-center justify-between text-xs font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mutex Guard Active
              </span>
              <span className="text-slate-200">Thread #4 Acquired</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. INTERACTIVE CODE PLAYGROUND & AI SANDBOX ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="terminal-playground">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-purple-600 font-mono text-xs uppercase tracking-wider font-semibold mb-2">
              <span>💻 Cloud Execution Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Next-Gen Interactive IDE & AI Diagnostic</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-500">Kernel Engine:</span>
            <span className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 font-mono text-xs text-purple-700 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Ubuntu 24.04 (v6.8-LTS Cloud)
            </span>
          </div>
        </div>

        {/* Main IDE Frame - High Contrast Developer Aesthetic */}
        <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Code Editor Pane (8 Cols) */}
          <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-[#070a12]">
            {/* Editor Tabs Header */}
            <div className="flex items-center justify-between bg-[#0f1422] border-b border-slate-800 px-4 py-2">
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
                        ? "bg-[#182035] text-cyan-300 border border-cyan-500/40 shadow-sm"
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
            <div className="p-3.5 bg-[#0f1422] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:brightness-110 text-white font-mono font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
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
                  className="px-3 py-1.5 rounded-lg bg-[#182035] hover:bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>📊 Visualize Call Stack</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Time: <span className="text-cyan-400 font-semibold">0.04ms</span></span>
                <span>Memory: <span className="text-purple-400 font-semibold">12.4 MB</span></span>
              </div>
            </div>

            {/* Output Display */}
            {codeOutput && (
              <div className="p-4 bg-[#05070d] border-t border-purple-900/30 text-xs font-mono">
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
          <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-[#0f1422]">
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
              <div className="p-3.5 rounded-xl bg-[#070a12] border border-purple-500/30 mb-4">
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
                <div className="p-2.5 rounded-lg bg-[#182035] border border-slate-800 flex items-start gap-2">
                  <span className="text-cyan-400 text-xs mt-0.5">✓</span>
                  <div className="font-mono text-xs">
                    <div className="text-white font-medium">Zero Cache Misses</div>
                    <div className="text-slate-400 text-[11px]">Continuous memory alignment in stack frame.</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#182035] border border-slate-800 flex items-start gap-2">
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
                  className="w-full pl-3 pr-16 py-2 text-xs font-mono rounded-lg bg-[#070a12] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
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
          <span className="font-mono text-xs text-purple-600 tracking-widest uppercase font-bold">
            FOUNDATIONAL SYLLABUS MATRIX
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Master Four Core Engineering Pillars</h2>
          <p className="text-sm text-slate-600">
            Surgically crafted curriculum mapped directly against actual FAANG, quant hedge fund, and unicorn engineering assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track 1: DSA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-lg shadow-slate-100 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:border-purple-300 transition-colors text-2xl">
                  🌲
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                1. Data Structures & Algorithms
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Dynamic Programming on Trees, Segment Trees, Disjoint Set Union (DSU), Max-Flow Graph Kernels, and NP-Complete reduction heuristics.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  250+ Problems
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Graph Theory
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Monotonic Queues
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>Hiring:</span>
                <span className="text-slate-900 font-semibold">Google</span> • <span className="text-slate-900 font-semibold">Amazon</span> • <span className="text-slate-900 font-semibold">Uber</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>

          {/* Track 2: DBMS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-cyan-300 shadow-lg shadow-slate-100 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center border border-cyan-100 group-hover:border-cyan-300 transition-colors text-2xl">
                  🗄️
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                2. Database Management Systems
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Deep dive into B+ Tree page layouts, WAL write-ahead logs, 2-Phase Locking, Distributed Multi-Version Concurrency (MVCC), and Sharded PostgreSQL.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  ACID Internals
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  LSM Trees
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Query Planner Cost
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>Hiring:</span>
                <span className="text-slate-900 font-semibold">Snowflake</span> • <span className="text-slate-900 font-semibold">Stripe</span> • <span className="text-slate-900 font-semibold">Oracle</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-cyan-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>

          {/* Track 3: Operating Systems */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-lg shadow-slate-100 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:border-indigo-300 transition-colors text-2xl">
                  ⚡
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                3. Operating Systems & Low-Level
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Build simple UNIX schedulers, manage virtual memory page tables (TLB), trace POSIX signals, and write lock-free ring buffers in C and Rust.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Kernel Drivers
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  epoll / kqueue
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Memory Virtualization
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>Hiring:</span>
                <span className="text-slate-900 font-semibold">Apple</span> • <span className="text-slate-900 font-semibold">Nvidia</span> • <span className="text-slate-900 font-semibold">Microsoft</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                Explore Track →
              </Link>
            </div>
          </div>

          {/* Track 4: System Design */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-lg shadow-slate-100 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:border-emerald-300 transition-colors text-2xl">
                  🌐
                </div>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                  HARDCORE / PLACEMENT READY
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                4. System Design & Distributed Networks
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Architect hyper-scale services: Raft consensus protocols, consistent hashing rings, idempotency keys, and multi-region Kafka ingestion pipelines.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Raft Consensus
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Rate Limiters
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-50 font-mono text-[11px] text-slate-700 border border-slate-200">
                  Distributed Tracing
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>Hiring:</span>
                <span className="text-slate-900 font-semibold">Meta</span> • <span className="text-slate-900 font-semibold">Netflix</span> • <span className="text-slate-900 font-semibold">Palantir</span>
              </div>
              <Link to="/learn" className="font-mono text-xs text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
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
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg shadow-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-purple-600 font-mono text-xs uppercase font-bold tracking-wider">
                🤖 24/7 Contextual CS AI Tutor
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Viva & Concept Explanations</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
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
                      ? "bg-purple-50/70 border-purple-300 text-purple-900 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="text-[10px] text-purple-600 font-bold mb-1">{item.tag}</div>
                  <div className="font-semibold text-slate-900">{item.q}</div>
                </button>
              ))}
            </div>

            {/* Answer Display */}
            <div className="p-4 rounded-xl bg-slate-900 text-xs text-slate-200 leading-relaxed font-mono">
              <div className="flex items-center gap-2 text-cyan-300 font-bold mb-2">
                <span>AI Tutor Response</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                  Zero Hallucination Mode
                </span>
              </div>
              <p>{demoTutorQuestions[activeTutorIndex].a}</p>
            </div>
          </div>

          {/* Right: Live Interactive Diagnostic Assessment Quiz */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg shadow-slate-100" id="diagnostic-preview">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-600 font-mono text-xs uppercase font-bold tracking-wider">
                🎯 Live Skill Assessment Demo
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                Level: Mid-Senior
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Topic Diagnostic Check</h3>
            <p className="text-xs text-slate-600 mb-6">
              Test your foundational knowledge. Our diagnostic engine pinpoints sub-topic vulnerabilities automatically.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div className="text-xs font-semibold text-slate-800 mb-4">
                {sampleDiagnostic.question}
              </div>

              <div className="space-y-2.5">
                {sampleDiagnostic.options.map((opt) => {
                  const isSelected = selectedQuizOption === opt.id;
                  let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-purple-300";

                  if (quizSubmitted) {
                    if (opt.isCorrect) {
                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold";
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = "bg-rose-50 border-rose-400 text-rose-800";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-purple-50 border-purple-500 text-purple-900";
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
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {quizSubmitted && opt.isCorrect && (
                        <span className="text-emerald-600 font-bold">✓ Correct</span>
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-105 text-white font-mono text-xs font-semibold disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-purple-500/20"
                >
                  Submit Diagnostic Answer
                </button>
              ) : (
                <div className="w-full">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-mono text-purple-900 mb-3">
                    <span className="text-purple-700 font-bold">Diagnostic Insight: </span>
                    {sampleDiagnostic.explanation}
                  </div>
                  <Link
                    to="/assessment"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-mono text-xs font-bold"
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
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
            {/* Profile Badge */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-md shadow-purple-500/20">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-bold text-xl text-purple-600 font-mono">
                    AM
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold font-mono">
                  #42
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">Alex Mercer</h4>
                  <span className="font-mono text-xs text-purple-600">@alex_dev</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  Targeting: Staff Systems Engineer • Global Placement Percentile: 98.8%
                </p>
              </div>
            </div>

            {/* Unlocked Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs flex items-center gap-1.5">
                ✨ DP Sorcerer
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs flex items-center gap-1.5">
                ⚡ Kernel Hacker
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs flex items-center gap-1.5">
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
                  <span className="text-sm font-semibold text-slate-900 font-mono">Total Solved</span>
                  <span className="font-mono font-bold text-lg text-purple-600">
                    412 <span className="text-xs text-slate-400 font-normal">/ 500</span>
                  </span>
                </div>
                {/* Progress Stack */}
                <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden mb-4 border border-slate-200">
                  <div className="bg-emerald-500 h-full" style={{ width: "25%" }} title="Easy: 88" />
                  <div className="bg-amber-500 h-full" style={{ width: "50%" }} title="Medium: 214" />
                  <div className="bg-rose-500 h-full" style={{ width: "25%" }} title="Hard: 110" />
                </div>
                {/* Difficulty Stats Details */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Easy
                    </span>
                    <span className="text-slate-900 font-semibold">88 / 100</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium
                    </span>
                    <span className="text-slate-900 font-semibold">214 / 250</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Hard (FAANG Target)
                    </span>
                    <span className="text-slate-900 font-semibold">110 / 150</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-mono text-slate-500">
                <span>Global Rating: <strong className="text-purple-600 font-bold">2,410</strong></span>
                <span>Top 0.8% Worldwide</span>
              </div>
            </div>

            {/* Heatmap Matrix */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-900 font-mono">Daily Solve Consistency Matrix</span>
                  <span className="font-mono text-xs text-purple-600">365 Days Active</span>
                </div>
                {/* Clean Glowing Heatmap Matrix Grid */}
                <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {Array.from({ length: 196 }).map((_, i) => {
                    const intensity = (i * 17) % 5;
                    let colorClass = "bg-slate-200";
                    if (intensity === 1) colorClass = "bg-purple-200";
                    if (intensity === 2) colorClass = "bg-purple-400";
                    if (intensity === 3) colorClass = "bg-purple-600";
                    if (intensity === 4) colorClass = "bg-indigo-600";
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
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mt-3">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-slate-200" />
                  <span className="w-2 h-2 rounded-sm bg-purple-200" />
                  <span className="w-2 h-2 rounded-sm bg-purple-400" />
                  <span className="w-2 h-2 rounded-sm bg-purple-600" />
                  <span className="w-2 h-2 rounded-sm bg-indigo-600" />
                </div>
                <span>More (12 Solves / Day)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. ENTERPRISE & ALUMNI ENDORSEMENTS ─── */}
      <section className="py-12 border-y border-slate-200 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-8">
            Engineers at top tech powerhouses prepare and evaluate with LearnX
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 font-mono text-sm sm:text-base font-bold text-slate-600">
            <span className="hover:text-purple-600 transition-colors">GOOGLE</span>
            <span className="hover:text-purple-600 transition-colors">META</span>
            <span className="hover:text-purple-600 transition-colors">AMAZON</span>
            <span className="hover:text-purple-600 transition-colors">APPLE</span>
            <span className="hover:text-purple-600 transition-colors">MICROSOFT</span>
            <span className="hover:text-purple-600 transition-colors">NETFLIX</span>
            <span className="hover:text-purple-600 transition-colors">PALANTIR</span>
            <span className="hover:text-purple-600 transition-colors">SNOWFLAKE</span>
          </div>
        </div>
      </section>

      {/* ─── 9. CALL TO ACTION BANNER ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-tr from-purple-700 via-indigo-700 to-cyan-600 p-10 sm:p-14 rounded-3xl shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Accelerate Your Placement Journey?
            </h2>
            <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto mb-8">
              Join thousands of students and engineers mastering core computer science and landing dream engineering roles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-purple-700 font-bold text-sm shadow-lg hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
              >
                {user ? "Open Your Dashboard →" : "Get Started Free Today →"}
              </Link>
              <Link
                to="/learn"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-900/60 border border-purple-300/40 text-white hover:bg-purple-900/80 font-semibold text-sm transition-all"
              >
                Browse All 4 Tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. CLEAN LIGHT FOOTER ─── */}
      <footer className="bg-slate-50 border-t border-slate-200 font-mono text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">LearnX</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-purple-700 font-semibold">Neural Node Online</span>
            </div>
            <p className="text-slate-500">
              © 2026 LearnX AI Platform. All nodes operational (99.98% uptime).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-600 font-medium">
            <a href="#tracks" className="hover:text-purple-600 transition-colors">Curriculum Matrix</a>
            <Link to="/assessment" className="hover:text-purple-600 transition-colors">Diagnostic Engine</Link>
            <Link to="/tutor" className="hover:text-purple-600 transition-colors">AI Mentor</Link>
            <Link to="/learn" className="hover:text-purple-600 transition-colors">Tracks</Link>
            <a href="#leaderboard-stats" className="hover:text-purple-600 transition-colors">System Telemetry</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
