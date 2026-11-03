import React from "react";

export const CodingLabIllustration = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[200px] flex items-center justify-center select-none pointer-events-none">
      {/* Dynamic ambient backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/35 to-cyan-500/20 rounded-full blur-2xl transform -translate-y-2" />

      {/* Modern Developer Isometric & Neon Composition SVG */}
      <svg
        viewBox="0 0 340 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="neonPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="deskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Background Floating Code Card (Back Left) --- */}
        <g transform="translate(40, 25)">
          <rect
            x="0"
            y="0"
            width="80"
            height="55"
            rx="8"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.2"
            opacity="0.85"
            filter="url(#softGlow)"
          />
          {/* Header dots */}
          <circle cx="10" cy="10" r="2.5" fill="#f43f5e" />
          <circle cx="18" cy="10" r="2.5" fill="#fbbf24" />
          <circle cx="26" cy="10" r="2.5" fill="#10b981" />
          {/* Code lines */}
          <rect x="10" y="20" width="30" height="3" rx="1.5" fill="#38bdf8" />
          <rect x="10" y="28" width="45" height="3" rx="1.5" fill="#818cf8" />
          <rect x="18" y="36" width="35" height="3" rx="1.5" fill="#c084fc" />
          <rect x="18" y="44" width="22" height="3" rx="1.5" fill="#34d399" />
        </g>

        {/* --- Floating Neon UI Hologram (Back Right) --- */}
        <g transform="translate(240, 30)">
          <rect
            x="0"
            y="0"
            width="70"
            height="50"
            rx="8"
            fill="#1e1b4b"
            stroke="#c084fc"
            strokeWidth="1.2"
            opacity="0.8"
          />
          <path d="M10 20 L22 32 L34 20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <rect x="40" y="22" width="20" height="4" rx="2" fill="#a78bfa" />
          <rect x="10" y="38" width="50" height="3" rx="1.5" fill="#6366f1" />
        </g>

        {/* --- Desk Top Surface --- */}
        <path
          d="M15 195 L325 195 L310 215 L30 215 Z"
          fill="url(#deskGrad)"
          stroke="#312e81"
          strokeWidth="1.5"
        />

        {/* --- Books & Potted Succulent Plant on Left Desk --- */}
        <g transform="translate(35, 145)">
          {/* Book 1 */}
          <rect x="0" y="32" width="45" height="9" rx="2" fill="#3b82f6" />
          <rect x="2" y="34" width="40" height="2" fill="#93c5fd" opacity="0.6" />
          {/* Book 2 */}
          <rect x="4" y="22" width="38" height="9" rx="2" fill="#8b5cf6" />
          {/* Little Plant Pot */}
          <path d="M14 8 L30 8 L27 21 L17 21 Z" fill="#6366f1" />
          <path d="M22 8 Q22 0 16 -2 Q20 5 22 8" fill="#10b981" />
          <path d="M22 8 Q24 -2 29 -1 Q25 4 22 8" fill="#34d399" />
          <path d="M22 8 Q22 -5 22 -7 Q22 2 22 8" fill="#059669" />
        </g>

        {/* --- Central Glowing Laptop --- */}
        <g transform="translate(100, 105)">
          {/* Laptop Base */}
          <path d="M10 82 L120 82 L128 89 L2 89 Z" fill="#334155" />
          <rect x="50" y="83" width="30" height="3" rx="1.5" fill="#64748b" />

          {/* Laptop Screen Open */}
          <rect
            x="15"
            y="5"
            width="100"
            height="74"
            rx="5"
            fill="#090d16"
            stroke="#38bdf8"
            strokeWidth="2"
            filter="url(#softGlow)"
          />
          {/* Inside Screen Gradient */}
          <rect x="18" y="8" width="94" height="68" rx="3" fill="url(#screenGlow)" />

          {/* Glowing Code Symbol </> on Screen */}
          <text
            x="65"
            y="48"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="26"
            fontFamily="monospace"
            fontWeight="bold"
            filter="url(#softGlow)"
          >
            &lt;/&gt;
          </text>
        </g>

        {/* --- Student Programmer Character (With Headphones & Hoodie) --- */}
        <g transform="translate(185, 75)">
          {/* Body / Hoodie */}
          <path
            d="M20 70 C10 60, -5 85, -15 120 L55 120 C45 90, 35 60, 20 70 Z"
            fill="url(#hoodieGrad)"
            stroke="#4338ca"
            strokeWidth="1.5"
          />

          {/* Arm resting toward laptop */}
          <path
            d="M-5 95 C-20 100, -35 110, -50 115 L-40 120 C-25 115, -10 105, 5 105 Z"
            fill="#2e1065"
          />
          {/* Hand typing */}
          <ellipse cx="-48" cy="116" rx="6" ry="4" fill="#fed7aa" />

          {/* Neck */}
          <rect x="14" y="52" width="12" height="15" rx="3" fill="#fed7aa" />

          {/* Head & Face (tilted toward screen with focused smile) */}
          <ellipse cx="20" cy="40" rx="17" ry="18" fill="url(#faceGrad)" />
          {/* Eyes focused on code */}
          <ellipse cx="14" cy="38" rx="2" ry="2.5" fill="#1e1b4b" />
          <ellipse cx="23" cy="38" rx="2" ry="2.5" fill="#1e1b4b" />
          <circle cx="13.5" cy="37" r="0.8" fill="#ffffff" />
          <circle cx="22.5" cy="37" r="0.8" fill="#ffffff" />
          {/* Smile */}
          <path d="M16 46 Q20 50 24 46" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Modern Hair */}
          <path
            d="M4 35 C3 20, 15 15, 24 15 C33 15, 39 24, 38 35 C33 26, 25 22, 18 24 C10 26, 6 32, 4 35 Z"
            fill="url(#hairGrad)"
          />
          <path d="M5 32 C12 28, 20 28, 26 30" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />

          {/* Cyan Glowing Headphones */}
          <path
            d="M3 38 C-2 30, 2 12, 20 12 C38 12, 42 30, 37 38"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#softGlow)"
          />
          {/* Ear cup left */}
          <ellipse cx="4" cy="38" rx="4" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Ear cup right */}
          <ellipse cx="36" cy="38" rx="4" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

export default CodingLabIllustration;
