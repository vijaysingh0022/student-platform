import React from "react";

export const PYQIntelligenceIllustration = ({ className = "w-full max-w-[280px] h-[190px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-blue-400/20 blur-2xl" />

      {/* SVG Canvas for 3D Isometric Papers & AI Neural Scanning */}
      <svg
        viewBox="0 0 340 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="paperGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <linearGradient id="paperGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aiOrb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Base Ellipse Shadow */}
        <ellipse cx="170" cy="195" rx="120" ry="22" fill="#0f172a" fillOpacity="0.3" filter="blur(4px)" />

        {/* Paper 1: Background Left Isometric */}
        <g transform="translate(60, 50)">
          <polygon
            points="30,20 110,5 140,55 60,70"
            fill="url(#paperGrad2)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <line x1="50" y1="28" x2="100" y2="19" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="38" x2="115" y2="28" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="48" x2="110" y2="40" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Paper 2: Background Right Isometric */}
        <g transform="translate(130, 40)">
          <polygon
            points="40,25 120,12 150,65 70,78"
            fill="url(#paperGrad2)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <line x1="60" y1="35" x2="110" y2="27" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          <line x1="65" y1="45" x2="125" y2="37" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Main Foreground Question Paper (Isometric AKTU Exam Sheet) */}
        <g transform="translate(95, 65)">
          <polygon
            points="35,15 145,5 175,95 65,105"
            fill="url(#paperGrad1)"
            stroke="#94a3b8"
            strokeWidth="1.8"
          />
          {/* Header Lines */}
          <line x1="58" y1="26" x2="125" y2="20" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="34" x2="105" y2="30" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />

          {/* Question Rows */}
          <circle cx="68" cy="48" r="2.5" fill="#a855f7" />
          <line x1="75" y1="47" x2="140" y2="41" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          <circle cx="72" cy="62" r="2.5" fill="#6366f1" />
          <line x1="80" y1="61" x2="145" y2="55" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="69" x2="135" y2="64" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

          <circle cx="77" cy="82" r="2.5" fill="#06b6d4" />
          <line x1="85" y1="81" x2="150" y2="75" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* Stamp / Verified Badge */}
          <g transform="translate(130, 68) rotate(-10)">
            <rect x="0" y="0" width="28" height="15" rx="3" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.2" />
            <text x="5" y="11" fill="#059669" fontSize="7" fontWeight="bold">PYQ</text>
          </g>
        </g>

        {/* AI Laser Scanning Beam Sweeping across paper */}
        <polygon
          points="80,105 240,88 238,98 78,115"
          fill="url(#scanBeam)"
          opacity="0.8"
        />

        {/* AI Intelligence Core Crystal / Floating Node */}
        <g transform="translate(225, 45)">
          <circle cx="25" cy="25" r="22" fill="url(#aiOrb)" filter="drop-shadow(0 4px 12px rgba(129, 140, 248, 0.5))" />
          {/* Inner Brain / AI Neural Icon */}
          <path
            d="M18 20C18 17.5 20.5 15.5 23.5 15.5C25.5 15.5 27 16.5 28 17.5C29 16.5 30.5 15.5 32.5 15.5C35.5 15.5 38 17.5 38 20C38 23.5 35 26.5 32.5 28.5L28 32.5L23.5 28.5C21 26.5 18 23.5 18 20Z"
            fill="#ffffff"
            fillOpacity="0.2"
          />
          <circle cx="28" cy="22" r="3.5" fill="#ffffff" />
          <circle cx="21" cy="26" r="2.5" fill="#e0e7ff" />
          <circle cx="35" cy="26" r="2.5" fill="#e0e7ff" />
          <line x1="28" y1="22" x2="21" y2="26" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="28" y1="22" x2="35" y2="26" stroke="#ffffff" strokeWidth="1.5" />
        </g>

        {/* Floating Metrics Pill: 98% Match */}
        <g transform="translate(35, 120)">
          <rect x="0" y="0" width="75" height="24" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.06))" />
          <circle cx="12" cy="12" r="4" fill="#10b981" />
          <text x="22" y="16" fill="#0f172a" fontSize="9" fontWeight="800">Repeated 4x</text>
        </g>

        {/* Floating Metrics Pill: Unit 3 Priority */}
        <g transform="translate(210, 145)">
          <rect x="0" y="0" width="85" height="24" rx="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.06))" />
          <circle cx="12" cy="12" r="4" fill="#6366f1" />
          <text x="22" y="16" fill="#0f172a" fontSize="9" fontWeight="800">Unit 3 • 28 Marks</text>
        </g>
      </svg>
    </div>
  );
};

export default PYQIntelligenceIllustration;

