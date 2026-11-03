import React from "react";

export const LearningRewardsIllustration = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[190px] flex items-center justify-center select-none pointer-events-none">
      {/* Soft ambient backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-purple-500/25 to-indigo-500/20 rounded-full blur-2xl transform -translate-y-2" />

      {/* 3D Isometric Trophy, Stack of Books, Gift Box, and Gold Coins SVG */}
      <svg
        viewBox="0 0 320 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <linearGradient id="goldTrophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="giftBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="giftRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="bookPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id="bookBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <filter id="rewardShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.25" floodColor="#000" />
          </filter>
        </defs>

        {/* --- Books Base Pedestal --- */}
        <g transform="translate(140, 150)">
          {/* Bottom Book (Deep Purple) */}
          <path d="M10 20 L95 2 L115 15 L30 33 Z" fill="url(#bookPurpleGrad)" filter="url(#rewardShadow)" />
          <path d="M10 20 L30 33 L30 43 L10 30 Z" fill="#581c87" />
          <path d="M30 33 L115 15 L115 25 L30 43 Z" fill="#e2e8f0" />

          {/* Top Book (Cobalt Blue) */}
          <path d="M15 5 L90 -10 L108 2 L33 17 Z" fill="url(#bookBlueGrad)" filter="url(#rewardShadow)" />
          <path d="M15 5 L33 17 L33 27 L15 15 Z" fill="#1e3a8a" />
          <path d="M33 17 L108 2 L108 12 L33 27 Z" fill="#f8fafc" />
        </g>

        {/* --- Big Golden Trophy standing on Books --- */}
        <g transform="translate(180, 40)">
          {/* Trophy Cup */}
          <path
            d="M15 15 C15 65, 30 85, 45 92 L45 105 L35 110 L55 110 L45 105 C60 85, 75 65, 75 15 Z"
            fill="url(#goldTrophyGrad)"
            filter="url(#rewardShadow)"
          />
          {/* Cup Rim Top */}
          <ellipse cx="45" cy="15" rx="30" ry="10" fill="#fef08a" />
          <ellipse cx="45" cy="15" rx="26" ry="8" fill="#d97706" />

          {/* Trophy Base Pedestal */}
          <path d="M28 110 L62 110 L68 125 L22 125 Z" fill="#b45309" />
          <rect x="25" y="112" width="40" height="3" fill="#fef08a" opacity="0.8" />

          {/* Trophy Handles */}
          <path
            d="M17 25 C-5 35, -2 65, 23 68 C15 58, 12 40, 19 32 Z"
            fill="url(#goldTrophyGrad)"
          />
          <path
            d="M73 25 C95 35, 92 65, 67 68 C75 58, 78 40, 71 32 Z"
            fill="url(#goldTrophyGrad)"
          />

          {/* Star Embellishment on Trophy */}
          <path
            d="M45 42 L48 50 L56 50 L50 55 L52 63 L45 58 L38 63 L40 55 L34 50 L42 50 Z"
            fill="#fef9c3"
            stroke="#b45309"
            strokeWidth="0.8"
          />

          {/* Laurel Wreath surrounding trophy base */}
          <path d="M0 80 Q-8 40 10 20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="2" cy="65" r="3.5" fill="#34d399" />
          <circle cx="-3" cy="50" r="3.5" fill="#10b981" />
          <circle cx="0" cy="35" r="3.5" fill="#059669" />

          <path d="M90 80 Q98 40 80 20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="88" cy="65" r="3.5" fill="#34d399" />
          <circle cx="93" cy="50" r="3.5" fill="#10b981" />
          <circle cx="90" cy="35" r="3.5" fill="#059669" />
        </g>

        {/* --- Purple & Gold Gift Box (Front Left of Trophy) --- */}
        <g transform="translate(130, 130)">
          {/* Box Bottom */}
          <rect x="0" y="15" width="48" height="42" rx="4" fill="url(#giftBoxGrad)" filter="url(#rewardShadow)" />
          {/* Box Lid */}
          <rect x="-3" y="8" width="54" height="12" rx="3" fill="#6366f1" />

          {/* Vertical Ribbon */}
          <rect x="18" y="8" width="12" height="49" fill="url(#giftRibbonGrad)" />
          {/* Horizontal Ribbon */}
          <rect x="0" y="30" width="48" height="10" fill="url(#giftRibbonGrad)" />

          {/* Ribbon Bow on Top */}
          <ellipse cx="16" cy="6" rx="8" ry="5" fill="url(#giftRibbonGrad)" transform="rotate(-25 16 6)" />
          <ellipse cx="32" cy="6" rx="8" ry="5" fill="url(#giftRibbonGrad)" transform="rotate(25 32 6)" />
          <circle cx="24" cy="8" r="4" fill="#fde047" />
        </g>

        {/* --- Gold Coins on Floor --- */}
        <g transform="translate(105, 170)">
          {/* Coin 1 (Tilted Standing) */}
          <ellipse cx="20" cy="18" rx="14" ry="14" fill="url(#goldCoinGrad)" filter="url(#rewardShadow)" />
          <ellipse cx="20" cy="18" rx="10" ry="10" fill="#fef08a" />
          <text x="20" y="22" fill="#b45309" fontSize="10" fontWeight="900" textAnchor="middle">★</text>

          {/* Coin 2 (Flat on floor) */}
          <ellipse cx="5" cy="28" rx="12" ry="5" fill="url(#goldCoinGrad)" />
          <ellipse cx="5" cy="27" rx="9" ry="3.5" fill="#fef08a" />
        </g>
      </svg>
    </div>
  );
};

export default LearningRewardsIllustration;
