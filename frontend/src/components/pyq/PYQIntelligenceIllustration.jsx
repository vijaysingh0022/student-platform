import React from "react";

export const PYQIntelligenceIllustration = ({ className = "w-full max-w-[340px] h-[160px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background radial glow */}
      <div className="absolute w-56 h-36 rounded-full bg-gradient-to-tr from-purple-500/25 via-indigo-500/20 to-blue-400/20 blur-2xl" />

      <svg
        viewBox="0 0 360 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="sheetGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <linearGradient id="aiBadgeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* ── 1. MAIN EXAM QUESTION PAPER SHEET (PYQ) ── */}
        <g transform="translate(70, 18)">
          {/* Main Paper Body */}
          <rect
            x="0"
            y="0"
            width="125"
            height="140"
            rx="8"
            fill="url(#sheetGrad)"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            filter="url(#cardShadow)"
          />
          {/* Paper Top Corner Fold */}
          <path d="M107 0 L125 18 L107 18 Z" fill="#e2e8f0" />

          {/* Heading "PYQ" */}
          <text x="14" y="24" fill="#4338ca" fontSize="11" fontWeight="900" letterSpacing="0.5">
            PYQ
          </text>

          {/* Checklist Items */}
          {/* Row 1 */}
          <rect x="14" y="36" width="9" height="9" rx="2.5" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M16 40.5 L17.5 42 L21 38.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="41" x2="95" y2="41" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 2 */}
          <rect x="14" y="52" width="9" height="9" rx="2.5" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M16 56.5 L17.5 58 L21 54.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="57" x2="88" y2="57" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 3 */}
          <rect x="14" y="68" width="9" height="9" rx="2.5" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M16 72.5 L17.5 74 L21 70.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="73" x2="92" y2="73" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 4 */}
          <rect x="14" y="84" width="9" height="9" rx="2.5" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M16 88.5 L17.5 90 L21 86.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="89" x2="80" y2="89" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 5 */}
          <rect x="14" y="100" width="9" height="9" rx="2.5" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M16 104.5 L17.5 106 L21 102.5" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="28" y1="105" x2="72" y2="105" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* ── 2. GRADUATION MORTARBOARD CAP (Top Center) ── */}
        <g transform="translate(195, 10)">
          {/* Diamond Cap */}
          <polygon
            points="45,0 90,14 45,28 0,14"
            fill="url(#capGrad)"
            stroke="#4338ca"
            strokeWidth="1.2"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
          />
          {/* Skull Cap Base */}
          <path
            d="M20 20 L20 28 C20 36 70 36 70 28 L70 20 Z"
            fill="#1e1b4b"
            opacity="0.95"
          />
          {/* Golden Tassel */}
          <line x1="45" y1="14" x2="78" y2="24" stroke="#fbbf24" strokeWidth="1.6" />
          <circle cx="78" cy="24" r="1.5" fill="#f59e0b" />
          <path d="M78 24 L82 34 L76 34 Z" fill="#fbbf24" />
        </g>

        {/* ── 3. STACKED STUDY BOOKS (Bottom Right) ── */}
        <g transform="translate(210, 92)">
          {/* Book 1 (Bottom - Blue) */}
          <rect x="0" y="24" width="75" height="14" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
          <rect x="4" y="26" width="67" height="10" rx="1.5" fill="#ffffff" />
          <line x1="2" y1="24" x2="2" y2="38" stroke="#1e40af" strokeWidth="3" />

          {/* Book 2 (Middle - Purple) */}
          <rect x="5" y="10" width="70" height="14" rx="3" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1" />
          <rect x="9" y="12" width="62" height="10" rx="1.5" fill="#ffffff" />
          <line x1="7" y1="10" x2="7" y2="24" stroke="#5b21b6" strokeWidth="3" />
        </g>

        {/* ── 4. MAGNIFYING GLASS WITH "AI" EMBEDDED IN LENS ── */}
        <g transform="translate(170, 48)">
          {/* Handle */}
          <line
            x1="38"
            y1="38"
            x2="62"
            y2="62"
            stroke="#3b82f6"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="38"
            y1="38"
            x2="62"
            y2="62"
            stroke="#1d4ed8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Outer Ring */}
          <circle
            cx="22"
            cy="22"
            r="23"
            fill="none"
            stroke="#818cf8"
            strokeWidth="5"
            filter="drop-shadow(0 4px 10px rgba(99, 102, 241, 0.4))"
          />

          {/* Inner Glass Lens */}
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="url(#aiBadgeGrad)"
          />

          {/* Glowing "AI" text */}
          <text
            x="22"
            y="28"
            fill="#ffffff"
            fontSize="14"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="0.8"
          >
            AI
          </text>
        </g>

        {/* ── 5. "Exam Insights" FLOATING CARD (Top Right) ── */}
        <g transform="translate(255, 30)">
          {/* Card background */}
          <rect
            x="0"
            y="0"
            width="82"
            height="50"
            rx="6"
            fill="#1e1b4b"
            fillOpacity="0.85"
            stroke="#4338ca"
            strokeWidth="1"
            filter="drop-shadow(0 6px 14px rgba(0,0,0,0.35))"
          />
          {/* Header */}
          <text x="8" y="13" fill="#c7d2fe" fontSize="8" fontWeight="700">
            Exam Insights
          </text>

          {/* Mini Bar Chart */}
          {/* Bar 1 */}
          <rect x="12" y="32" width="6" height="8" rx="1.5" fill="url(#barGrad)" />
          {/* Bar 2 */}
          <rect x="22" y="27" width="6" height="13" rx="1.5" fill="url(#barGrad)" />
          {/* Bar 3 */}
          <rect x="32" y="23" width="6" height="17" rx="1.5" fill="url(#barGrad)" />
          {/* Bar 4 */}
          <rect x="42" y="19" width="6" height="21" rx="1.5" fill="url(#barGrad)" />
          {/* Bar 5 */}
          <rect x="52" y="16" width="6" height="24" rx="1.5" fill="url(#barGrad)" />
          {/* Baseline */}
          <line x1="8" y1="41" x2="74" y2="41" stroke="#3730a3" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

export default PYQIntelligenceIllustration;
