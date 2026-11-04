import React from "react";

export const PYQIntelligenceIllustration = ({ className = "w-full max-w-[360px] h-[170px]" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-60 h-40 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/25 blur-2xl" />

      <svg
        viewBox="0 0 380 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="sheetGradRef2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="aiOrbRef2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="capRef2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="checklistBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
          </linearGradient>
          <filter id="softShadowRef2" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* ── 1. PYQ QUESTION PAPER SHEET (Left) ── */}
        <g transform="translate(60, 20)">
          <rect
            x="0"
            y="0"
            width="135"
            height="145"
            rx="10"
            fill="url(#sheetGradRef2)"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            filter="url(#softShadowRef2)"
          />
          {/* Fold Corner */}
          <path d="M115 0 L135 20 L115 20 Z" fill="#e2e8f0" />

          {/* Heading "PYQ" */}
          <text x="16" y="26" fill="#1e40af" fontSize="13" fontWeight="900" letterSpacing="0.8">
            PYQ
          </text>

          {/* Checkbox Rows */}
          {/* Row 1 */}
          <rect x="16" y="38" width="10" height="10" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M18.5 43 L20 44.5 L23.5 41" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="43" x2="105" y2="43" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 2 */}
          <rect x="16" y="55" width="10" height="10" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M18.5 60 L20 61.5 L23.5 58" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="60" x2="95" y2="60" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 3 */}
          <rect x="16" y="72" width="10" height="10" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M18.5 77 L20 78.5 L23.5 75" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="77" x2="100" y2="77" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 4 */}
          <rect x="16" y="89" width="10" height="10" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M18.5 94 L20 95.5 L23.5 92" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="94" x2="85" y2="94" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Row 5 */}
          <rect x="16" y="106" width="10" height="10" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.2" />
          <path d="M18.5 111 L20 112.5 L23.5 109" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="32" y1="111" x2="75" y2="111" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* ── 2. GRADUATION MORTARBOARD CAP (Top Center) ── */}
        <g transform="translate(195, 12)">
          {/* Diamond Cap */}
          <polygon
            points="48,0 96,15 48,30 0,15"
            fill="url(#capRef2)"
            stroke="#2563eb"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
          />
          {/* Base */}
          <path d="M22 22 L22 30 C22 38 74 38 74 30 L74 22 Z" fill="#0f172a" />
          {/* Gold Tassel */}
          <line x1="48" y1="15" x2="82" y2="25" stroke="#f59e0b" strokeWidth="1.8" />
          <circle cx="82" cy="25" r="2" fill="#d97706" />
          <path d="M82 25 L86 36 L80 36 Z" fill="#f59e0b" />
        </g>

        {/* ── 3. STUDY BOOKS (Stacked Bottom Right) ── */}
        <g transform="translate(225, 96)">
          {/* Book 1 (Bottom Blue) */}
          <rect x="0" y="24" width="85" height="15" rx="3" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
          <rect x="4" y="26" width="77" height="11" rx="1.5" fill="#ffffff" />
          <line x1="3" y1="24" x2="3" y2="39" stroke="#1e40af" strokeWidth="3" />

          {/* Book 2 (Top Cyan/Blue) */}
          <rect x="6" y="9" width="78" height="15" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          <rect x="10" y="11" width="70" height="11" rx="1.5" fill="#ffffff" />
          <line x1="9" y1="9" x2="9" y2="24" stroke="#075985" strokeWidth="3" />
        </g>

        {/* ── 4. MAGNIFYING GLASS WITH "AI" CORE (Center) ── */}
        <g transform="translate(170, 50)">
          {/* Handle */}
          <line x1="40" y1="40" x2="68" y2="68" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
          <line x1="40" y1="40" x2="68" y2="68" stroke="#1d4ed8" strokeWidth="3.5" strokeLinecap="round" />

          {/* Outer Lens Rim */}
          <circle
            cx="24"
            cy="24"
            r="25"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="5.5"
            filter="drop-shadow(0 4px 12px rgba(59, 130, 246, 0.45))"
          />

          {/* Lens Fill */}
          <circle cx="24" cy="24" r="21" fill="url(#aiOrbRef2)" />

          {/* AI Text in Lens */}
          <text
            x="24"
            y="30"
            fill="#ffffff"
            fontSize="15"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="0.8"
          >
            AI
          </text>
        </g>

        {/* ── 5. EXAM INSIGHTS CHECKLIST FLOATING CARD (Right) ── */}
        <g transform="translate(268, 22)">
          {/* Card background */}
          <rect
            x="0"
            y="0"
            width="105"
            height="72"
            rx="8"
            fill="url(#checklistBg)"
            stroke="#334155"
            strokeWidth="1"
            filter="drop-shadow(0 8px 16px rgba(0,0,0,0.3))"
          />

          {/* Item 1 */}
          <g transform="translate(10, 14)">
            <circle cx="4" cy="4" r="4" fill="#10b981" />
            <path d="M2.5 4 L3.5 5 L5.5 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <text x="12" y="7" fill="#f1f5f9" fontSize="8" fontWeight="700">
              Analyze Pattern
            </text>
          </g>

          {/* Item 2 */}
          <g transform="translate(10, 28)">
            <circle cx="4" cy="4" r="4" fill="#10b981" />
            <path d="M2.5 4 L3.5 5 L5.5 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <text x="12" y="7" fill="#f1f5f9" fontSize="8" fontWeight="700">
              Find Repeated Qs
            </text>
          </g>

          {/* Item 3 */}
          <g transform="translate(10, 42)">
            <circle cx="4" cy="4" r="4" fill="#10b981" />
            <path d="M2.5 4 L3.5 5 L5.5 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <text x="12" y="7" fill="#f1f5f9" fontSize="8" fontWeight="700">
              Unit-wise Insights
            </text>
          </g>

          {/* Item 4 */}
          <g transform="translate(10, 56)">
            <circle cx="4" cy="4" r="4" fill="#10b981" />
            <path d="M2.5 4 L3.5 5 L5.5 3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <text x="12" y="7" fill="#f1f5f9" fontSize="8" fontWeight="700">
              Revision Plan
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PYQIntelligenceIllustration;
