import React from "react";

export const InterviewIllustration = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[200px] flex items-center justify-center select-none pointer-events-none">
      {/* Dynamic ambient backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/35 to-blue-500/20 rounded-full blur-2xl transform -translate-y-2" />

      {/* Modern Developer Isometric & AI Interviewer Video Composition SVG */}
      <svg
        viewBox="0 0 340 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="neonBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
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
          <linearGradient id="aiCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0d1117" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Floating AI Interviewer Hologram Window (Back Center-Left) --- */}
        <g transform="translate(105, 18)">
          <rect
            x="0"
            y="0"
            width="120"
            height="85"
            rx="12"
            fill="url(#aiCardGrad)"
            stroke="#6366f1"
            strokeWidth="1.5"
            filter="url(#softGlow)"
          />
          {/* Header Bar */}
          <rect x="0" y="0" width="120" height="20" rx="12" fill="#312e81" opacity="0.6" />
          <circle cx="10" cy="10" r="2.5" fill="#f43f5e" />
          <circle cx="18" cy="10" r="2.5" fill="#fbbf24" />
          <circle cx="26" cy="10" r="2.5" fill="#10b981" />
          <text x="60" y="13" fill="#c7d2fe" fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            AI Interview
          </text>
          <circle cx="108" cy="10" r="2.5" fill="#10b981" />

          {/* AI Robot Interviewer Avatar inside window */}
          <g transform="translate(25, 26)">
            {/* Robot Head */}
            <rect x="0" y="0" width="30" height="26" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1" />
            {/* Robot Screen/Face */}
            <rect x="4" y="4" width="22" height="18" rx="4" fill="#0f172a" />
            {/* Glowing Eyes */}
            <ellipse cx="10" cy="12" rx="2.5" ry="3" fill="#38bdf8" />
            <ellipse cx="20" cy="12" rx="2.5" ry="3" fill="#38bdf8" />
            {/* Antenna */}
            <line x1="15" y1="0" x2="15" y2="-5" stroke="#818cf8" strokeWidth="1.5" />
            <circle cx="15" cy="-6" r="2" fill="#38bdf8" />
            {/* Robot Neck & Body */}
            <path d="M7 26 L23 26 L26 40 L4 40 Z" fill="#c7d2fe" />
          </g>

          {/* Voice Waveform & Speech Bubbles on right of AI */}
          <g transform="translate(65, 32)">
            {/* Dynamic Sound Waves */}
            <line x1="0" y1="12" x2="0" y2="18" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="8" x2="5" y2="22" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="10" y1="4" x2="10" y2="26" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" />
            <line x1="15" y1="9" x2="15" y2="21" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="11" x2="20" y2="19" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="25" y1="13" x2="25" y2="17" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Small Speech Card */}
            <rect x="0" y="30" width="45" height="16" rx="4" fill="#312e81" stroke="#818cf8" strokeWidth="0.8" />
            <line x1="6" y1="36" x2="35" y2="36" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="41" x2="25" y2="41" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* --- Desk Surface --- */}
        <path
          d="M15 195 L325 195 L310 215 L30 215 Z"
          fill="url(#deskGrad)"
          stroke="#312e81"
          strokeWidth="1.5"
        />

        {/* --- Books & Potted Succulent Plant on Left Desk --- */}
        <g transform="translate(45, 145)">
          {/* Books */}
          <rect x="0" y="32" width="45" height="9" rx="2" fill="#3b82f6" />
          <rect x="4" y="22" width="38" height="9" rx="2" fill="#8b5cf6" />
          {/* Plant */}
          <path d="M14 8 L30 8 L27 21 L17 21 Z" fill="#6366f1" />
          <path d="M22 8 Q22 0 16 -2 Q20 5 22 8" fill="#10b981" />
          <path d="M22 8 Q24 -2 29 -1 Q25 4 22 8" fill="#34d399" />
          <path d="M22 8 Q22 -5 22 -7 Q22 2 22 8" fill="#059669" />
        </g>

        {/* --- Central Laptop with 'LX' Logo --- */}
        <g transform="translate(130, 115)">
          {/* Laptop Base */}
          <path d="M10 75 L110 75 L118 82 L2 82 Z" fill="#334155" />

          {/* Laptop Lid Backside Facing Forward */}
          <rect
            x="15"
            y="5"
            width="90"
            height="68"
            rx="6"
            fill="#090d16"
            stroke="#6366f1"
            strokeWidth="1.8"
            filter="url(#softGlow)"
          />
          {/* LX Logo on Lid */}
          <text
            x="60"
            y="45"
            textAnchor="middle"
            fill="#a5b4fc"
            fontSize="20"
            fontFamily="sans-serif"
            fontWeight="900"
            letterSpacing="2"
          >
            LX
          </text>
        </g>

        {/* --- LearnX Coffee Mug --- */}
        <g transform="translate(230, 160)">
          <rect x="0" y="8" width="22" height="25" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M22 14 C27 14, 27 24, 22 24" stroke="#f8fafc" strokeWidth="2.5" fill="none" />
          <text x="11" y="24" textAnchor="middle" fill="#4f46e5" fontSize="7" fontWeight="bold">LX</text>
        </g>

        {/* --- Student Candidate Character (Listening to AI with Headphones) --- */}
        <g transform="translate(210, 75)">
          {/* Body / Hoodie */}
          <path
            d="M20 70 C10 60, -5 85, -15 120 L55 120 C45 90, 35 60, 20 70 Z"
            fill="url(#hoodieGrad)"
            stroke="#4338ca"
            strokeWidth="1.5"
          />

          {/* Arm resting on desk */}
          <path
            d="M-5 95 C-20 100, -35 110, -50 115 L-40 120 C-25 115, -10 105, 5 105 Z"
            fill="#2e1065"
          />
          {/* Hand taking notes / gestures */}
          <ellipse cx="-48" cy="116" rx="6" ry="4" fill="#fed7aa" />

          {/* Neck */}
          <rect x="14" y="52" width="12" height="15" rx="3" fill="#fed7aa" />

          {/* Head & Face */}
          <ellipse cx="20" cy="40" rx="17" ry="18" fill="url(#faceGrad)" />
          {/* Eyes attentive */}
          <ellipse cx="14" cy="38" rx="2" ry="2.5" fill="#1e1b4b" />
          <ellipse cx="23" cy="38" rx="2" ry="2.5" fill="#1e1b4b" />
          <circle cx="13.5" cy="37" r="0.8" fill="#ffffff" />
          <circle cx="22.5" cy="37" r="0.8" fill="#ffffff" />
          {/* Smile */}
          <path d="M16 46 Q20 50 24 46" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Hair */}
          <path
            d="M4 35 C3 20, 15 15, 24 15 C33 15, 39 24, 38 35 C33 26, 25 22, 18 24 C10 26, 6 32, 4 35 Z"
            fill="url(#hairGrad)"
          />

          {/* Cyan Glowing Headphones */}
          <path
            d="M3 38 C-2 30, 2 12, 20 12 C38 12, 42 30, 37 38"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#softGlow)"
          />
          <ellipse cx="4" cy="38" rx="4" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="36" cy="38" rx="4" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

export default InterviewIllustration;
