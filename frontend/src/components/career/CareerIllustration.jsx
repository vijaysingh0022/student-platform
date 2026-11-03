import React from "react";

export const CareerIllustration = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[200px] flex items-center justify-center select-none pointer-events-none">
      {/* Ambient glowing radial backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/35 to-pink-500/20 rounded-full blur-2xl transform -translate-y-2" />

      {/* Cyberpunk EdTech Career Dashboard & Candidate Vector SVG */}
      <svg
        viewBox="0 0 340 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="careerDeskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="careerHoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="careerFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id="careerHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="cardGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0d1117" />
          </linearGradient>
          <filter id="careerSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Floating Career Pill 1: Resume ATS Score: 70% (Top Left) --- */}
        <g transform="translate(15, 20)">
          <rect
            x="0"
            y="0"
            width="85"
            height="34"
            rx="8"
            fill="url(#cardGradDark)"
            stroke="#38bdf8"
            strokeWidth="1.2"
            filter="url(#careerSoftGlow)"
          />
          <rect x="6" y="8" width="16" height="18" rx="3" fill="#0284c7" />
          <line x1="9" y1="13" x2="19" y2="13" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9" y1="17" x2="17" y2="17" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="9" y1="21" x2="15" y2="21" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <text x="27" y="16" fill="#94a3b8" fontSize="7" fontWeight="bold">Resume</text>
          <text x="27" y="25" fill="#38bdf8" fontSize="8" fontWeight="900">ATS Score: 70%</text>
        </g>

        {/* --- Floating Career Pill 2: Skill Gap: 3 Areas (Bottom Left) --- */}
        <g transform="translate(5, 75)">
          <rect
            x="0"
            y="0"
            width="82"
            height="30"
            rx="8"
            fill="url(#cardGradDark)"
            stroke="#10b981"
            strokeWidth="1.2"
            filter="url(#careerSoftGlow)"
          />
          <rect x="6" y="7" width="16" height="16" rx="4" fill="#059669" />
          {/* Bar graph mini */}
          <line x1="10" y1="19" x2="10" y2="15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="19" x2="14" y2="11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="19" x2="18" y2="13" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" />
          <text x="27" y="15" fill="#94a3b8" fontSize="7" fontWeight="bold">Skill Gap</text>
          <text x="27" y="24" fill="#34d399" fontSize="8" fontWeight="900">3 Areas</text>
        </g>

        {/* --- Floating Career Pill 3: Job Matches: 12 New (Top Right) --- */}
        <g transform="translate(195, 18)">
          <rect
            x="0"
            y="0"
            width="85"
            height="34"
            rx="8"
            fill="url(#cardGradDark)"
            stroke="#c084fc"
            strokeWidth="1.2"
            filter="url(#careerSoftGlow)"
          />
          <rect x="6" y="8" width="18" height="18" rx="4" fill="#7c3aed" />
          {/* Briefcase mini */}
          <rect x="9" y="13" width="12" height="10" rx="1.5" fill="#e9d5ff" />
          <path d="M12 13 L12 11 Q15 9 18 11 L18 13" stroke="#e9d5ff" strokeWidth="1.2" fill="none" />
          <text x="29" y="16" fill="#94a3b8" fontSize="7" fontWeight="bold">Job Matches</text>
          <text x="29" y="25" fill="#c084fc" fontSize="8" fontWeight="900">12 New</text>
        </g>

        {/* --- Floating Career Pill 4: Mock Interview: 4/5 Completed (Right) --- */}
        <g transform="translate(205, 75)">
          <rect
            x="0"
            y="0"
            width="90"
            height="32"
            rx="8"
            fill="url(#cardGradDark)"
            stroke="#818cf8"
            strokeWidth="1.2"
            filter="url(#careerSoftGlow)"
          />
          <circle cx="15" cy="16" r="8" fill="#4338ca" />
          <path d="M15 11 L15 16 L18 18" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          <text x="28" y="15" fill="#94a3b8" fontSize="7" fontWeight="bold">Mock Interview</text>
          <text x="28" y="24" fill="#818cf8" fontSize="8" fontWeight="900">4/5 Completed</text>
        </g>

        {/* --- Desk Surface --- */}
        <path
          d="M15 195 L325 195 L310 215 L30 215 Z"
          fill="url(#careerDeskGrad)"
          stroke="#312e81"
          strokeWidth="1.5"
        />

        {/* --- Central Laptop with 'LX' Logo --- */}
        <g transform="translate(100, 115)">
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
            filter="url(#careerSoftGlow)"
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
        <g transform="translate(200, 160)">
          <rect x="0" y="8" width="22" height="25" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M22 14 C27 14, 27 24, 22 24" stroke="#f8fafc" strokeWidth="2.5" fill="none" />
          <text x="11" y="24" textAnchor="middle" fill="#4f46e5" fontSize="7" fontWeight="bold">LX</text>
        </g>

        {/* --- Student Candidate Character with Cyan Headphones --- */}
        <g transform="translate(170, 75)">
          {/* Body / Hoodie */}
          <path
            d="M20 70 C10 60, -5 85, -15 120 L55 120 C45 90, 35 60, 20 70 Z"
            fill="url(#careerHoodieGrad)"
            stroke="#4338ca"
            strokeWidth="1.5"
          />

          {/* Hand typing */}
          <ellipse cx="-48" cy="116" rx="6" ry="4" fill="#fed7aa" />

          {/* Neck */}
          <rect x="14" y="52" width="12" height="15" rx="3" fill="#fed7aa" />

          {/* Head & Face */}
          <ellipse cx="20" cy="40" rx="17" ry="18" fill="url(#careerFaceGrad)" />
          <ellipse cx="14" cy="38" rx="2" ry="2.5" fill="#1e1b4b" />
          <ellipse cx="23" cy="38" rx="2" ry="2.5" fill="#1e1b4b" />
          <circle cx="13.5" cy="37" r="0.8" fill="#ffffff" />
          <circle cx="22.5" cy="37" r="0.8" fill="#ffffff" />
          <path d="M16 46 Q20 50 24 46" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Hair */}
          <path
            d="M4 35 C3 20, 15 15, 24 15 C33 15, 39 24, 38 35 C33 26, 25 22, 18 24 C10 26, 6 32, 4 35 Z"
            fill="url(#careerHairGrad)"
          />

          {/* Cyan Glowing Headphones */}
          <path
            d="M3 38 C-2 30, 2 12, 20 12 C38 12, 42 30, 37 38"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            filter="url(#careerSoftGlow)"
          />
          <ellipse cx="4" cy="38" rx="4" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <ellipse cx="36" cy="38" rx="4" ry="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

export default CareerIllustration;
