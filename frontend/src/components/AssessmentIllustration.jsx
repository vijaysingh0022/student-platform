import React from "react";

export const AssessmentIllustration = () => {
  return (
    <div className="relative w-full max-w-[260px] sm:max-w-[280px] h-[210px] flex items-center justify-center select-none pointer-events-none">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/30 to-pink-500/10 rounded-full blur-2xl" />
      
      {/* 3D Isometric Composition SVG */}
      <svg
        viewBox="0 0 320 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="laptopScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1e38" />
            <stop offset="100%" stopColor="#0d0d1e" />
          </linearGradient>
          <linearGradient id="laptopBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="book1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="book2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.3" floodColor="#000" />
          </filter>
        </defs>

        {/* --- Books Stack on Left --- */}
        <g transform="translate(25, 140)">
          {/* Bottom Book */}
          <path d="M10 35 L70 18 L70 30 L10 47 Z" fill="#0369a1" />
          <path d="M10 47 L70 30 L75 32 L15 49 Z" fill="#e2e8f0" />
          <path d="M10 35 L15 37 L75 20 L70 18 Z" fill="#38bdf8" />
          {/* Top Book */}
          <path d="M14 20 L68 6 L68 17 L14 31 Z" fill="#4338ca" />
          <path d="M14 31 L68 17 L72 19 L18 33 Z" fill="#f8fafc" />
          <path d="M14 20 L18 22 L72 8 L68 6 Z" fill="#6366f1" />
          {/* Tiny Plant Pot */}
          <path d="M36 6 L48 6 L45 18 L39 18 Z" fill="#38bdf8" />
          <circle cx="42" cy="0" r="7" fill="#34d399" />
          <circle cx="37" cy="-4" r="5" fill="#10b981" />
          <circle cx="47" cy="-3" r="5" fill="#059669" />
        </g>

        {/* --- Central Laptop --- */}
        {/* Laptop Base/Keyboard */}
        <g transform="translate(100, 110)">
          {/* Laptop Base (Isometric slant) */}
          <path
            d="M30 75 L125 50 L165 72 L70 98 Z"
            fill="url(#laptopBodyGrad)"
            filter="url(#shadowFilter)"
          />
          {/* Trackpad */}
          <path d="M85 78 L105 73 L112 79 L92 84 Z" fill="#4f46e5" opacity="0.6" />

          {/* Laptop Screen (Upright isometric) */}
          <path
            d="M30 75 L125 50 L125 -10 L30 15 Z"
            fill="#1e1b4b"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Screen Display */}
          <path
            d="M36 70 L119 48 L119 -4 L36 18 Z"
            fill="url(#laptopScreenGrad)"
          />

          {/* Screen Content: Assessment UI Preview */}
          {/* Checkbox item 1 */}
          <circle cx="50" cy="27" r="3.5" fill="#10b981" />
          <path d="M48 27 L50 29 L53 25" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          <rect x="58" y="24" width="40" height="4.5" rx="2" fill="#818cf8" opacity="0.8" transform="skewY(-15)" />

          {/* Checkbox item 2 */}
          <circle cx="54" cy="40" r="3.5" fill="#10b981" />
          <path d="M52 40 L54 42 L57 38" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          <rect x="62" y="37" width="34" height="4.5" rx="2" fill="#818cf8" opacity="0.8" transform="skewY(-15)" />

          {/* Checkbox item 3 */}
          <circle cx="58" cy="53" r="3.5" fill="#38bdf8" />
          <rect x="66" y="50" width="30" height="4.5" rx="2" fill="#818cf8" opacity="0.8" transform="skewY(-15)" />
        </g>

        {/* --- Test Paper / Checklist on Foreground Right --- */}
        <g transform="translate(195, 125)">
          {/* Paper Sheet */}
          <path
            d="M10 25 L55 0 L85 45 L40 70 Z"
            fill="url(#sheetGrad)"
            filter="url(#shadowFilter)"
          />
          {/* Paper Header / Test Title */}
          <text
            x="28"
            y="26"
            fill="#4338ca"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="1"
            transform="rotate(-28 28 26)"
          >
            TEST
          </text>
          {/* Checkmarks & Lines on paper */}
          <path d="M25 40 L28 43 L34 37" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="36" x2="58" y2="26" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <path d="M33 52 L36 55 L42 49" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="48" x2="66" y2="38" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

          {/* Pen / Stylus */}
          <path d="M60 62 L85 28 L90 31 L65 65 Z" fill="#6366f1" />
          <path d="M57 65 L60 62 L65 65 Z" fill="#fbbf24" />
        </g>

        {/* --- 3D Graduation Cap Floating Above Laptop --- */}
        <g transform="translate(180, 20)">
          {/* Cap Crown / Skullcap */}
          <path d="M22 45 Q45 60 68 45 L64 35 Q45 46 26 35 Z" fill="#4338ca" />
          {/* Cap Diamond Top */}
          <path
            d="M45 10 L85 28 L45 46 L5 28 Z"
            fill="url(#capGrad)"
            stroke="#a5b4fc"
            strokeWidth="1.2"
            filter="url(#shadowFilter)"
          />
          {/* Cap Center Button */}
          <ellipse cx="45" cy="28" rx="4" ry="2.5" fill="url(#goldGrad)" />
          {/* Gold Tassel */}
          <path
            d="M45 28 Q65 32 72 45 L74 58"
            stroke="url(#goldGrad)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="74" cy="60" r="3" fill="#f59e0b" />
        </g>
      </svg>
    </div>
  );
};

export default AssessmentIllustration;
