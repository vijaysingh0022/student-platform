import React from "react";

export const SkillAnalyticsIllustration = () => {
  return (
    <div className="relative w-full max-w-[240px] sm:max-w-[260px] h-[160px] flex items-center justify-center select-none pointer-events-none">
      {/* Soft ambient backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/15 via-purple-500/20 to-sky-500/15 rounded-full blur-2xl transform -translate-y-2" />

      {/* 3D Isometric Skills, Practice, Analytics, Roadmap Pyramid Stack SVG */}
      <svg
        viewBox="0 0 280 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl overflow-visible"
      >
        <defs>
          <linearGradient id="aiBrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="layerTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="layerMidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="layerLowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          <linearGradient id="layerBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" floodColor="#000" />
          </filter>
        </defs>

        {/* --- Background Floating Analytics Bar Chart (Left) --- */}
        <g transform="translate(15, 45)">
          <rect x="0" y="0" width="55" height="42" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" opacity="0.85" />
          <rect x="10" y="24" width="6" height="12" rx="1.5" fill="#38bdf8" />
          <rect x="20" y="16" width="6" height="20" rx="1.5" fill="#818cf8" />
          <rect x="30" y="10" width="6" height="26" rx="1.5" fill="#c084fc" />
          <rect x="40" y="18" width="6" height="18" rx="1.5" fill="#34d399" />
        </g>

        {/* --- Small Plant Pot (Far Left Bottom) --- */}
        <g transform="translate(30, 125)">
          <path d="M6 10 L18 10 L16 22 L8 22 Z" fill="#6366f1" />
          <circle cx="12" cy="6" r="5" fill="#10b981" />
          <circle cx="8" cy="4" r="4" fill="#34d399" />
          <circle cx="16" cy="4" r="4" fill="#059669" />
        </g>

        {/* --- 3D Isometric Stacked Platform (Center-Right) --- */}
        <g transform="translate(85, 20)">
          {/* Top Floating AI Brain */}
          <g transform="translate(55, 0)">
            <ellipse cx="20" cy="18" rx="18" ry="16" fill="url(#aiBrainGrad)" filter="url(#softShadow)" />
            <path d="M12 12 Q20 8 28 12 Q32 18 28 24 Q20 28 12 24 Q8 18 12 12 Z" stroke="#e0e7ff" strokeWidth="1.2" fill="none" opacity="0.6" />
            <text x="20" y="22" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle">AI</text>
            <line x1="20" y1="34" x2="20" y2="44" stroke="#c084fc" strokeWidth="2" strokeDasharray="2 2" />
          </g>

          {/* Layer 1: "Skills" (Top Layer) */}
          <g transform="translate(25, 45)">
            {/* Top Face */}
            <path d="M50 0 L100 15 L50 30 L0 15 Z" fill="url(#layerTopGrad)" />
            {/* Left Face */}
            <path d="M0 15 L50 30 L50 40 L0 25 Z" fill="#3b82f6" />
            {/* Right Face */}
            <path d="M50 30 L100 15 L100 25 L50 40 Z" fill="#2563eb" />
            <text x="50" y="24" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              Skills
            </text>
          </g>

          {/* Layer 2: "Practice" */}
          <g transform="translate(15, 75)">
            <path d="M60 0 L120 18 L60 36 L0 18 Z" fill="url(#layerMidGrad)" />
            <path d="M0 18 L60 36 L60 46 L0 28 Z" fill="#2563eb" />
            <path d="M60 36 L120 18 L120 28 L60 46 Z" fill="#1d4ed8" />
            <text x="60" y="27" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              Practice
            </text>
          </g>

          {/* Layer 3: "Analytics" */}
          <g transform="translate(5, 108)">
            <path d="M70 0 L140 20 L70 40 L0 20 Z" fill="url(#layerLowGrad)" />
            <path d="M0 20 L70 40 L70 50 L0 30 Z" fill="#3730a3" />
            <path d="M70 40 L140 20 L140 30 L70 50 Z" fill="#312e81" />
            <text x="70" y="30" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              Analytics
            </text>
          </g>

          {/* Layer 4: "Roadmap" (Base Layer) */}
          <g transform="translate(-5, 142)">
            <path d="M80 0 L160 22 L80 44 L0 22 Z" fill="url(#layerBaseGrad)" />
            <path d="M0 22 L80 44 L80 54 L0 32 Z" fill="#1e1b4b" />
            <path d="M80 44 L160 22 L160 32 L80 54 Z" fill="#0f172a" />
            <text x="80" y="33" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
              Roadmap
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SkillAnalyticsIllustration;
