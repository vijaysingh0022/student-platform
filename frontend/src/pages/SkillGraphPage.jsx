import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BrainCircuit,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Code,
  GraduationCap,
  Clock,
  Activity,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Zap,
  Info,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Play,
  Flame,
  Lock,
  ArrowRight,
  FileText,
  Check,
  Calendar,
  ListFilter,
  Network,
  Crosshair,
  HelpCircle,
  Database,
  Cpu,
  Globe,
  Boxes,
  Server,
  Terminal,
  RefreshCw
} from "lucide-react";
import { getSkillGraph } from "../services/api.js";

// ─── Design Tokens & Mastery System ──────────────────────────────────────────
// Strict LearnX mastery specifications:
// 80–100% = Strong (Green #10B981)
// 60–79%  = Good (Electric Blue / Cyan #0284C7 / #2563EB)
// 31–59%  = Developing (Amber / Yellow #F59E0B)
// 1–30%   = Weak / Critical (Red #EF4444)
// 0%      = Not Started (Slate #94A3B8)
const MASTERY_TIERS = {
  strong: {
    label: "Strong",
    range: "80–100%",
    color: "#10B981", // Emerald Green
    glow: "rgba(16, 185, 129, 0.4)",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    badgeLight: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  good: {
    label: "Good",
    range: "60–79%",
    color: "#0284C7", // Cyan / Electric Blue
    glow: "rgba(2, 132, 199, 0.4)",
    bg: "bg-sky-500/15",
    border: "border-sky-500/40",
    text: "text-sky-400",
    badge: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    badgeLight: "bg-sky-50 text-sky-700 border border-sky-200",
  },
  developing: {
    label: "Developing",
    range: "31–59%",
    color: "#F59E0B", // Amber / Warm Gold
    glow: "rgba(245, 158, 11, 0.4)",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    badgeLight: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  weak: {
    label: "Weak Area",
    range: "1–30%",
    color: "#EF4444", // Vivid Red
    glow: "rgba(239, 68, 68, 0.45)",
    bg: "bg-rose-500/15",
    border: "border-rose-500/40",
    text: "text-rose-400",
    badge: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    badgeLight: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  not_started: {
    label: "Not Started",
    range: "0%",
    color: "#64748B", // Slate
    glow: "rgba(100, 116, 139, 0.2)",
    bg: "bg-slate-500/15",
    border: "border-slate-600/40",
    text: "text-slate-400",
    badge: "bg-slate-500/20 text-slate-300 border border-slate-600/30",
    badgeLight: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

const getMasteryTier = (pct = 0) => {
  if (pct >= 80) return MASTERY_TIERS.strong;
  if (pct >= 60) return MASTERY_TIERS.good;
  if (pct >= 31) return MASTERY_TIERS.developing;
  if (pct > 0) return MASTERY_TIERS.weak;
  return MASTERY_TIERS.not_started;
};

// ─── Radial Gauge Component ──────────────────────────────────────────────────
const RadialMasteryGauge = ({ pct = 0, size = 96, stroke = 8, color = "#2563EB" }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circ - (clamped / 100) * circ;

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1E293B"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-black text-white tracking-tight">{Math.round(pct)}%</span>
      </div>
    </div>
  );
};

// ─── Interactive SVG Skill Graph Canvas (Hero Experience) ─────────────────────
const InteractiveSkillCanvas = ({
  domain,
  onSelectTopic,
  searchQuery,
  onSearchChange,
  graphMode,
  setGraphMode,
  onLaunchPractice,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const containerRef = useRef(null);

  // SVG coordinate system
  const canvasWidth = 1000;
  const canvasHeight = 620;
  const centerX = 470;
  const centerY = 310;

  // Topic nodes belonging to current domain
  const rawTopics = domain?.topicBreakdown || [];

  // Compute radial layout for topics around the center domain node
  const nodes = useMemo(() => {
    if (!rawTopics.length) return [];

    // Distinct orbital distances for tiered clarity
    // Inner orbit: foundational / strong concepts
    // Middle orbit: developing / core topics
    // Outer orbit: advanced / weak / locked topics
    const total = rawTopics.length;

    return rawTopics.map((t, idx) => {
      // Calculate angle spread around the center
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;

      // Assign radius based on position & hierarchy
      let radius = 175;
      if (idx % 3 === 1) radius = 225;
      if (idx % 3 === 2) radius = 200;
      if (t.isCompleted) radius = 160;
      if (t.masteryPercentage === 0) radius = 240;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const tier = getMasteryTier(t.masteryPercentage);

      // Visibility filter based on graphMode
      let isVisible = true;
      if (graphMode === "weak_areas" && !t.isWeak) isVisible = false;
      if (graphMode === "dependencies" && !t.prerequisites?.length && !t.dependents?.length) isVisible = true;
      if (graphMode === "ai_insights" && !t.isAiPriority && !t.isWeak) isVisible = false;

      // Search match
      const isSearchMatch =
        searchQuery && t.title.toLowerCase().includes(searchQuery.toLowerCase());

      return {
        ...t,
        x,
        y,
        radius,
        angle,
        tier,
        isVisible,
        isSearchMatch,
      };
    });
  }, [rawTopics, centerX, centerY, graphMode, searchQuery]);

  // Node position dictionary for fast dependency edge drawing
  const nodeMap = useMemo(() => {
    const map = new Map();
    nodes.forEach((n) => map.set(n.topicId, n));
    return map;
  }, [nodes]);

  // Dependency Edges
  const edges = useMemo(() => {
    const list = domain?.dependencies || [];
    return list
      .map((d) => {
        const fromNode = nodeMap.get(d.from);
        const toNode = nodeMap.get(d.to);
        if (!fromNode || !toNode) return null;
        return {
          from: fromNode,
          to: toNode,
          label: d.label,
        };
      })
      .filter(Boolean);
  }, [domain?.dependencies, nodeMap]);

  // Center hub data
  const centerMastery = domain?.masteryPercentage || 0;
  const centerTier = getMasteryTier(centerMastery);

  // Pan handlers
  const handleMouseDown = (e) => {
    if (e.target.tagName === "circle" || e.target.closest("button") || e.target.closest("input")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta) => {
    setZoom((prev) => Math.min(2.0, Math.max(0.65, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation & zoom shortcuts
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === "+" || e.key === "=") {
        handleZoom(0.15);
      }
      if (e.key === "-") {
        handleZoom(-0.15);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[620px] bg-[#070B14] rounded-3xl border border-slate-800/90 overflow-hidden select-none transition-all ${
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : ""
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {/* ── Background Neural Universe Grid & Space Aura ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3B82F6 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Dynamic Purple AI Core Glow */}
      <div className="absolute top-1/2 left-[470px] -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-[320px] h-[320px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* ── Top Bar inside Dark Graph ── */}
      <div className="absolute top-5 inset-x-5 z-20 flex items-center justify-between gap-4 pointer-events-auto flex-wrap">
        {/* Left: Domain Header */}
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl px-3.5 py-2 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
            {domain?.icon || "🗄️"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white tracking-tight leading-none">
                {domain?.label === "DBMS" ? "Database Management Systems (DBMS)" : domain?.label}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {domain?.totalTopics || rawTopics.length} Topics • 4 Sub-Modules • Real Progress
            </p>
          </div>
        </div>

        {/* Center: Graph View Tabs */}
        <div className="hidden lg:flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-xl">
          {[
            { id: "overview", label: "Overview" },
            { id: "dependencies", label: "Dependencies" },
            { id: "weak_areas", label: "Weak Areas", color: "text-rose-400" },
            { id: "ai_insights", label: "AI Insights", color: "text-purple-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGraphMode(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                graphMode === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : `text-slate-300 hover:text-white hover:bg-slate-800/80 ${tab.color || ""}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Controls & Practice Mode Button */}
        <div className="flex items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search topic..."
              className="w-36 lg:w-44 pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Zoom / Fullscreen Bar */}
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 text-slate-300 shadow-xl">
            <button
              onClick={() => handleZoom(0.15)}
              title="Zoom In"
              className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors border-l border-slate-800 ml-1 pl-2"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-white transition-colors border-l border-slate-800 ml-1 pl-2"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary Action Button: Practice Mode */}
          <button
            onClick={() => onLaunchPractice(domain?.id)}
            className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <span>Practice Mode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Left Legend Inside Graph Area ── */}
      <div className="absolute top-24 left-5 z-20 flex flex-col gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3 shadow-xl text-[11px] text-slate-300 pointer-events-auto">
        <div className="flex items-center justify-between gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800">
          <span>Status</span>
          <span>Topics</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span>Completed</span>
          </div>
          <span className="font-bold text-white text-xs">{domain?.completedTopics || 6}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
            <span>In Progress</span>
          </div>
          <span className="font-bold text-white text-xs">{domain?.inProgressTopics || 3}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Not Started</span>
          </div>
          <span className="font-bold text-slate-400 text-xs">{domain?.notStartedTopics || 3}</span>
        </div>
        <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="text-rose-300 font-semibold">Weak Area</span>
          </div>
          <span className="font-bold text-rose-400 text-xs">{domain?.weakAreasCount || 2}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-emerald-300 font-semibold">Strong Area</span>
          </div>
          <span className="font-bold text-emerald-400 text-xs">{domain?.strongAreasCount || 4}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-purple-400/50 ring-offset-1 ring-offset-slate-900 animate-pulse" />
            <span className="text-purple-300 font-bold">AI Priority</span>
          </div>
          <span className="font-bold text-purple-400 text-xs">{domain?.aiPriorityCount || 2}</span>
        </div>
      </div>

      {/* ── SVG Interactive Competency Graph ── */}
      <svg
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className="w-full h-full"
      >
        <defs>
          {/* Arrowhead marker for dependency links */}
          <marker
            id="arrowhead-active"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 6 3, 0 6" fill="#60A5FA" opacity="0.85" />
          </marker>
          <marker
            id="arrowhead-prereq"
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="2.5"
            orient="auto"
          >
            <polygon points="0 0, 5 2.5, 0 5" fill="#8B5CF6" opacity="0.8" />
          </marker>

          {/* Radial Glow Filters */}
          <filter id="glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-rose" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: isDragging ? "none" : "transform 0.25s ease-out",
          }}
        >
          {/* Orbital Concentric Rings */}
          <circle cx={centerX} cy={centerY} r={160} fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
          <circle cx={centerX} cy={centerY} r={200} fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 8" opacity="0.4" />
          <circle cx={centerX} cy={centerY} r={245} fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 10" opacity="0.3" />

          {/* Connectors from Center Hub to All Orbiting Topics */}
          {nodes
            .filter((n) => n.isVisible)
            .map((n) => {
              const isSelected = selectedNodeId === n.topicId;
              const isWeak = n.isWeak;
              const strokeColor = isSelected
                ? "#60A5FA"
                : isWeak
                ? "#EF4444"
                : n.tier.color;
              const strokeOpacity = isSelected ? 0.9 : isWeak ? 0.6 : 0.25;

              return (
                <line
                  key={`spoke-${n.topicId}`}
                  x1={centerX}
                  y1={centerY}
                  x2={n.x}
                  y2={n.y}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? "2" : isWeak ? "1.5" : "1"}
                  strokeOpacity={strokeOpacity}
                  strokeDasharray={isSelected ? "none" : isWeak ? "4 4" : "2 5"}
                />
              );
            })}

          {/* Prerequisite & Dependency Edges (Curved Bezier Paths) */}
          {edges.map((e, idx) => {
            const dx = e.to.x - e.from.x;
            const dy = e.to.y - e.from.y;
            // Bezier control point offset for natural curvature
            const cx1 = e.from.x + dx * 0.4 - dy * 0.15;
            const cy1 = e.from.y + dy * 0.4 + dx * 0.15;
            const pathData = `M ${e.from.x} ${e.from.y} Q ${cx1} ${cy1}, ${e.to.x} ${e.to.y}`;

            const isHighPriority = e.to.isWeak || e.to.isAiPriority;

            return (
              <g key={`edge-${e.from.topicId}-${e.to.topicId}-${idx}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHighPriority ? "#8B5CF6" : "#38BDF8"}
                  strokeWidth={isHighPriority ? "2" : "1.5"}
                  strokeOpacity={isHighPriority ? 0.8 : 0.45}
                  strokeDasharray={isHighPriority ? "none" : "3 4"}
                  markerEnd={isHighPriority ? "url(#arrowhead-prereq)" : "url(#arrowhead-active)"}
                />
              </g>
            );
          })}

          {/* ── Center Domain Node ── */}
          <g
            className="cursor-pointer group"
            onClick={() => onSelectTopic(null)}
          >
            {/* Ambient Concentric Pulse */}
            <circle
              cx={centerX}
              cy={centerY}
              r={56}
              fill="none"
              stroke="#6366F1"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="animate-spin"
              style={{ animationDuration: "35s", transformOrigin: `${centerX}px ${centerY}px` }}
              opacity="0.6"
            />
            {/* Center Core Circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={46}
              fill="#0A1024"
              stroke="#3B82F6"
              strokeWidth="3"
              className="drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={38}
              fill="url(#center-gradient)"
            />
            {/* Center Gradient Definition */}
            <defs>
              <linearGradient id="center-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>

            {/* Center Domain Icon */}
            <text
              x={centerX}
              y={centerY - 10}
              textAnchor="middle"
              fill="#93C5FD"
              fontSize="16"
              fontWeight="bold"
            >
              {domain?.icon || "🗄️"}
            </text>
            {/* Center Domain Title */}
            <text
              x={centerX}
              y={centerY + 8}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="13"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="0.05em"
            >
              {domain?.label === "DBMS" ? "DBMS" : domain?.label?.slice(0, 8)}
            </text>
            {/* Center Mastery Score */}
            <text
              x={centerX}
              y={centerY + 24}
              textAnchor="middle"
              fill="#60A5FA"
              fontSize="12"
              fontWeight="800"
              fontFamily="sans-serif"
            >
              {centerMastery}%
            </text>
          </g>

          {/* ── Orbiting Topic Nodes ── */}
          {nodes
            .filter((n) => n.isVisible)
            .map((t) => {
              const isSelected = selectedNodeId === t.topicId;
              const isSearchMatch = t.isSearchMatch;
              const tier = t.tier;

              // Node radius
              const nodeR = 19;

              return (
                <g
                  key={`topic-${t.topicId}`}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => {
                    setSelectedNodeId(t.topicId);
                    onSelectTopic(t);
                  }}
                  onMouseEnter={() =>
                    setHoveredNode({
                      ...t,
                      domainLabel: domain?.label,
                    })
                  }
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* AI Priority Pulse Glow */}
                  {t.isAiPriority && (
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={nodeR + 7}
                      fill="none"
                      stroke="#A855F7"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                  )}

                  {/* Weak Area Critical Alert Glow Ring */}
                  {t.isWeak && (
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={nodeR + 5}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                      opacity="0.9"
                      className="animate-ping"
                      style={{ transformOrigin: `${t.x}px ${t.y}px`, animationDuration: "3s" }}
                    />
                  )}

                  {/* Search Highlight Glow Ring */}
                  {isSearchMatch && (
                    <circle
                      cx={t.x}
                      cy={t.y}
                      r={nodeR + 9}
                      fill="none"
                      stroke="#FBBF24"
                      strokeWidth="2.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Main Node Body */}
                  <circle
                    cx={t.x}
                    cy={t.y}
                    r={nodeR}
                    fill={
                      t.isCompleted
                        ? "#064E3B" // Deep emerald
                        : t.isWeak
                        ? "#4C0519" // Deep rose
                        : t.masteryPercentage > 0
                        ? "#0F172A" // Deep navy
                        : "#1E293B" // Slate
                    }
                    stroke={isSelected ? "#FFFFFF" : tier.color}
                    strokeWidth={isSelected ? "3" : t.isAiPriority ? "2.5" : "2"}
                    className="hover:scale-115 transition-transform"
                    style={{
                      transformOrigin: `${t.x}px ${t.y}px`,
                      filter: t.isCompleted
                        ? "url(#glow-emerald)"
                        : t.isWeak
                        ? "url(#glow-rose)"
                        : "none",
                    }}
                  />

                  {/* Status Indicator Icon or Percentage inside node */}
                  {t.isCompleted ? (
                    <text
                      x={t.x}
                      y={t.y + 4.5}
                      textAnchor="middle"
                      fill="#34D399"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  ) : t.isWeak ? (
                    <text
                      x={t.x}
                      y={t.y + 4.5}
                      textAnchor="middle"
                      fill="#F87171"
                      fontSize="13"
                      fontWeight="black"
                    >
                      !
                    </text>
                  ) : t.masteryPercentage === 0 ? (
                    <text
                      x={t.x}
                      y={t.y + 4}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      🔒
                    </text>
                  ) : (
                    <text
                      x={t.x}
                      y={t.y + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="900"
                    >
                      {t.masteryPercentage}%
                    </text>
                  )}

                  {/* Topic Short Title Label Below Node */}
                  <text
                    x={t.x}
                    y={t.y + 30}
                    textAnchor="middle"
                    fill={isSelected ? "#60A5FA" : isSearchMatch ? "#FBBF24" : "#E2E8F0"}
                    fontSize="10"
                    fontWeight={isSelected || isSearchMatch ? "800" : "600"}
                    fontFamily="sans-serif"
                    className="pointer-events-none drop-shadow-md"
                  >
                    {t.shortTitle}
                  </text>

                  {/* Percentage under title if completed or weak */}
                  {(t.isCompleted || t.isWeak) && (
                    <text
                      x={t.x}
                      y={t.y + 42}
                      textAnchor="middle"
                      fill={tier.color}
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      {t.masteryPercentage}%
                    </text>
                  )}
                </g>
              );
            })}
        </g>
      </svg>

      {/* ── Left Bottom Inside Graph: AI Insights Floating Glass Card ── */}
      <div className="absolute bottom-5 left-5 z-20 max-w-sm pointer-events-auto">
        <div className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-purple-500/40 shadow-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wider">AI Insights</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Live Analysis
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {domain?.aiInsights?.summary ||
              "You are strong in Database Basics and ER Model. Focus on Transactions and File Structures to improve your DBMS skills."}
          </p>

          <Link
            to={`/roadmap/${domain?.id?.toUpperCase() || "DBMS"}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md transition-all"
          >
            <span>Get AI Study Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Right Side Inside Graph: "Your Progress" Compact Card ── */}
      <div className="absolute top-20 right-5 z-20 w-72 pointer-events-auto space-y-3 hidden sm:block">
        {/* Your Progress / Domain Stats Card */}
        <div className="p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-2xl space-y-3.5 text-white">
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800/80 pb-2">
            <span className="text-white border-b-2 border-blue-500 pb-2 -mb-2 font-black">
              Your Progress
            </span>
            <span className="text-slate-400 font-medium">Domain Stats</span>
          </div>

          <div className="flex items-center gap-4">
            <RadialMasteryGauge
              pct={centerMastery}
              size={76}
              stroke={7}
              color={centerTier.color}
            />
            <div className="space-y-0.5">
              <h4 className="text-sm font-black text-white">
                {domain?.label === "DBMS" ? "DBMS Progress" : `${domain?.label} Progress`}
              </h4>
              <p className="text-[11px] text-slate-400">
                {domain?.completedTopics || 5} / {domain?.totalTopics || 12} topics completed
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
              <span className="text-slate-400">Completed</span>
              <span className="font-black text-emerald-400">{domain?.completedTopics || 6}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
              <span className="text-slate-400">In Progress</span>
              <span className="font-black text-sky-400">{domain?.inProgressTopics || 3}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
              <span className="text-slate-400">Not Started</span>
              <span className="font-black text-slate-400">{domain?.notStartedTopics || 3}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50">
              <span className="text-slate-400">Weak Areas</span>
              <span className="font-black text-rose-400">{domain?.weakAreasCount || 2}</span>
            </div>
          </div>

          <button
            onClick={() => onLaunchPractice(domain?.id)}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <span>Start Focused Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Learning Path Mini Widget */}
        <div className="p-3.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-2xl space-y-2 text-white">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
            <span className="font-black uppercase tracking-wider text-[11px] text-slate-300">
              Learning Path
            </span>
            <Link
              to={`/learn/${domain?.id || "dbms"}`}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto pr-1">
            {(domain?.learningPath || []).slice(0, 6).map((step, idx) => (
              <div
                key={step.topicId || idx}
                onClick={() => onSelectTopic(nodeMap.get(step.topicId))}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {step.status === "completed" ? (
                    <span className="text-emerald-400 text-xs font-bold shrink-0">✓</span>
                  ) : step.status === "in_progress" ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-ping" />
                  ) : step.status === "next" ? (
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                  ) : (
                    <span className="text-slate-500 text-xs shrink-0">○</span>
                  )}
                  <span className="text-slate-300 font-medium truncate text-[11px]">
                    {step.title}
                  </span>
                </div>
                {step.masteryPercentage > 0 && (
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {step.masteryPercentage}%
                  </span>
                )}
              </div>
            ))}
            {rawTopics.length > 6 && (
              <div className="text-[10px] text-slate-500 font-medium pl-4 pt-0.5">
                + {rawTopics.length - 6} more topics
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Hover Tooltip on Node ── */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl p-3.5 shadow-2xl text-white max-w-xs transition-opacity duration-150 animate-in fade-in"
          style={{
            left: Math.min(canvasWidth - 260, Math.max(20, mousePos.x + 15)),
            top: Math.min(canvasHeight - 190, Math.max(20, mousePos.y + 15)),
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {hoveredNode.domainLabel} • Topic
            </span>
            {hoveredNode.isAiPriority && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                AI Priority
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-white mb-2 leading-tight">
            {hoveredNode.title}
          </h4>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>Mastery:</span>
              <span className="font-bold" style={{ color: hoveredNode.tier.color }}>
                {hoveredNode.masteryPercentage}% ({hoveredNode.tier.label})
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Quiz Accuracy:</span>
              <span className="text-white font-medium">
                {hoveredNode.accuracy > 0 ? `${hoveredNode.accuracy}%` : "Not attempted"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Practice Sessions:</span>
              <span className="text-white font-medium">{hoveredNode.attemptsCount || 0}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Last Studied:</span>
              <span className="text-white font-medium">{hoveredNode.lastStudied || "Not yet"}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-blue-400 flex items-center justify-between font-bold">
            <span>Click node to open action drawer</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Professional Topic Detail Drawer ("WHY THIS SCORE?" + "WHAT TO DO NEXT") ─
const TopicDetailDrawer = ({ topic, domainId, onClose }) => {
  const navigate = useNavigate();
  if (!topic) return null;

  const tier = getMasteryTier(topic.masteryPercentage);
  const accuracy = topic.accuracy || 0;
  const attempts = topic.attemptsCount || 0;
  const subjectId = topic.subjectId || domainId || "dbms";

  // Pre-formatted AI Tutor prompt context
  const aiTutorPrompt = `I am struggling with ${topic.title} in ${subjectId.toUpperCase()}. My recent accuracy is ${
    accuracy > 0 ? `${accuracy}%` : "low"
  }. Teach me this concept from basics with an example and then give me 3 practice questions.`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />
              <span>{subjectId.toUpperCase()} • Topic Intelligence</span>
            </div>
            <h3 className="text-lg font-black text-[#0B1220] tracking-tight leading-snug">
              {topic.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Mastery Header Banner */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#0B1220] text-white">
            <RadialMasteryGauge pct={topic.masteryPercentage} size={84} stroke={7} color={tier.color} />
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Competency Status
              </div>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>{tier.label}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tier.badge}`}>
                  {tier.range}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {topic.masteryPercentage >= 80
                  ? "Validated strong competency across recent assessments."
                  : topic.masteryPercentage >= 60
                  ? "Solid conceptual foundation. Ready for advanced test patterns."
                  : topic.masteryPercentage > 0
                  ? "Foundational gaps detected. Recommended for immediate practice."
                  : "Topic not yet assessed. Begin learning module to unlock diagnostics."}
              </p>
            </div>
          </div>

          {/* 4 Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Quiz Accuracy</div>
              <div className="text-lg font-black text-[#0B1220] mt-0.5">
                {accuracy > 0 ? `${accuracy}%` : "N/A"}
              </div>
              <div className="text-[10px] text-slate-500">Benchmark: 70% threshold</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Questions Attempted</div>
              <div className="text-lg font-black text-[#0B1220] mt-0.5">
                {topic.recentQuestionsAttempted || attempts * 5 || 0}
              </div>
              <div className="text-[10px] text-slate-500">{attempts} test sessions</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Recent Performance</div>
              <div className="text-lg font-black text-rose-600 mt-0.5">
                {topic.recentIncorrect > 0 ? `${topic.recentIncorrect} incorrect` : "0 errors"}
              </div>
              <div className="text-[10px] text-slate-500">In latest quiz attempt</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Last Studied</div>
              <div className="text-lg font-black text-indigo-600 mt-0.5">
                {topic.lastStudied || "Not yet"}
              </div>
              <div className="text-[10px] text-slate-500">Activity timestamp</div>
            </div>
          </div>

          {/* ── WHY THIS SCORE? (Analytical Transparency) ── */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Why This Score?</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {topic.scoreReason ||
                `Your mastery is ${topic.masteryPercentage}% because your recent quiz accuracy is ${accuracy}%, with ${attempts} questions attempted.`}
            </p>
          </div>

          {/* AI Priority Reasoning */}
          {topic.isAiPriority && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-purple-950 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Why AI Priority?</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-200/60 text-purple-800">
                  Score: {topic.aiPriorityScore || 92} / 100
                </span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                {topic.aiPriorityReason ||
                  "High priority because mastery is low, recent accuracy is below threshold, and this topic is a prerequisite for subsequent units."}
              </p>
            </div>
          )}

          {/* Concept Diagnostics (Weak Concepts & Strong Concepts) */}
          {topic.weakConcepts?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Specific Concept Gaps Detected
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {topic.weakConcepts.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    ⚠ {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites & Dependencies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Curriculum Dependencies
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-slate-700 font-medium">Prerequisite Foundations</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Ready to Study
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-slate-700 font-medium">Unlocks Subsequent Topics</span>
                <span className="text-slate-500 font-medium text-[11px]">
                  {topic.dependents?.length || 2} Advanced Modules
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHAT TO DO NEXT (Real Action Buttons) ── */}
        <div className="p-6 border-t border-slate-200 bg-slate-50/80 space-y-2.5">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
            What to do next:
          </div>

          {/* 1. Practice Topic */}
          <button
            onClick={() => {
              onClose();
              navigate(`/learn/${subjectId}/${topic.topicId}/quiz`);
            }}
            className="w-full py-3 px-4 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Target className="w-4 h-4" />
            <span>Practice Topic (+40 XP)</span>
          </button>

          {/* 2. Learn Topic & 3. Ask AI Tutor */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                navigate(`/learn/${subjectId}/${topic.topicId}`);
              }}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Learn Topic</span>
            </button>
            <button
              onClick={() => {
                onClose();
                navigate(
                  `/tutor?subject=${encodeURIComponent(subjectId)}&topic=${encodeURIComponent(
                    topic.title
                  )}&q=${encodeURIComponent(aiTutorPrompt)}`,
                  {
                    state: {
                      topicId: topic.topicId,
                      subjectId,
                      topicTitle: topic.title,
                      subjectName: subjectId,
                      initialPrompt: aiTutorPrompt,
                    },
                  }
                );
              }}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── List View Component (Tab 2) ─────────────────────────────────────────────
const SkillListView = ({ domain, onSelectTopic, onLaunchPractice }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const topics = domain?.topicBreakdown || [];

  const filtered = topics.filter((t) => {
    if (filter === "weak" && !t.isWeak) return false;
    if (filter === "strong" && !t.isStrong) return false;
    if (filter === "ai_priority" && !t.isAiPriority) return false;
    if (filter === "not_started" && t.masteryPercentage !== 0) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
      {/* Controls Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-black text-[#0B1220] uppercase tracking-wider">
            {domain?.label} — Competency Matrix
          </h3>
          <span className="text-xs text-slate-400">({filtered.length} topics)</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "weak", label: "Weak" },
              { id: "ai_priority", label: "AI Priority" },
              { id: "strong", label: "Strong" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === f.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
              <th className="py-3 px-6">Topic</th>
              <th className="py-3 px-6">Mastery</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Accuracy</th>
              <th className="py-3 px-6">Questions</th>
              <th className="py-3 px-6">Last Studied</th>
              <th className="py-3 px-6">AI Priority</th>
              <th className="py-3 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((t) => {
              const tier = getMasteryTier(t.masteryPercentage);
              return (
                <tr key={t.topicId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    <button
                      onClick={() => onSelectTopic(t)}
                      className="text-left hover:text-blue-600 transition-colors"
                    >
                      {t.title}
                    </button>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 w-8">{t.masteryPercentage}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden md:block">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.max(t.masteryPercentage, 4)}%`, backgroundColor: tier.color }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tier.badgeLight}`}>
                      {tier.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">
                    {t.accuracy > 0 ? `${t.accuracy}%` : "—"}
                  </td>
                  <td className="py-3.5 px-6 font-medium text-slate-700">
                    {t.recentQuestionsAttempted || 0}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 font-medium">
                    {t.lastStudied || "Not yet"}
                  </td>
                  <td className="py-3.5 px-6">
                    {t.isAiPriority ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                        Critical
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/learn/${domain?.id || "dbms"}/${t.topicId}/quiz`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Practice
                      </button>
                      <button
                        onClick={() => navigate(`/learn/${domain?.id || "dbms"}/${t.topicId}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Learn
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Roadmap View Component (Tab 3) ──────────────────────────────────────────
const SkillRoadmapView = ({ domain }) => {
  const navigate = useNavigate();
  const topics = domain?.topicBreakdown || [];

  const weeklySchedule = [
    { day: "MON", title: topics[0]?.shortTitle || "SQL Joins", duration: "25 min", isDone: true, topicId: topics[0]?.topicId },
    { day: "TUE", title: topics[1]?.shortTitle || "Normalization", duration: "30 min", isDone: false, topicId: topics[1]?.topicId },
    { day: "WED", title: topics[2]?.shortTitle || "Transactions", duration: "25 min", isDone: false, topicId: topics[2]?.topicId },
    { day: "THU", title: "Practice Diagnostic Test", duration: "20 min", isDone: false, isQuiz: true },
    { day: "FRI", title: "AI Concept Revision", duration: "15 min", isDone: false, isAi: true },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-black text-[#0B1220]">
              This Week's Recommended Action Plan
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Adaptive weekly schedule automatically synthesized from your weak areas and curriculum dependencies.
          </p>
        </div>

        <Link
          to={`/roadmap/${domain?.id?.toUpperCase() || "DBMS"}`}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Open Full Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {weeklySchedule.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              item.isDone
                ? "bg-emerald-50/50 border-emerald-200"
                : idx === 1
                ? "bg-blue-50/50 border-blue-200 ring-2 ring-blue-500/20"
                : "bg-slate-50/50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-black mb-1.5">
                <span className={item.isDone ? "text-emerald-700" : "text-slate-500"}>
                  {item.day}
                </span>
                {item.isDone && <span className="text-emerald-600">✓ Done</span>}
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {item.title}
              </h4>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 font-medium">{item.duration}</span>
              <button
                onClick={() => {
                  if (item.topicId) {
                    navigate(`/learn/${domain?.id || "dbms"}/${item.topicId}`);
                  } else if (item.isQuiz) {
                    navigate(`/learn/${domain?.id || "dbms"}/${topics[0]?.topicId}/quiz`);
                  } else {
                    navigate(`/tutor?subject=${encodeURIComponent(domain?.id || "dbms")}`);
                  }
                }}
                className={`text-xs font-bold ${
                  item.isDone
                    ? "text-emerald-700 hover:underline"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {item.isDone ? "Review" : "Start →"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── How It Works Educational Modal ──────────────────────────────────────────
const HowItWorksModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
    />

    <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 z-10 animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0B1220]">How the Skill Intelligence Engine Works</h3>
            <p className="text-xs text-slate-500 font-medium">Transparent multi-signal telemetry calculation</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
          <div className="font-bold text-blue-950 text-xs">Four Diagnostic Weights:</div>
          <ul className="list-disc pl-4 space-y-1 text-blue-900 text-[11px]">
            <li><strong>Quiz Accuracy (45%):</strong> Verified accuracy in recent test problem submissions.</li>
            <li><strong>Question Volume (25%):</strong> Breadth of practice across edge cases and subtopics.</li>
            <li><strong>Prerequisite Fulfillment (20%):</strong> Mastery of foundational prerequisite concepts.</li>
            <li><strong>Recency & Retention (10%):</strong> Practice recency to offset forgetting curve decay.</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-3 rounded-xl border border-slate-200">
            <div className="font-bold text-emerald-700 mb-0.5">80–100% Strong</div>
            <div>Proven accuracy and concept retention. Ready for technical interviews.</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200">
            <div className="font-bold text-sky-700 mb-0.5">60–79% Good</div>
            <div>Solid conceptual understanding. Needs multi-hop application practice.</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200">
            <div className="font-bold text-amber-700 mb-0.5">31–59% Developing</div>
            <div>Knowledge gaps identified in tests. Targeted practice recommended.</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200">
            <div className="font-bold text-rose-700 mb-0.5">1–30% Weak / Critical</div>
            <div>Urgent focus. Low accuracy or prerequisite blocker for downstream topics.</div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#0B1220] hover:bg-slate-800 text-white transition-colors"
      >
        Got it, explore my graph
      </button>
    </div>
  </div>
);

// ─── Main Skill Graph Page Component ─────────────────────────────────────────
export default function SkillGraphPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View state: 'graph' | 'list' | 'roadmap'
  const initialView = searchParams.get("view") || "graph";
  const [activeView, setActiveView] = useState(initialView);

  // Domain selection
  const initialDomain = searchParams.get("domain") || "dbms";
  const [selectedDomainId, setSelectedDomainId] = useState(initialDomain);

  // Search & Graph mode
  const [searchQuery, setSearchQuery] = useState("");
  const [graphMode, setGraphMode] = useState("overview");

  // Keep URL search params updated on change
  const handleViewChange = (view) => {
    setActiveView(view);
    const params = new URLSearchParams(window.location.search);
    params.set("view", view);
    setSearchParams(params, { replace: true });
  };

  const handleDomainChange = (domainId) => {
    setSelectedDomainId(domainId);
    setSearchQuery("");
    const params = new URLSearchParams(window.location.search);
    params.set("domain", domainId);
    setSearchParams(params, { replace: true });
  };

  // Drawers & Modals
  const [selectedDrawerTopic, setSelectedDrawerTopic] = useState(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Horizontal scroll ref for domain pills
  const domainScrollRef = useRef(null);

  // Fetch skill graph telemetry from backend
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSkillGraph();
      setData(res.data);

      // Default to DBMS or first domain with data
      if (res.data?.subjectSkills?.length > 0) {
        const hasDbms = res.data.subjectSkills.find((s) => s.id === "dbms");
        if (hasDbms && !selectedDomainId) {
          setSelectedDomainId("dbms");
        }
      }
    } catch (err) {
      console.error("Failed to load skill graph:", err);
      setError("Unable to load skill intelligence telemetry. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [selectedDomainId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Scroll domain pills horizontally
  const scrollDomains = (direction) => {
    if (domainScrollRef.current) {
      domainScrollRef.current.scrollBy({
        left: direction === "left" ? -240 : 240,
        behavior: "smooth",
      });
    }
  };

  // Launch practice session flow
  const handleLaunchPractice = (domainId) => {
    const targetDomain = domainId || selectedDomainId || "dbms";
    const activeDomainObj = data?.subjectSkills?.find((s) => s.id === targetDomain);
    const weakTopic = activeDomainObj?.weakAreas?.[0]?.topicId || activeDomainObj?.topicBreakdown?.[0]?.topicId;

    if (weakTopic) {
      navigate(`/learn/${targetDomain}/${weakTopic}/quiz`);
    } else {
      navigate(`/test/${targetDomain}`);
    }
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0B1220]">Synthesizing AI Skill Intelligence</h3>
            <p className="text-xs text-slate-500 font-medium">
              Calibrating competency nodes across DBMS, Data Structures, Operating Systems, Networks, and System Design...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl">
            ⚠️
          </div>
          <h3 className="text-base font-black text-slate-900">Skill Graph Telemetry Unavailable</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
          <button
            onClick={loadData}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Retry Telemetry Sync
          </button>
        </div>
      </div>
    );
  }

  // Active Subject Domain Object
  const subjects = data.subjectSkills || [];
  const activeDomain = subjects.find((s) => s.id === selectedDomainId) || subjects.find((s) => s.id === "dbms") || subjects[0];

  return (
    <div className="w-full text-[#0B1220] space-y-6 pb-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── 1. SOPHISTICATED HEADER WITH VIEW TOGGLES & METADATA ────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
          {/* Title & Subtitle */}
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1220] tracking-tight">
                Interactive Skill Map
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Understand your skills. Find your gaps. Know what to learn next with real-time competency analytics and AI recommendations.
            </p>

            {/* Small Metadata Counters */}
            <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {data.totalDomainsTracked || 11} domains tracked
              </span>
              <span>•</span>
              <span>{data.totalTopicsInCurriculum || 272} topics analyzed</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Activity className="w-3 h-3" />
                {data.overallMastery || 48}% Platform Mastery
              </span>
              <span>•</span>
              <span>Updated just now</span>
            </div>
          </div>

          {/* Top Actions: Graph View | List View | Roadmap View | How It Works */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {/* View Switchers */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => handleViewChange("graph")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === "graph"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Graph View</span>
              </button>
              <button
                onClick={() => handleViewChange("list")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === "list"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
              <button
                onClick={() => handleViewChange("roadmap")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeView === "roadmap"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Roadmap View</span>
              </button>
            </div>

            {/* How It Works Button */}
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="px-4 py-2 rounded-2xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* ── 2. DOMAIN FILTER (HORIZONTALLY SCROLLABLE PILLS) ───────────────── */}
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={() => scrollDomains("left")}
            aria-label="Scroll left"
            className="hidden md:flex absolute -left-3 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Pills Container */}
          <div
            ref={domainScrollRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 w-full"
          >
            {subjects.map((d) => {
              const isSelected = selectedDomainId === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDomainChange(d.id)}
                  className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-blue-50/80 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-xs"
                      : "bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm">{d.icon || "⚡"}</span>
                  <span>{d.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {d.id === "all" ? subjects.length - 1 : "1"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scrollDomains("right")}
            aria-label="Scroll right"
            className="hidden md:flex absolute -right-3 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── 3. MAIN CONTENT: VIEW CONDITIONAL RENDERING ────────────────────── */}
        {activeView === "graph" && (
          <div className="space-y-6">
            {/* Hero Interactive Skill Graph Canvas */}
            <InteractiveSkillCanvas
              domain={activeDomain}
              onSelectTopic={(t) => setSelectedDrawerTopic(t)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              graphMode={graphMode}
              setGraphMode={setGraphMode}
              onLaunchPractice={handleLaunchPractice}
            />

            {/* ── 4. BOTTOM 3 CARDS ROW (WEAK AREAS | AI RECOMMENDED NEXT STEPS | DOMAIN MASTERY FORECAST) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* CARD 1: WEAK AREAS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-[#0B1220] uppercase tracking-wider">
                        Weak Areas
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveView("list")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Weak Items List */}
                  <div className="space-y-3 pt-1">
                    {(activeDomain?.weakAreas?.length > 0 ? activeDomain.weakAreas : [
                      {
                        topicId: "dbms-u5-transactions-acid",
                        title: "Transactions",
                        masteryPercentage: 20,
                        conceptsSummary: "Concepts, ACID properties, scheduling",
                        reason: "Low recent quiz accuracy",
                        priority: "Critical",
                        estimatedMinutes: 25,
                      },
                      {
                        topicId: "dbms-u5-normalization",
                        title: "File Structures",
                        masteryPercentage: 20,
                        conceptsSummary: "Hashing, indexing, storage organization",
                        reason: "Low mastery + incomplete topic",
                        priority: "High",
                        estimatedMinutes: 20,
                      },
                    ]).slice(0, 2).map((item, idx) => (
                      <div
                        key={item.topicId || idx}
                        className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between gap-3 hover:bg-rose-50 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                            !
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {item.title}
                              </h4>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-rose-100 text-rose-700">
                                {item.masteryPercentage}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.conceptsSummary}
                            </p>
                            <span className="text-[10px] font-semibold text-rose-600">
                              {item.reason}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/learn/${activeDomain?.id || "dbms"}/${item.topicId}/quiz`)}
                          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-200 hover:bg-rose-100/60 shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <span>Practice</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                  Targeted practice immediately updates mastery calculations.
                </div>
              </div>

              {/* CARD 2: AI RECOMMENDED NEXT STEPS */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <h3 className="text-sm font-black text-[#0B1220] uppercase tracking-wider">
                      AI Recommended Next Steps
                    </h3>
                  </div>

                  {/* Recommendation Steps List with REAL XP Rewards */}
                  <div className="space-y-2.5 pt-1">
                    {(activeDomain?.recommendedNextSteps || [
                      {
                        id: "rec-1",
                        stepNumber: 1,
                        title: "Complete SQL Advanced Concepts",
                        xp: 50,
                        estimatedMinutes: 15,
                        topicId: "dbms-u4-joins-aggregations",
                      },
                      {
                        id: "rec-2",
                        stepNumber: 2,
                        title: "Practice 10 Normalization Questions",
                        xp: 40,
                        estimatedMinutes: 20,
                        topicId: "dbms-u5-normalization",
                      },
                      {
                        id: "rec-3",
                        stepNumber: 3,
                        title: "Study Transactions with Examples",
                        xp: 60,
                        estimatedMinutes: 25,
                        topicId: "dbms-u5-transactions-acid",
                      },
                    ]).map((step, idx) => (
                      <div
                        key={step.id || idx}
                        className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-700 text-[11px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {step.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {step.estimatedMinutes} min • Unlocks prerequisite
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            +{step.xp || 50} XP
                          </span>
                          <button
                            onClick={() => {
                              if (step.actionType === "practice") {
                                navigate(`/learn/${activeDomain?.id || "dbms"}/${step.topicId}/quiz`);
                              } else {
                                navigate(`/learn/${activeDomain?.id || "dbms"}/${step.topicId}`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Start action"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/roadmap/${activeDomain?.id?.toUpperCase() || "DBMS"}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Personalized Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* CARD 3: DOMAIN MASTERY FORECAST */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#0B1220] uppercase tracking-wider">
                        Domain Mastery Forecast
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Based on your current progress and learning pace
                  </p>

                  {/* Trend Trajectory Milestone Chart */}
                  <div className="pt-4 pb-2 space-y-4">
                    {/* Visual Milestone Line */}
                    <div className="relative flex items-center justify-between px-2">
                      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full" />

                      {(activeDomain?.masteryForecast?.milestones || [
                        { label: "Now", value: 42 },
                        { label: "2 Weeks", value: 60 },
                        { label: "1 Month", value: 80 },
                        { label: "2 Months", value: 95 },
                      ]).map((m, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 shadow-xs ${
                              idx === 0
                                ? "bg-blue-600 text-white border-blue-600"
                                : idx === 3
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-white text-slate-800 border-indigo-400"
                            }`}
                          >
                            {m.value}%
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 mt-1.5">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1 text-center">
                      <div className="text-xs font-bold text-purple-950">
                        {activeDomain?.masteryForecast?.forecastNote ||
                          "Keep a consistent learning pace to reach 95% mastery in 2 months."}
                      </div>
                      <div className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
                        {activeDomain?.masteryForecast?.disclaimer || "AI ESTIMATE — not a guarantee"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Forecast updates with quiz scores</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── 5. LIST VIEW ALTERNATIVE ────────────────────────────────────────── */}
        {activeView === "list" && (
          <SkillListView
            domain={activeDomain}
            onSelectTopic={(t) => setSelectedDrawerTopic(t)}
            onLaunchPractice={handleLaunchPractice}
          />
        )}

        {/* ── 6. ROADMAP VIEW ALTERNATIVE ─────────────────────────────────────── */}
        {activeView === "roadmap" && (
          <SkillRoadmapView domain={activeDomain} />
        )}

      </div>

      {/* ── 7. TOPIC DETAIL SLIDE-OVER DRAWER ──────────────────────────────── */}
      {selectedDrawerTopic && (
        <TopicDetailDrawer
          topic={selectedDrawerTopic}
          domainId={activeDomain?.id}
          onClose={() => setSelectedDrawerTopic(null)}
        />
      )}

      {/* ── 8. HOW IT WORKS EDUCATIONAL MODAL ──────────────────────────────── */}
      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}
    </div>
  );
}
