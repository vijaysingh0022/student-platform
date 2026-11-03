import React from "react";

export const OfflineLearningIllustration = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[190px] flex items-center justify-center select-none pointer-events-none">
      {/* Soft ambient backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/25 to-blue-500/20 rounded-full blur-2xl transform -translate-y-2" />

      {/* 3D Laptop with Download Progress Screen, Books Stack, Plant, Purple Headphones, and Offline Signal Badge SVG */}
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0d1117" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="downloadBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="purpleHeadphonesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="bookBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="bookOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <filter id="softDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.25" floodColor="#000" />
          </filter>
        </defs>

        {/* --- Books Stack & Plant on Left --- */}
        <g transform="translate(60, 95)">
          {/* Plant in Pot */}
          <path d="M18 10 L30 10 L28 25 L20 25 Z" fill="#4f46e5" />
          <circle cx="24" cy="5" r="7" fill="#10b981" />
          <circle cx="18" cy="2" r="5" fill="#34d399" />
          <circle cx="30" cy="3" r="5" fill="#059669" />

          {/* Book 1 (Blue) */}
          <rect x="0" y="25" width="52" height="12" rx="2" fill="url(#bookBlue)" filter="url(#softDropShadow)" />
          <rect x="4" y="27" width="44" height="2" fill="#e0f2fe" opacity="0.6" />

          {/* Book 2 (Orange/Amber) */}
          <rect x="-4" y="38" width="60" height="13" rx="2" fill="url(#bookOrange)" filter="url(#softDropShadow)" />
          <rect x="0" y="40" width="52" height="2.5" fill="#ffedd5" opacity="0.6" />
        </g>

        {/* --- Central Laptop --- */}
        <g transform="translate(115, 65)">
          {/* Laptop Base Keyboard */}
          <path d="M10 95 L135 95 L145 106 L0 106 Z" fill="#334155" filter="url(#softDropShadow)" />
          <rect x="55" y="97" width="36" height="4" rx="2" fill="#64748b" />

          {/* Laptop Screen Open */}
          <rect
            x="14"
            y="5"
            width="118"
            height="90"
            rx="7"
            fill="url(#laptopGrad)"
            stroke="#6366f1"
            strokeWidth="1.8"
          />
          <rect x="18" y="9" width="110" height="82" rx="4" fill="url(#screenGrad)" />

          {/* Download Icon on Screen */}
          <g transform="translate(62, 22)">
            <rect x="0" y="0" width="22" height="22" rx="5" fill="#3b82f6" opacity="0.9" />
            <path d="M11 5 L11 15 M7 11 L11 15 L15 11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="6" y1="18" x2="16" y2="18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Emerald Download Progress Bar */}
          <rect x="30" y="55" width="86" height="6.5" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
          <rect x="30" y="55" width="68" height="6.5" rx="3" fill="url(#downloadBarGrad)" />
        </g>

        {/* --- Purple Wireless Over-Ear Headphones (Front Center/Right) --- */}
        <g transform="translate(160, 140)">
          {/* Headband */}
          <path
            d="M5 25 C5 -5, 65 -5, 65 25"
            stroke="url(#purpleHeadphonesGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            filter="url(#softDropShadow)"
          />
          {/* Left Ear Cushion */}
          <ellipse cx="6" cy="30" rx="9" ry="14" fill="#a855f7" />
          <ellipse cx="6" cy="30" rx="6" ry="10" fill="#6b21a8" />

          {/* Right Ear Cushion */}
          <ellipse cx="64" cy="30" rx="9" ry="14" fill="#a855f7" />
          <ellipse cx="64" cy="30" rx="6" ry="10" fill="#6b21a8" />
        </g>

        {/* --- Floating No-Wi-Fi Offline Circular Badge (Top Right) --- */}
        <g transform="translate(235, 30)">
          {/* Badge Background Circle */}
          <circle cx="24" cy="24" r="22" fill="#312e81" stroke="#6366f1" strokeWidth="2" filter="url(#softDropShadow)" />
          {/* Wi-Fi Waves */}
          <path d="M12 16 Q24 7 36 16" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M16 21 Q24 14 32 21" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="28" r="2.5" fill="#93c5fd" />
          {/* Slash Across Wi-Fi (No-Internet) */}
          <line x1="10" y1="10" x2="38" y2="38" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default OfflineLearningIllustration;
